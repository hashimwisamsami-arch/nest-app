import { Module } from '@nestjs/common';
import { ReviewsControllers } from './reviews.controller.js';

@Module({
  controllers: [ReviewsControllers],
})
export class ReviewsModule {}
