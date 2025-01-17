import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTHENTICATION_SERVICE_HOST,
        port: parseInt(process.env.AUTHENTICATION_SERVICE_PORT),
      },
    },
  );
  await app.listen();
}

bootstrap();
