import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IPullRequest, PULL_REQUEST_MODEL_NAME, PullRequestDto } from '@kb-models';

@Injectable()
export class PullRequestsService {
  private logger: Logger = new Logger(`PullRequestsService`);

  constructor(@InjectModel(PULL_REQUEST_MODEL_NAME) private readonly pullRequestModel: Model<IPullRequest>) { }

  async create(createPullRequestDto: PullRequestDto): Promise<PullRequestDto> {
    try {
      this.logger.debug(createPullRequestDto, 'got this pull request to create');
      // await validateOrReject(createPullRequestDto);
      const createdPullRequest = await this.pullRequestModel.create(createPullRequestDto);

      this.logger.debug(createdPullRequest.toJSON(), 'CREATED PULL REQUEST');

      return new PullRequestDto(createdPullRequest.toJSON());
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async findAll(): Promise<PullRequestDto[]> {
    return await this.pullRequestModel.find().exec()
      .then((result) => result.map((pullRequest) => new PullRequestDto(pullRequest.toJSON())));
  }

  async findOne(pullRequestId: string): Promise<PullRequestDto> {
    const dbPR = await this.pullRequestModel.findOne({ pullRequestId }).exec();

    this.logger.debug(dbPR.toJSON(), 'FOUND PULL REQUEST');

    if (!dbPR) {
      throw new HttpException('requested pull request not found', HttpStatus.NOT_FOUND);
    }

    return new PullRequestDto(dbPR.toJSON());
  }
}
