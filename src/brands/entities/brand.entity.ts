import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('brands')
export class Brand {
  @ApiProperty({
    example: '0d6f0da6-14ee-4a87-af7c-07df821e1d11',
    description: 'Brand ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Nike',
    description: 'Brand name',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  name: string;

  @BeforeInsert()
  validName() {
    this.name = this.name.toLowerCase();
  }

  @BeforeUpdate()
  validNameUpdate() {
    this.validName();
  }
}
