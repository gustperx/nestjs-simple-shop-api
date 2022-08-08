import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ProductImage } from './';
import { Store } from '../../stores/entities/store.entity';
import { Brand } from '../../brands/entities/brand.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '0d6f0da6-14ee-4a87-af7c-07df821e1d11',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Shoes ABC',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 1,
    description: 'Product price',
  })
  @Column('float', {
    default: 1,
  })
  price: number;

  @ApiProperty({
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc blandit rutrum condimentum.',
    description: 'Product description',
    default: null,
    required: false,
  })
  @Column('text', {
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'product_demo_slug',
    description: 'Product Slug',
    uniqueItems: true,
    required: false,
  })
  @Column('text', {
    unique: true,
  })
  slug?: string;

  @ApiProperty({
    example: 'Product model',
    description: 'Product model',
  })
  @Column('text')
  model: string;

  @ApiProperty({
    example: ['Shoes', 'Red'],
    description: 'Product tags',
    default: [],
    required: false,
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty({
    example: ['http://image1.jpg', 'http://image2.jpg'],
    description: 'Product images',
    default: [],
    required: false,
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ApiProperty({
    minLength: 1,
    description: 'Stores ID',
    example: [
      '0d6f0da6-14ee-4a87-af7c-07df821e1d11',
      '0d6f0da6-14ee-4a87-af7c-07df821e1d22',
    ],
  })
  @ManyToMany(() => Store, (store) => store.products, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  stores: Store[];

  @ApiProperty({
    minLength: 1,
    example: '0d6f0da6-14ee-4a87-af7c-07df821e1d11',
    description: 'Brand ID',
  })
  @ManyToOne(() => Brand, (brand) => brand.products, {
    onDelete: 'SET NULL',
    eager: true,
  })
  brand: Brand;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.checkSlugInsert();
  }
}
