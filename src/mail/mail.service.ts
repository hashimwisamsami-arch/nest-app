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
        html: `
            <div>
            <h2>
            ${email}
            </h2>
            <p>
            You Logged in toyour account in ${today.toDateString()} at ${today.toLocaleTimeString()}
            </p>
            </div>
            `,
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }
}
