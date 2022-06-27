import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Reservation } from 'src/reservations/schemas/reservation.schema';
import { Review } from 'src/reviews/schemas/review.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    required: true,
    type: Array(mongoose.Schema.Types.ObjectId),
    ref: 'Review',
  })
  reviews: Review[];

  @Prop({
    required: true,
    type: Array(mongoose.Schema.Types.ObjectId),
    ref: 'Reservation',
  })
  reservations: Reservation[];

  @Prop({ required: true })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User).set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
