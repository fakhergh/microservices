import { Controller, Post, Body, Logger } from '@nestjs/common';

import { SessionsService } from './sessions.service';
import { LoginDto, RegisterDto } from './dto/create-session.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  login(@Body() data: LoginDto) {}

  @MessagePattern('register')
  register(@Body() data: RegisterDto) {
    Logger.log('REGISTER:AUTHENTICATION_SERVICE', data);
    return this.sessionsService.register(data);
  }
}
