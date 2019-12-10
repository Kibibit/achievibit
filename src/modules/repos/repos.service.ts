import { CreateRepoDto, IRepo, REPO_MODEL_NAME, RepoDto } from '@kb-models/repo.model';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReposService {
  private logger: Logger = new Logger(`ReposService`);

  constructor(@InjectModel(REPO_MODEL_NAME) private readonly userModel: Model<IRepo>) { }

  async create(createUserDto: CreateRepoDto): Promise<RepoDto> {
    const createdUser = await this.userModel.create(createUserDto);

    return new RepoDto(createdUser.toJSON());
  }

  async findAll(): Promise<RepoDto[]> {
    return await this.userModel.find().exec()
      .then((result) => result.map((user) => new RepoDto(user.toJSON())));
  }

  async findOne(fullname: string): Promise<RepoDto> {
    const dbRepo = await this.userModel.findOne({ fullname }).exec();

    return new RepoDto(dbRepo.toJSON());
  }
}
