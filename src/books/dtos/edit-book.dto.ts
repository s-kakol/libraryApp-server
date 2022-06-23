export class EditBookDto {
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  reviews: string[];
  genre: string[];
  description: string;
  coverImgUrl: string;
  copiesTotal: number;
  copiesAvailable: number;
  price: number;
  pages: number;
  isbn: number;
}
