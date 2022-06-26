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
import { CreateReviewDto } from './dtos/create-review.dto';
import { EditReviewDto } from './dtos/edit-review.dto';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getReviews(): Promise<Review[]> {
    return await this.reviewsService.findAll();
  }

  @Get('/:id')
  async getReview(@Param('id') id: string): Promise<Review> {
    return await this.reviewsService.findOneById(id);
  }

  @Get('/book/:id')
  async getReviewsByBook(@Param('id') id: string): Promise<Review[]> {
    return await this.reviewsService.findAllByBookId(id);
  }

  @Get('/author/:id')
  async getReviewsByAuthor(@Param('id') id: string): Promise<Review[]> {
    return await this.reviewsService.findAllByAuthorId(id);
  }

  @Post()
  async addReview(@Body() body: CreateReviewDto): Promise<Review> {
    return await this.reviewsService.create(body);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteReview(@Param('id') id: string): Promise<void> {
    await this.reviewsService.remove(id);
  }

  @Patch('/:id')
  async patchReview(
    @Param('id') id: string,
    @Body() body: EditReviewDto,
  ): Promise<Review> {
    return await this.reviewsService.edit(id, body);
  }
}
