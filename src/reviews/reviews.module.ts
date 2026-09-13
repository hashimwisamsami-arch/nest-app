import { Module } from '@nestjs/common';
import { ReviewsControllers } from './reviews.controller.js';
import { ReviewService } from './reviews.service.js';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity.js';
import { ProductsModule } from '../products/products.module.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ReviewsControllers],
  providers: [ReviewService],

  imports: [
    TypeOrmModule.forFeature([Review]),
    ProductsModule,
    UsersModule,
    JwtModule,
  ],
})
export class ReviewsModule {}
