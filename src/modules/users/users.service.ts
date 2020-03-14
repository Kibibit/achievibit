import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { classToPlain } from 'class-transformer';
import { Document, PaginateModel } from 'mongoose';

import { CreateUserDto, User, USER_MODEL_NAME } from '@kb-models';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(`UsersService`);

  constructor(@InjectModel(USER_MODEL_NAME) private readonly userModel: ReturnModelType<typeof User>) { }

  async create(createUser: CreateUserDto): Promise<User> {
    debugger;
    const createdUser = await this.userModel.create(createUser);

    return new User(createdUser.toJSON());
  }

  async findAll(): Promise<PaginateModel<User & Document>> {
    const paginatedResult = await (this.userModel as any).paginate({}, { sort: { username: 'desc' } });

    paginatedResult.docs = paginatedResult.docs.map((user) => classToPlain(new User(user.toJSON())));

    return paginatedResult;
    // console.log((this.userModel as any).paginate);
    // return await (this.userModel as any).paginate({}, { sort: { username: 'desc' } })
    //   .then((result) => result || [])
    //   .then((result) => result.docs = result.docs.map((user) => new User(user.toJSON())))
    //   .then(() => );
  }

  async findOne(username: string): Promise<User> {
    const dbUser = await this.userModel.findOne({ username }).exec();

    if (!dbUser) {
      throw new HttpException('requested user not found', HttpStatus.NOT_FOUND);
    }

    return new User(dbUser.toJSON());
  }
}
