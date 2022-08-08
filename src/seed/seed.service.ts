import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertUsers();
    return 'Seed Executed';
  }

  private async deleteTables() {
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
}
