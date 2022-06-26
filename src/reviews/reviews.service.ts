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

    const referencedUser = await this.userService.findOneById(
      createReviewDto.authorId.toString(),
    );
    const referencedBook = await this.bookService.findOneById(
      createReviewDto.reviewedBookId.toString(),
    );

    try {
      createdReview.createdAt = new Date();
      createdReview.authorName = referencedUser.username;
      createdReview.reviewedBookTitle = referencedBook.title;
      const newReview = await createdReview.save();

      referencedUser.reviews = referencedUser.reviews.concat(newReview._id);
      await referencedUser.save();
      referencedBook.reviews = referencedBook.reviews.concat(newReview._id);
      await referencedBook.save();

      return newReview;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    // const review = await this.reviewModel.findById(id).exec();

    // const referencedUser = await this.userService.findOneById(
    //   review.author.toString(),
    // );
    // const referencedBook = await this.bookService.findOneById(
    //   review.reviewedBook.toString(),
    // );

    const result = await this.reviewModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find review with given id.');
    }

    // referencedUser.reviews = referencedUser.reviews.filter(
    //   (review) => review.toString() !== id,
    // );
    // await referencedUser.save();
    // referencedBook.reviews = referencedBook.reviews.filter(
    //   (review) => review.toString() !== id,
    // );
    // await referencedBook.save();
  }

  async edit(id: string, editReviewData: EditReviewDto) {
    return await this.reviewModel.findByIdAndUpdate(id, editReviewData, {
      new: true,
    });
  }
}
