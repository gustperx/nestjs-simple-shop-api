import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title (unique)',
    minLength: 1,
    example: 'Product ABC',
  })
  @IsString()
  @MinLength(1)
  readonly title: string;

  @ApiProperty({
    description: 'Product price',
    minimum: 1,
    example: 14.99,
  })
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ApiProperty({
    description: 'Product model',
    minLength: 1,
    example: 'Model ABC',
  })
  @IsString()
  @MinLength(1)
  readonly model: string;

  @ApiProperty({
    required: false,
    minLength: 0,
    description: 'Product description',
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc blandit rutrum condimentum.',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    required: false,
    minLength: 1,
    description: 'Product Slug (unique)',
    example: 'product_abc',
  })
  @ApiProperty()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    required: false,
    minLength: 0,
    description: 'Product tags',
    example: ['Shoes', 'Red', 'Blue'],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    required: false,
    minLength: 0,
    description: 'Product images',
    example: ['http://image1.jpg', 'http://image2.jpg'],
  })
  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
