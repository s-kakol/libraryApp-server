import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema()
export class Review {
  @Prop()
  authorName: string;

  @Prop()
  reviewedBookTitle: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  authorId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  reviewedBookId: mongoose.Schema.Types.ObjectId;

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
