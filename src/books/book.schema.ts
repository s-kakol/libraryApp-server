import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  publisher: string;

  @Prop({ required: true })
  releaseYear: number;

  @Prop({ required: true, type: [String] })
  reviews: string[];

  @Prop({ required: true, type: [String] })
  genre: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  coverImgUrl: string;

  @Prop({ required: true })
  copiesTotal: number;

  @Prop({ required: true })
  copiesAvailable: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book).set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
