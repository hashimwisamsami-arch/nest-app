import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { UsersModule } from './users/users.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product } from './products/product.entity.js';
import { Review } from './reviews/review.entity.js';
import { User } from './users/users.entity.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadsModule } from './uploads/uploads.module.js';
import { MailModule } from './mail/mail.module.js';
import { LoggerMiddleware } from './utils/middlewares/logger.middleware.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ProductsModule,
    ReviewsModule,
    UploadsModule,
    MailModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          database: config.get<string>('DB_NAME'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          port: config.get<number>('DB_PORT'),
          host: config.get<string>('DB_HOST'),
          synchronize: process.env.NODE_ENV !== 'production', //only in Development
          entities: [Product, Review, User],
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'users',
      method: RequestMethod.GET,
    });
  }
}
