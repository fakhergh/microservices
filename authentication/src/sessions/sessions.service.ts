import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { LoginDto, RegisterDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SessionsService {
  private redis: ClientProxy;

  constructor(private dataSource: DataSource) {
    this.redis = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    });
  }

  async login(loginDto: LoginDto) {}

  async register(registerDto: RegisterDto) {
    Logger.log('REGISTER:USER_SERVICE', registerDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const session = new Session();
    session.token = Date.now().toString();
    session.expiresAt = new Date();
    session.createdAt = new Date();

    await queryRunner.manager.save(session);

    try {
      Logger.log('Message Sent');
      const response = await firstValueFrom(
        this.redis.send('create_customer', registerDto),
      );
      Logger.log(response);
    } catch (error) {
      Logger.error(error);
    }

    return session.token;
  }
}
