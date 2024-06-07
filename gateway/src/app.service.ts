import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { RegisterDto } from './dto/auth-dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('AUTHENTICATION_SERVICE')
    private readonly authenticationServiceClient: ClientProxy,
  ) {}

  async login(): Promise<{ token: string }> {
    return await firstValueFrom(
      this.authenticationServiceClient.send('login', {}),
    );
  }

  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    Logger.log('REGISTER:GATEWAY', registerDto);
    return await firstValueFrom(
      this.authenticationServiceClient.send('register', registerDto),
    );
  }

  async getUsers(): Promise<[]> {
    const response = await firstValueFrom(
      this.userServiceClient.send('users', {}),
    );

    console.log(response);
    return response;
  }
}
