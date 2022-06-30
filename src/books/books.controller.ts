import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dtos/create-book.dto';
import { EditBookDto } from './dtos/edit-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  async getBooks(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Book[]> {
    return await this.bookService.findAll(page, limit);
  }

  @Get('/genre/:genre')
  async getBooksByGenre(
    @Param('genre') genre: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Book[]> {
    return await this.bookService.findAllByGenre(genre, page, limit);
  }

  @Get('/:id')
  async getBook(@Param('id') id: string): Promise<Book> {
    return await this.bookService.findOneById(id);
  }

  @Post()
  async addBook(@Body() body: CreateBookDto): Promise<Book> {
    return await this.bookService.create(body);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteBook(@Param('id') id: string): Promise<void> {
    await this.bookService.remove(id);
  }

  @Patch('/:id')
  async patchBook(
    @Param('id') id: string,
    @Body() body: EditBookDto,
  ): Promise<Book> {
    return await this.bookService.edit(id, body);
  }
}
