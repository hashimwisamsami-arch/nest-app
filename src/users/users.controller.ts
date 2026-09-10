import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { RegisterDto } from './dtos/register.dto.js';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST: ~/api/users/auth/register
  @Post('auth/register')
  public register(@Body() body: RegisterDto) {
    return this.usersService.register(body);
  }
}
