import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNewsDto } from './dtos/create-news.dto';
import { EditNewsDto } from './dtos/edit-news.dto';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>,
  ) {}

  async findAll(): Promise<News[]> {
    return await this.newsModel.find({}).exec();
  }

  async findOneById(id: string): Promise<NewsDocument> {
    let result: NewsDocument;
    try {
      result = await this.newsModel.findById(id).exec();
    } catch (error) {
      throw new BadRequestException('Malformed or wrong id');
    }
    if (!result) {
      throw new NotFoundException('Could not find news with given id.');
    }
    return result;
  }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const createdNews = new this.newsModel(createNewsDto);
    createdNews.createdAt = new Date();
    return await createdNews.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.newsModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find news with given id.');
    }
  }

  async edit(id: string, editNewsData: EditNewsDto) {
    return await this.newsModel.findByIdAndUpdate(id, editNewsData, {
      new: true,
    });
  }
}
