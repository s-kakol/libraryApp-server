import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = parseInt(process.env.PORT, 10) || 3001;

  Logger.log(`Server started on port ${PORT}`, `Server`);
  await app.listen(PORT);
}
bootstrap();
