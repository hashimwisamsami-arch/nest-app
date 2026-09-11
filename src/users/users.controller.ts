import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { RegisterDto } from './dtos/register.dto.js';
import { LoginDto } from './dtos/login.dto.js';
import { AuthGuard } from './guards/auth.guard.js';

import { CurrentUser } from './decorators/current-user.decorator.js';
import type { JWTPayloadType } from '../utils/types.js';
import { Roles } from './decorators/user-role.decorator.js';
import { UserType } from '../utils/enum.js';
import { AuthRolesGuard } from './guards/auth-roles.guard.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';

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

  // GET: ~/api/users/current-user
  @Get('current-user')
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    return this.usersService.getCurrentUser(payload.id);
  }

  // GET: ~/api/users
  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public getAllUsers() {
    return this.usersService.getAll();
  }

  //PUT:~/api/users/:id
  @Put(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public updateUsers(
    @CurrentUser() payload: JWTPayloadType,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(payload.id, body);
  }

  //DELETE:~/api/users/:id
  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public deleteUsers(
    @CurrentUser() payload: JWTPayloadType,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.delete(id, payload);
  }
}
