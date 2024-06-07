import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Module,
} from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
    };

    if (httpStatus === HttpStatus.SERVICE_UNAVAILABLE) {
      const errorResponse = (exception as HttpException).getResponse();

      return httpAdapter.reply(response, errorResponse, httpStatus);
    }

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: process.env.MONGO_DSN,
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [],
      synchronize: true,
    }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'AUTHENTICATION_SERVICE',
      useValue: ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: 'authentication',
          port: parseInt(process.env.AUTHENTICATION_SERVICE_PORT),
        },
      }),
    },
    {
      provide: 'USER_SERVICE',
      useValue: ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: 'user',
          port: parseInt(process.env.USER_SERVICE_PORT),
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionsFilter,
    },
  ],
})
export class AppModule {}
