import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  /**
   * sending email after user logged in
   * @param email email of user
   */
  public async sendLogInEmail(email: string) {
    try {
      const today = new Date();
      await this.mailService.sendMail({
        to: email,
        from: `<no-reply@my-nestjs-app.com>`,
        subject: 'Log In',
        template: 'login.ejs',
        context: { email, today },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }

  /**
   * send Verify Email Template
   * @param email email of user
   * @param link link to verify
   */
  public async sendVerifyEmailTemplate(email: string, link: string) {
    try {
      await this.mailService.sendMail({
        to: email,
        from: `<no-reply@my-nestjs-app.com>`,
        subject: 'Verify your account',
        template: 'verify-email',
        context: { link },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }

  /**
   *send reset password Template
   * @param email email of user
   * @param resetPasswordLink link to reset password
   */
  public async sendResetPasswordTemplate(
    email: string,
    resetPasswordLink: string,
  ) {
    try {
      await this.mailService.sendMail({
        to: email,
        from: `<no-reply@my-nestjs-app.com>`,
        subject: 'Reset Password',
        template: 'reset-passeord',
        context: { resetPasswordLink },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }
}
