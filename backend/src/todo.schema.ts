import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
enum Status {
  Done = 'done',
  Pending = 'pending',
}
@Schema()
export class Todo extends Document {
  @Prop({ require: true })
  title: string;
  @Prop({ require: true })
  description: string;
  @Prop({
    required: true,
    enum: Status,
    default: 'pending',
  })
  status: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
