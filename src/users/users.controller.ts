import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { ReviewService } from '../reviews/reviews.service.js';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewService,
  ) {}
  // GET: ~/api/users
  @Get('/api/users')
  public getAllUsers() {
    return this.usersService.getAll();
  }
}
