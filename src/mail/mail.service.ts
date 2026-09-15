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
}
