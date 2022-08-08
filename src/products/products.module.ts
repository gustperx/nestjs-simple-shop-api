import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product, ProductImage } from './entities';
import { StoresModule } from '../stores/stores.module';
import { BrandsModule } from '../brands/brands.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    AuthModule,
    StoresModule,
    BrandsModule,
  ],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
