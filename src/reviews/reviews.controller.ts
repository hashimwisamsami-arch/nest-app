import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './reviews.service.js';
import { CreateReviewDto } from './dtos/create-review.dto.js';
import { CurrentUser } from '../users/decorators/current-user.decorator.js';
import type { JWTPayloadType } from '../utils/types.js';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard.js';
import { Roles } from '../users/decorators/user-role.decorator.js';
import { UserType } from '../utils/enum.js';

@Controller('api/reviews')
export class ReviewsControllers {
  constructor(private readonly reviewsService: ReviewService) {}

  //POST: ~/api/reviews/:productId
  @Post(':productId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public craeteNewReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: CreateReviewDto,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.reviewsService.createReview(productId, payload.id, body);
  }
}
