import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity.js';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto.js';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenType, JWTPayloadType } from '../utils/types.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UserType } from '../utils/enum.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *Create New user
   * @param registerDto data for create new user
   * @returns JWT (access token)
   */
  public async register(registerDto: RegisterDto): Promise<AccessTokenType> {
    const { email, password, username } = registerDto;

    const userFromDb = await this.usersRepository.findOne({ where: { email } });
    if (userFromDb) {
      throw new BadRequestException('user already exist');
    }

    const hashedPassword = await this.hashPassword(password);

    let newUser = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
    });
    newUser = await this.usersRepository.save(newUser);

    const accessToken = await this.generateJWT({
      id: newUser.id,
      userType: newUser.userType,
    });
    return { accessToken };
  }

  /**
   *Login user
   * @param loginDto data for login user
   * @returns JWT (access token)
   */
  public async login(loginDto: LoginDto): Promise<AccessTokenType> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('invalid email or password');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('invalid email or password');
    }

    const accessToken = await await this.generateJWT({
      id: user.id,
      userType: user.userType,
    });
    return { accessToken };
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
      user.password = await this.hashPassword(password);
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

  /**
   * Generate JWT
   * @param payload JWT payload
   * @returns token
   */
  private generateJWT(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /**
   * Hashing password
   * @param password plain text password
   * @returns hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
