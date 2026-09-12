import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity.js';
import { LoginDto } from './dtos/login.dto.js';
import { AccessTokenType, JWTPayloadType } from '../utils/types.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UserType } from '../utils/enum.js';
import { AuthProvider } from './auth.provider.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly authProvider: AuthProvider,
  ) {}

  /**
   *Create New user
   * @param registerDto data for create new user
   * @returns JWT (access token)
   */
  public async register(registerDto: RegisterDto): Promise<AccessTokenType> {
    return this.authProvider.register(registerDto);
  }

  /**
   *Login user
   * @param loginDto data for login user
   * @returns JWT (access token)
   */
  public async login(loginDto: LoginDto): Promise<AccessTokenType> {
    return this.authProvider.login(loginDto);
  }

  /**
   * Get Current user
   * @param id id of logged  user
   * @returns the user from DB
   */
  public async getCurrentUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    return user;
  }

  /**
   * Get All Users From DB
   * @returns collection of users
   */
  public getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Update user
   * @param id id of looged in user
   * @param updateUserDto data for update user
   * @returns updated user from the DB
   */
  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { password, username } = updateUserDto;
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('invalid email or password');
    }

    user.username = username ?? user.username;
    if (password) {
      user.password = await this.authProvider.hashPassword(password);
    }

    return await this.usersRepository.save(user);
  }

  /**
   * Delete user from DB
   * @param userId id of the user
   * @param payload JWTPayload
   * @returns a success message
   */
  public async delete(userId: number, payload: JWTPayloadType) {
    const user = await this.getCurrentUser(userId);
    if (user.id === payload.id || payload.userType === UserType.ADMIN) {
      await this.usersRepository.remove(user);
      return { message: 'user deleted successfully' };
    }
    throw new ForbiddenException('access denied, you are not allowed');
  }
}
