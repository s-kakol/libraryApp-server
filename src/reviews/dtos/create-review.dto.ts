import { IsMongoId, IsNumber, IsString, Max, Min } from 'class-validator';
import mongoose from 'mongoose';

export class CreateReviewDto {
  @IsMongoId()
  authorId: mongoose.Schema.Types.ObjectId;

  @IsString()
  content: string;

  @IsMongoId()
  reviewedBookId: mongoose.Schema.Types.ObjectId;

  @Min(1)
  @Max(5)
  @IsNumber()
  rating: number;
}
