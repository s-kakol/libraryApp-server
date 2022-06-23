import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './book.model';

@Injectable()
export class BookService {
  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  async createBook(
    title: string,
    author: string,
    description: string,
    total: number,
    available: number,
  ): Promise<Book> {
    const newBook = new this.bookModel({
      title,
      author,
      description,
      total,
      available,
    });

    const result = await newBook.save();
    return result as Book;
  }

  async readBooks(): Promise<Book[]> {
    const result = await this.bookModel.find({}).exec();
    return result.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      description: b.description,
      total: b.total,
      available: b.available,
    }));
  }

  async readBookById(id: string): Promise<Book> {
    let result;
    try {
      result = await this.bookModel.findById(id).exec();
    } catch (error) {
      throw new BadRequestException('Malformatted or wrong id');
    }
    if (!result) {
      throw new NotFoundException('Could not find book with given id.');
    }
    return result;
  }

  async updateBook(
    id: string,
    title: string,
    author: string,
    description: string,
    total: number,
    available: number,
  ): Promise<Book> {
    const updatedBook = await this.bookModel.findById(id).exec();
    if (title) {
      updatedBook.title = title;
    }
    if (author) {
      updatedBook.author = author;
    }
    if (description) {
      updatedBook.description = description;
    }
    if (total) {
      updatedBook.total = total;
    }
    if (available) {
      updatedBook.available = available;
    }

    const result = await updatedBook.save();
    return result;
  }

  async removeBook(id: string) {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find book with given id.');
    }
  }
}
