import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { BookGenre } from '../schemas/book-genre.model';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  publisher: string;

  @IsNumber()
  publicationYear: number;

  @IsArray()
  reviews: string[];

  @IsEnum(BookGenre, { each: true })
  genre: [BookGenre];

  @IsString()
  description: string;

  @IsString()
  coverImgUrl: string;

  @IsNumber()
  copiesTotal: number;

  @IsNumber()
  copiesAvailable: number;

  @IsNumber()
  price: number;

  @IsNumber()
  pages: number;

  @IsNumber()
  isbn: number;
}
