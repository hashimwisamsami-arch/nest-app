import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity.js';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   *Create New user
   * @param registerDto data for create new user
   * @returns JWT (access token)
   */
  public async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto;

    const userFromDb = await this.usersRepository.findOne({ where: { email } });
    if (userFromDb) {
      throw new BadRequestException('user already exist');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
    });
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }

  /**
   *Login user
   * @param loginDto data for login user
   * @returns JWT (access token)
   */
  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('invalid email or password');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('invalid email or password');
    }
    return user;
  }
}
