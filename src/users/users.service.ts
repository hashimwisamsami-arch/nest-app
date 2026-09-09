import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ReviewService } from '../reviews/reviews.service.js';

@Injectable()
export class UsersService {
  // constructor(
  //   @Inject(forwardRef(() => ReviewService))
  //   private readonly reviwesService: ReviewService,
  // ) {}
  public getAll() {
    return [
      { id: 1, email: 'ali@gamil.com' },
      { id: 2, email: 'kenny@gamil.com' },
      { id: 3, email: 'cartman@gamil.com' },
    ];
  }
}
