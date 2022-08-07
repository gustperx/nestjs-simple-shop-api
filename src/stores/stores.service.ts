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
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  private readonly logger = new Logger('Stores');

  constructor(
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    try {
      const store = this.storesRepository.create(createStoreDto);
      await this.storesRepository.save(store);
      return store;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const stores = await this.storesRepository.find({
      take: limit,
      skip: offset,
    });

    return stores;
  }

  async findOne(id: string) {
    const store = await this.storesRepository.findOneBy({ id });

    if (!store) {
      throw new NotFoundException(`Store with ${id} not found`);
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const store = await this.storesRepository.preload({
      id,
      ...updateStoreDto,
    });

    if (!store) throw new NotFoundException();

    try {
      await this.storesRepository.save(store);
      return store;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const store = await this.findOne(id);
    await this.storesRepository.remove(store);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
