import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class BrandsService {
  private readonly logger = new Logger('Brands');

  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const brand = this.brandsRepository.create(createBrandDto);
      await this.brandsRepository.save(brand);
      return brand;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.brandsRepository.find({
      take: limit,
      skip: offset,
    });

    return products;
  }

  async findOne(term: string) {
    let brand: Brand;

    if (isUUID(term)) {
      brand = await this.brandsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.brandsRepository.createQueryBuilder('brand');
      brand = await queryBuilder
        .where('LOWER(name) = :name', {
          name: term.toLowerCase(),
        })
        .getOne();
    }

    if (!brand) {
      throw new NotFoundException(`Brand with ${term} not found`);
    }

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandsRepository.preload({
      id,
      ...updateBrandDto,
    });

    if (!brand) throw new NotFoundException();

    try {
      await this.brandsRepository.save(brand);
      return brand;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const brand = await this.findOne(id);
    await this.brandsRepository.remove(brand);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
