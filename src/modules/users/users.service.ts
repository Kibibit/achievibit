import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { CreateUser, User, USER_MODEL_NAME } from '@kb-models';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(`UsersService`);

  constructor(@InjectModel(USER_MODEL_NAME) private readonly userModel: ReturnModelType<typeof User>) { }

  async create(createUser: CreateUser): Promise<User> {
    const createdUser = await this.userModel.create(createUser);

    return new User(createdUser.toJSON());
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().sort({ username: 'desc' }).exec()
      .then((result) => result.map((user) => new User(user.toJSON())));
  }

  async findOne(username: string): Promise<User> {
    const dbUser = await this.userModel.findOne({ username }).exec();

    if (!dbUser) {
      throw new HttpException('requested user not found', HttpStatus.NOT_FOUND);
    }

    return new User(dbUser.toJSON());
  }
}
