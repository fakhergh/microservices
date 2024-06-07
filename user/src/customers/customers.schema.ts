import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
  @Prop({ unique: true, required: true })
  username: number;

  @Prop({ sparse: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
