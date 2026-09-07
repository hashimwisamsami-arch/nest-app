import { Controller, Get } from '@nestjs/common';

@Controller()
export class UsersController {
  // GET: ~/api/users
  @Get('/api/users')
  public getAllUsers() {
    return [
      { id: 1, email: 'ali@gamil.com' },
      { id: 2, email: 'kenny@gamil.com' },
      { id: 3, email: 'cartman@gamil.com' },
    ];
  }
}
