import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { RegisterDto } from './dtos/register.dto.js';
import { LoginDto } from './dtos/login.dto.js';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST: ~/api/users/auth/register
  @Post('auth/register')
  public register(@Body() body: RegisterDto) {
    return this.usersService.register(body);
  }

  // POST: ~/api/users/auth/register
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() body: LoginDto) {
    return this.usersService.login(body);
  }
}
