import { Controller, Get } from '@nestjs/common';

@Controller()
export class ReviewsControllers {
  // GET: ~/api/reviews
  @Get('/api/reviews')
  public getAllReviews() {
    return [
      { id: 1, rating: 4, comment: 'good' },
      { id: 2, rating: 1, comment: 'bad' },
      { id: 3, rating: 5, comment: 'very good' },
    ];
  }
}
