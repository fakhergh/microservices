import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @MessagePattern('create_customer')
  async create(@Payload() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @MessagePattern('customers')
  async getCustomers() {
    return this.customersService.getCustomers();
  }
}
