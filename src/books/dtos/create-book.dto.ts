export class CreateBookDto {
  title: string;
  author: string;
  publisher: string;
  releaseYear: number;
  reviews: string[];
  genre: string[];
  description: string;
  coverImgUrl: string;
  copiesTotal: number;
  copiesAvailable: number;
}
