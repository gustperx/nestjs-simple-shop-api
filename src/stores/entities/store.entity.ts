import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('stores')
export class Store {
  @ApiProperty({
    example: '0d6f0da6-14ee-4a87-af7c-07df821e1d11',
    description: 'Store ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Amazon',
    description: 'Store name',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  name: string;

  @ApiProperty({
    example: 'https://storename.com',
    description: 'Store URL',
    required: false,
  })
  @Column('text', {
    nullable: true,
  })
  url?: string;

  @ApiProperty({
    example: 'store_slug',
    description: 'Store Slug',
    uniqueItems: true,
    required: false,
  })
  @Column('text', {
    unique: true,
  })
  slug?: string;

  @ManyToMany(() => Product, (product) => product.stores, {
    eager: false,
  })
  @JoinTable()
  products?: Product[];

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.name;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeInsert()
  validName() {
    this.name = this.name.toLowerCase();
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  validNameUpdate() {
    this.validName();
  }
}
