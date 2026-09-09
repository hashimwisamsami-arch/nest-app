import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { ReviewsModule } from '../reviews/reviews.module.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [forwardRef(() => ReviewsModule)],
})
export class UsersModule {}
