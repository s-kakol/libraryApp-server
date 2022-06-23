import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './book.schema';
import { CreateBookDto } from './dtos/create-book.dto';
import { EditBookDto } from './dtos/edit-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findOneById(id: string): Promise<Book> {
    let result: BookDocument;
    try {
      result = await this.bookModel.findById(id).exec();
    } catch (error) {
      throw new BadRequestException('Malformed or wrong id');
    }
    if (!result) {
      throw new NotFoundException('Could not find book with given id.');
    }
    return result;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    createdBook.createdAt = new Date();
    return createdBook.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find book with given id.');
    }
  }

  async edit(id: string, editBookData: EditBookDto) {
    return await this.bookModel.findByIdAndUpdate(id, editBookData, {
      new: true,
    });
  }
}
