import { Controller, Get } from '@nestjs/common';
import { ReviewService } from './reviews.service.js';
import { UsersService } from '../users/users.service.js';

@Controller()
export class ReviewsControllers {
  constructor(
    private readonly reviewsService: ReviewService,
    private readonly usersService: UsersService,
  ) {}
  // GET: ~/api/reviews
  @Get('/api/reviews')
  public getAllReviews() {
    return this.reviewsService.getAll();
  }
}
