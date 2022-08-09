import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class ProductPaginationDto extends PaginationDto {
  @ApiProperty({
    default: '',
    description: 'search products by title or model',
  })
  @IsString()
  @IsOptional()
  productTerm?: string;

  @ApiProperty({
    default: null,
    description: 'search products by releaseDate in UNIX date',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  productDate?: number;

  @ApiProperty({
    default: null,
    description: 'search products by store by ID',
  })
  @IsString()
  @IsOptional()
  productStore?: string;

  @ApiProperty({
    default: null,
    description: 'search products by brand by ID',
  })
  @IsString()
  @IsOptional()
  productBrand?: string;
}
