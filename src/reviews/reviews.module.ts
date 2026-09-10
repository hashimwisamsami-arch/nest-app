import { Module } from '@nestjs/common';
import { ReviewsControllers } from './reviews.controller.js';
import { ReviewService } from './reviews.service.js';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity.js';

@Module({
  controllers: [ReviewsControllers],
  providers: [ReviewService],

  imports: [TypeOrmModule.forFeature([Review])],
})
export class ReviewsModule {}
