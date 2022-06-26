import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/schemas/user.schema';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async register(userData: CreateUserDto): Promise<User> {
    try {
      const user = userData;
      user.password = await this.hashPassword(userData.password);

      return await this.userService.create(user);
    } catch (error) {
      const errorValue = error.keyValue.username || error.keyValue.email;

      if (errorValue)
        throw new BadRequestException(`${errorValue} is already taken`);
      throw new Error(error.message);
    }
  }

  async passwordsMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async login(userData: LoginUserDto): Promise<{ token: string }> {
    const user = await this.userService.findOneByEmail(userData.email);
    if (await this.passwordsMatch(userData.password, user.password)) {
      const jwt = await this.jwtService.signAsync({ user });
      return { token: jwt };
    }
    throw new BadRequestException('Incorrect password!');
  }
}
