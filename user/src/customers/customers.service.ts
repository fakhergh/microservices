import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './customers.schema';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private catModel: Model<Customer>) {}

  create(createCustomerDto: CreateCustomerDto) {
    const createdCustomer = new this.catModel(createCustomerDto);
    return createdCustomer.save();
  }
}
