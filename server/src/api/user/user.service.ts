import { ReturnModelType } from '@typegoose/typegoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseService } from '@kb-abstracts';
import { User } from '@kb-models';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.modelName)
    private readonly userModel: ReturnModelType<typeof User>
  ) {
    super(userModel, User);
  }

  async findAllUsers(): Promise<User[]> {
    const dbUsers = await this.findAll().exec();

    return dbUsers.map((user) => new User(user.toObject()));
  }

  async findByUsername(username: string): Promise<User> {
    const dbUser = await this.findOne({ username }).exec();

    if (!dbUser) {
      return;
    }

    return new User(dbUser.toObject());
  }
}
