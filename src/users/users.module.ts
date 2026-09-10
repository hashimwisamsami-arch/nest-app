import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { ReviewsModule } from '../reviews/reviews.module.js';
import { User } from './users.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [forwardRef(() => ReviewsModule), TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
