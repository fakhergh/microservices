import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
  MongooseHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private client: MicroserviceHealthIndicator,
    private mongo: MongooseHealthIndicator,
    private postgres: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongo.pingCheck('mongo-db'),
      () => this.postgres.pingCheck('postgres-db'),
      () =>
        this.client.pingCheck('auth-service', {
          transport: Transport.TCP,
          options: {
            host: 'authentication',
            port: process.env.AUTHENTICATION_SERVICE_PORT,
          },
        }),
      () =>
        this.client.pingCheck('user-service', {
          transport: Transport.TCP,
          options: {
            host: 'user',
            port: process.env.USER_SERVICE_PORT,
          },
        }),
    ]);
  }
}
