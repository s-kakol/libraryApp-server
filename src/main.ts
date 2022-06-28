import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  Logger.log(`Server started on port ${PORT}`, `Server`);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
