import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  author: string;

  @IsString()
  content: string;

  @IsString()
  reviewedBook: string;

  @Min(1)
  @Max(5)
  @IsNumber()
  ranking: number;
}
