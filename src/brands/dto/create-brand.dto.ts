import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    example: 'Nike',
    description: 'Brand name',
    uniqueItems: true,
  })
  @IsString()
  @MinLength(1)
  readonly name: string;
}
