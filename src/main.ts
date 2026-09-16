import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  const swagger = new DocumentBuilder()
    .setTitle('Nest JS - App Api')
    .setDescription('Your Api description')
    .addServer('http://localhost:5000')
    .setVersion('1.0')
    .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .addBearerAuth()
    .build();
  const documentation = SwaggerModule.createDocument(app, swagger);
  //http://localhost:5000/swagger
  SwaggerModule.setup('swagger', app, documentation);

  await app.listen(process.env.PORT ?? 5000);
}
await bootstrap();
