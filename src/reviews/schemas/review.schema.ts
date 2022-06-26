import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema()
export class Review {
  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  reviewedBook: string;

  @Prop({ required: true, min: 1, max: 5 })
  ranking: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review).set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
