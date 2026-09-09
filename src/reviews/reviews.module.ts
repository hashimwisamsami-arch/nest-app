import { forwardRef, Module } from '@nestjs/common';
import { ReviewsControllers } from './reviews.controller.js';
import { ReviewService } from './reviews.service.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  controllers: [ReviewsControllers],
  providers: [ReviewService],
  exports: [ReviewService],
  imports: [forwardRef(() => UsersModule)],
})
export class ReviewsModule {}
