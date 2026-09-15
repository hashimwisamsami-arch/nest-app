import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto.js';
import { AccessTokenType, JWTPayloadType } from '../utils/types.js';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './users.entity.js';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto.js';
import { MailService } from '../mail/mail.service.js';
import { randomBytes } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dtos/reset-password.dto.js';
@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
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

    const hashedPassword = await this.hashPassword(password);

    let newUser = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      verificationToken: randomBytes(32).toString('hex'),
    });
    newUser = await this.usersRepository.save(newUser);
    const link = this.generateLink(newUser.id, newUser.verificationToken);
    await this.mailService.sendVerifyEmailTemplate(email, link);
    return { message: 'Verification token has been send' };
  }

  /**
   *Login user
   * @param loginDto data for login user
   * @returns success message
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

    if (!user.isAccountVerified) {
      let verificationToken = user.verificationToken;
      if (!verificationToken) {
        user.verificationToken = randomBytes(32).toString('hex');
        const result = await this.usersRepository.save(user);
        verificationToken = result.verificationToken;
      }
      const link = this.generateLink(user.id, verificationToken);
      await this.mailService.sendVerifyEmailTemplate(email, link);
      return { message: 'Verification token has been send' };
    }

    const accessToken = await await this.generateJWT({
      id: user.id,
      userType: user.userType,
    });
    await this.mailService.sendLogInEmail(user.email);
    return { accessToken };
  }

  /**
   *  sending reset password link to the client
   */
  public async sendResetPasswordLink(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('user with this email not found');
    }
    user.resetPasswordToken = randomBytes(32).toString('hex');
    const result = await this.usersRepository.save(user);

    const resetPasswordLink = `${this.config.get<string>('CLINT_DOMAIN')}/reset-password/${user.id}/${result.resetPasswordToken}`;
    await this.mailService.sendResetPasswordTemplate(email, resetPasswordLink);
    return {
      message: 'Password Reset link sent to your email,please check your inbox',
    };
  }

  /**
   * Get reset password link
   */
  public async getResetPasswordLink(
    userId: number,
    resetPasswordToken: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('user with this email not found');
    }
    if (
      user.resetPasswordToken === null ||
      user.resetPasswordToken !== resetPasswordToken
    ) {
      throw new BadRequestException('invalid link');
    }
    return { message: 'valid link' };
  }

  /**
   * reset the password
   */

  public async resetThePassword(dto: ResetPasswordDto) {
    const { userId, resetPasswordToken, newPassword } = dto;
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('user with this email not found');
    }
    if (
      user.resetPasswordToken === null ||
      user.resetPasswordToken !== resetPasswordToken
    ) {
      throw new BadRequestException('invalid link');
    }
    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await this.usersRepository.save(user);
    return { message: 'password resent successfully,please log in' };
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

  private generateLink(userId: number, verificationToken: string | null) {
    return `${this.config.get<string>('DOMAIN')}/api/users/verify-email/${userId}/${verificationToken}`;
  }
}
