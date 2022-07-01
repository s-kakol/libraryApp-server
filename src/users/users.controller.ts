import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
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
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }

  @Get('/em/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return await this.userService.findOneByEmail(email);
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
