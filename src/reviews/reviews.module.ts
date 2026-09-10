import { forwardRef, Module } from '@nestjs/common';
import { ReviewsControllers } from './reviews.controller.js';
import { ReviewService } from './reviews.service.js';
import { UsersModule } from '../users/users.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity.js';

@Module({
  controllers: [ReviewsControllers],
  providers: [ReviewService],
  exports: [ReviewService],
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Review])],
})
export class ReviewsModule {}
