import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST || 'localhost',
      port: +process.env.PORT || 3001,
    },
  });

  await app.listen();
}
bootstrap();
