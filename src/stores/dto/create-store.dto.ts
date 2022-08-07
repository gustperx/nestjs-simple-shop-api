import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    example: 'Amazon',
    description: 'Store name',
    uniqueItems: true,
  })
  @IsString()
  @MinLength(1)
  readonly name: string;

  @ApiProperty({
    required: false,
    minLength: 1,
    description: 'Store URL',
    example: 'http://storename.com',
  })
  @IsUrl()
  @IsOptional()
  readonly url?: string;

  @ApiProperty({
    required: false,
    minLength: 1,
    description: 'Store Slug (unique)',
    example: 'amazon_slug',
  })
  @IsString()
  @IsOptional()
  slug?: string;
}
