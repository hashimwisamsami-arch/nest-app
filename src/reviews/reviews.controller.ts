import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './reviews.service.js';
import { CreateReviewDto } from './dtos/create-review.dto.js';
import { CurrentUser } from '../users/decorators/current-user.decorator.js';
import type { JWTPayloadType } from '../utils/types.js';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard.js';
import { Roles } from '../users/decorators/user-role.decorator.js';
import { UserType } from '../utils/enum.js';
import { UpdateReviewDto } from './dtos/update-review.dto.js';

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

  //GET:~/api/reviews
  @Get('')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public getAllReviews(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('reviewPerPage', ParseIntPipe) reviewPerPage: number,
  ) {
    return this.reviewsService.getAll(pageNumber, reviewPerPage);
  }

  //GET:~/api/reviews/:id
  @Get(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public getReviewById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.getOneBy(id);
  }

  //PUT:~/api/reviews/:id
  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReviewDto,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.reviewsService.update(id, payload.id, body);
  }

  //DELETE:~/api/reviews/:id
  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.reviewsService.delete(id, payload);
  }
}
