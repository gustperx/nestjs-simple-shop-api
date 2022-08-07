import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { initialData } from './data/seed-data';
import { ProductsService } from './../products/products.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertUsers();
    await this.insertNewProducts();
    return 'Seed Executed';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.usersRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.map((user) => {
      users.push(this.usersRepository.create(user));
    });

    await this.usersRepository.save(users);
  }

  private async insertNewProducts() {
    const products = initialData.products;
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
