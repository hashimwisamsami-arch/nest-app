import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewService {
  public getAll() {
    return [
      { id: 1, rating: 4, comment: 'good' },
      { id: 2, rating: 1, comment: 'bad' },
      { id: 3, rating: 5, comment: 'very good' },
    ];
  }
}
