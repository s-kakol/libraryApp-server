import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dtos/create-book.dto';
import { EditBookDto } from './dtos/edit-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  async getBooks(): Promise<Book[]> {
    const books = await this.bookService.findAll();
    return books;
  }

  @Get('/:id')
  async getBook(@Param('id') id: string): Promise<Book> {
    const book = await this.bookService.findOneById(id);
    return book;
  }

  @Post()
  async addBook(@Body() body: CreateBookDto): Promise<Book> {
    const book = await this.bookService.create(body);
    return book;
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteBook(@Param('id') id: string): Promise<void> {
    await this.bookService.remove(id);
    return null;
  }

  @Patch('/:id')
  async patchBook(
    @Param('id') id: string,
    @Body() body: EditBookDto,
  ): Promise<Book> {
    const book = await this.bookService.edit(id, body);
    return book;
  }
}
