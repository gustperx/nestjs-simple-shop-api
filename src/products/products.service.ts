import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { validate as isUUID } from 'uuid';

import { Product, ProductImage } from './entities';
import { Brand } from '../brands/entities/brand.entity';
import { Store } from '../stores/entities/store.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,

    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { images = [], brand, stores, ...productDetails } = createProductDto;

    const brandDB = await this.prepareBrand(brand);
    const storesDB = await this.prepareStores(stores);

    try {
      const product = this.productsRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      product.brand = brandDB;
      product.stores = storesDB;

      await this.productsRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });

    return products.map((product) => ({
      ...product,
      images: product.images.map((image) => image.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('LOWER(title) = :title or slug = :slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }

    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, brand, stores, ...toUpdate } = updateProductDto;

    const productUpdate = await this.productsRepository.preload({
      id,
      ...toUpdate,
    });

    if (!productUpdate) throw new NotFoundException();

    // Query Runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (brand) {
      productUpdate.brand = await this.prepareBrand(brand);
    }

    if (stores) {
      productUpdate.stores = await this.prepareStores(stores);
    }

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        productUpdate.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(productUpdate);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async deleteAllProducts() {
    const query = this.productsRepository.createQueryBuilder('product');
    try {
      return query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private async prepareBrand(id) {
    const brand = await this.brandsRepository.findOneBy({ id });

    if (!brand) {
      throw new BadRequestException(`Brand is not valid ${id}`);
    }

    return brand;
  }

  private async prepareStores(storeIds: string[]) {
    const storesDB = [];
    for (const storeId of storeIds) {
      const store = await this.storesRepository.findOneBy({ id: storeId });
      if (!store) {
        throw new BadRequestException(`Store is not valid ${storeId}`);
      }
      storesDB.push(store);
    }

    return [...storesDB];
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
