import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto.js';
import { AccessTokenType, JWTPayloadType } from '../utils/types.js';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './users.entity.js';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto.js';
@Injectable()
export class AuthProvider {
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
   * Hashing password
   * @param password plain text password
   * @returns hashed password
   */
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Generate JWT
   * @param payload JWT payload
   * @returns token
   */
  private generateJWT(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
