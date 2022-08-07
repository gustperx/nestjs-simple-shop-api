import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    example: '0d6f0da6-14ee-4a87-af7c-07df821e1d11',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'hello@example.com',
    description: 'User email',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'Super123',
    description: 'User password',
  })
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty({
    example: 'My Name',
    description: 'User name',
    required: false,
  })
  @Column('text')
  fullName: string;

  @Column('boolean', {
    default: true,
  })
  isActive: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @BeforeInsert()
  checkFieldsInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsUpdate() {
    this.checkFieldsInsert();
  }
}
