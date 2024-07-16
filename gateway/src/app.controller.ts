import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { RegisterDto } from './dto/auth-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/auth/login')
  login(): Promise<{ token: string }> {
    return this.appService.login();
  }

  @Post('/auth/register')
  register(@Body() data: RegisterDto): Promise<{ token: string }> {
    return this.appService.register(data);
  }

  @Get('/users')
  getUsers(): Promise<[]> {
    return this.appService.getUsers();
  }

  @Get('/customers')
  getCustomers(): Promise<[]> {
    return this.appService.getCustomers();
  }
}
