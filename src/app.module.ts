import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [ProductsModule, ReviewsModule, UsersModule],
})
export class AppModule {}
