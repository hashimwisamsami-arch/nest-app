import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public getAll() {
    return [
      { id: 1, rating: 4, comment: 'good' },
      { id: 2, rating: 1, comment: 'bad' },
      { id: 3, rating: 5, comment: 'very good' },
    ];
  }
}
