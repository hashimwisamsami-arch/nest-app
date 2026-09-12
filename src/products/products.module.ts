import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product]), UsersModule, JwtModule],
})
export class ProductsModule {}
