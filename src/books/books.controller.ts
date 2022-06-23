import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookService } from './books.service';

@Controller()
export class BooksController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async addBook(
    @Body('title') title: string,
    @Body('author') author: string,
    @Body('description') description: string,
    @Body('total') total: number,
    @Body('available') available: number,
  ) {
    const generatedBook = await this.bookService.createBook(
      title,
      author,
      description,
      total,
      available,
    );

    return generatedBook;
  }

  @Get()
  async getAllBooks() {
    const books = await this.bookService.readBooks();
    return books;
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    const book = await this.bookService.readBookById(id);
    return book;
  }

  @Patch(':id')
  async patchBook(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('author') author: string,
    @Body('description') description: string,
    @Body('total') total: number,
    @Body('available') available: number,
  ) {
    const updatedBook = await this.bookService.updateBook(
      id,
      title,
      author,
      description,
      total,
      available,
    );

    return updatedBook;
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    await this.bookService.removeBook(id);
    return null;
  }
}
