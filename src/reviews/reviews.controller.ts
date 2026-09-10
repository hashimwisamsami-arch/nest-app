import { Controller, Get } from '@nestjs/common';
import { ReviewService } from './reviews.service.js';

@Controller()
export class ReviewsControllers {
  constructor(private readonly reviewsService: ReviewService) {}
  // GET: ~/api/reviews
  @Get('/api/reviews')
  public getAllReviews() {
    return this.reviewsService.getAll();
  }
}
