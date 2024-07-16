import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './customers.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  getCustomers() {
    return this.customerModel.find();
  }
}
