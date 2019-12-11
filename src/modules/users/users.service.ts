import { CreateUserDto, IUser, USER_MODEL_NAME, UserDto } from '@kb-models/user.model';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(`UsersService`);

  constructor(@InjectModel(USER_MODEL_NAME) private readonly userModel: Model<IUser>) { }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const createdUser = await this.userModel.create(createUserDto);

    return new UserDto(createdUser.toJSON());
  }

  async findAll(): Promise<UserDto[]> {
    return await this.userModel.find().exec()
      .then((result) => result.map((user) => new UserDto(user.toJSON())));
  }

  async findOne(username: string): Promise<UserDto> {
    const dbUser = await this.userModel.findOne({ username }).exec();

    if (!dbUser) {
      throw new HttpException('requested user not found', HttpStatus.NOT_FOUND);
    }

    return new UserDto(dbUser.toJSON());
  }
}
