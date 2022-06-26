import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateReviewDto } from './dtos/create-review.dto';
import { EditReviewDto } from './dtos/edit-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async findAll(): Promise<Review[]> {
    return await this.reviewModel.find().exec();
  }

  async findAllByBookId(bookId: string): Promise<Review[]> {
    if (!mongoose.isValidObjectId(bookId))
      throw new BadRequestException('Malformed or wrong id');
    return await this.reviewModel.find({ author: bookId });
  }

  async findAllByAuthorId(authorId: string): Promise<Review[]> {
    if (!mongoose.isValidObjectId(authorId))
      throw new BadRequestException('Malformed or wrong id');
    return await this.reviewModel.find({ author: authorId });
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
    createdReview.createdAt = new Date();
    return await createdReview.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find review with given id.');
    }
  }

  async edit(id: string, editReviewData: EditReviewDto) {
    return await this.reviewModel.findByIdAndUpdate(id, editReviewData, {
      new: true,
    });
  }
}
