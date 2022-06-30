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
import { CreateNewsDto } from './dtos/create-news.dto';
import { EditNewsDto } from './dtos/edit-news.dto';
import { NewsService } from './news.service';
import { News } from './schemas/news.schema';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(): Promise<News[]> {
    return await this.newsService.findAll();
  }

  @Get('/:id')
  async getNewsItem(@Param('id') id: string): Promise<News> {
    return await this.newsService.findOneById(id);
  }

  @Post()
  async addNews(@Body() body: CreateNewsDto): Promise<News> {
    return await this.newsService.create(body);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteNews(@Param('id') id: string): Promise<void> {
    await this.newsService.remove(id);
  }

  @Patch('/:id')
  async patchNews(
    @Param('id') id: string,
    @Body() body: EditNewsDto,
  ): Promise<News> {
    return await this.newsService.edit(id, body);
  }
}
