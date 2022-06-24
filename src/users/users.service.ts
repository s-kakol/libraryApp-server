import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOneById(id: string): Promise<User> {
    let result: UserDocument;
    try {
      result = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new BadRequestException('Malformed or wrong id');
    }
    if (!result) {
      throw new NotFoundException('Could not find book with given id.');
    }
    return result;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    createdUser.createdAt = new Date();
    return await createdUser.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find book with given id.');
    }
  }

  async edit(id: string, editUserData: EditUserDto) {
    return await this.userModel.findByIdAndUpdate(id, editUserData, {
      new: true,
    });
  }
}
