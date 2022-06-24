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
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }

  @Post()
  async addUser(@Body() body: CreateUserDto): Promise<User> {
    return await this.userService.create(body);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }

  @Patch('/:id')
  async patchUser(
    @Param('id') id: string,
    @Body() body: EditUserDto,
  ): Promise<User> {
    return await this.userService.edit(id, body);
  }
}
