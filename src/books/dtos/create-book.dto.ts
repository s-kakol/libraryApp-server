import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  publisher: string;

  @IsNumber()
  releaseYear: number;

  @IsArray()
  reviews: string[];

  @IsArray()
  genre: string[];

  @IsString()
  description: string;

  @IsString()
  coverImgUrl: string;

  @IsNumber()
  copiesTotal: number;

  @IsNumber()
  copiesAvailable: number;
}
