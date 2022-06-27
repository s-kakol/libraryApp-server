import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BooksService } from 'src/books/books.service';
import { UserService } from 'src/users/users.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { EditReviewDto } from './dtos/edit-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    private readonly bookService: BooksService,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Review[]> {
    return await this.reviewModel.find({}).exec();
  }

  async findAllByBookId(reviewedBookId: string): Promise<Review[]> {
    if (!mongoose.isValidObjectId(reviewedBookId))
      throw new BadRequestException('Malformed or wrong id');
    return await this.reviewModel.find({ reviewedBookId }).exec();
  }

  async findAllByAuthorId(authorId: string): Promise<Review[]> {
    if (!mongoose.isValidObjectId(authorId))
      throw new BadRequestException('Malformed or wrong id');
    return await this.reviewModel.find({ authorId }).exec();
  }

  async findOneById(id: string): Promise<Review> {
    let result: Review;
    try {
      result = await this.reviewModel.findById(id).exec();
    } catch (error) {
      throw new BadRequestException('Malformed or wrong id');
    }
    if (!result) {
      throw new NotFoundException('Could not find review with given id.');
    }
    return result;
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);

    const refUser = await this.userService.findOneById(
      createReviewDto.authorId.toString(),
    );
    const refBook = await this.bookService.findOneById(
      createReviewDto.reviewedBookId.toString(),
    );

    try {
      createdReview.createdAt = new Date();
      createdReview.authorName = refUser.username;
      createdReview.reviewedBookTitle = refBook.title;
      const newReview = await createdReview.save();

      refUser.reviews = refUser.reviews.concat(newReview._id);
      await refUser.save();
      refBook.reviews = refBook.reviews.concat(newReview._id);
      await refBook.save();

      await this.bookService.updateRating(refBook._id.toString());

      return newReview;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const review = await this.reviewModel.findById(id).exec();

    const refUser = await this.userService.findOneById(
      review.authorId.toString(),
    );
    const refBook = await this.bookService.findOneById(
      review.reviewedBookId.toString(),
    );

    const result = await this.reviewModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find review with given id.');
    }

    refUser.reviews = refUser.reviews.filter(
      (review) => review.toString() !== id,
    );
    await refUser.save();
    refBook.reviews = refBook.reviews.filter(
      (review) => review.toString() !== id,
    );
    await refBook.save();

    await this.bookService.updateRating(refBook._id.toString());
  }

  async edit(id: string, editReviewData: EditReviewDto) {
    const result = await this.reviewModel.findByIdAndUpdate(
      id,
      editReviewData,
      {
        new: true,
      },
    );
    await this.bookService.updateRating(id);
    return result;
  }
}
