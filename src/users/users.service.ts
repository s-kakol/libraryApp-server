import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EditUserDto } from './dtos/edit-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel
      .find({})
      .populate('reviews', { reviewedBookTitle: 1, content: 1, rating: 1 })
      .exec();
  }

  async findOneById(id: string): Promise<UserDocument> {
    let result: UserDocument;
    try {
      result = await this.userModel
        .findById(id)
        .populate('reviews', { reviewedBookTitle: 1, content: 1, rating: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException('Malformed or wrong id');
    }
    if (!result) {
      throw new NotFoundException('Could not find user with given id.');
    }
    return result;
  }

  async findOneByEmail(email: string): Promise<User> {
    let result: User;
    try {
      result = await this.userModel
        .findOne({ email })
        .populate('reviews', { reviewedBookTitle: 1, content: 1, rating: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException('Malformed or wrong email');
    }
    if (!result) {
      throw new NotFoundException('Could not find user with given email.');
    }
    return result;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    newUser.createdAt = new Date();
    return await newUser.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find user with given id.');
    }
  }

  async edit(id: string, editUserData: EditUserDto) {
    if (editUserData.password) {
      editUserData.password = await bcrypt.hash(editUserData.password, 10);
    }
    return await this.userModel.findByIdAndUpdate(id, editUserData, {
      new: true,
    });
  }
}
