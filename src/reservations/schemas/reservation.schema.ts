import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Book } from 'src/books/schemas/book.schema';
import { ReservationStatus } from './reservation-status.model';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ required: true })
  borrower: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: Array(mongoose.Schema.Types.ObjectId),
    ref: 'Book',
  })
  books: Book[];

  @Prop()
  comment: string;

  @Prop({ required: true })
  status: ReservationStatus;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ required: true })
  createdAt: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation).set(
  'toJSON',
  {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  },
);
