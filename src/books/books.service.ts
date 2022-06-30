import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dtos/create-book.dto';
import { EditBookDto } from './dtos/edit-book.dto';
import { BookGenre } from './schemas/book-genre.model';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  async findAll(): Promise<Book[]> {
    return await this.bookModel
      .find({})
      .populate('reviews', { authorName: 1, content: 1, rating: 1 })
      .exec();
  }

  async findAllByGenre(genre: string): Promise<Book[]> {
    if (!Object.values(BookGenre).includes(genre as BookGenre)) {
      throw new BadRequestException('Invalid book genre');
    }
    const books = await this.findAll();
    return books.filter((book) => book.genre.includes(genre as BookGenre));
  }

  async findOneById(id: string): Promise<BookDocument> {
    let result: BookDocument;
    try {
      result = await this.bookModel
        .findById(id)
        .populate('reviews', { authorName: 1, content: 1, rating: 1 })
        .exec();
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
    return await createdBook.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find book with given id.');
    }
  }

  async edit(id: string, editBookData: EditBookDto) {
    const result = await this.bookModel.findByIdAndUpdate(id, editBookData, {
      new: true,
    });
    await this.updateRating(id);
    return result;
  }

  async updateRating(id: string) {
    const book = await this.findOneById(id);
    if (book.reviews.length === 0) {
      book.rating = 0;
      await book.save();
    } else {
      const total = book.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      book.rating = total / book.reviews.length;
      await book.save();
    }
  }
}
