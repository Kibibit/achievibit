import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Document, Schema, Types } from 'mongoose';

import { BaseDBModel, RepoDto, User } from '@kb-models';

export const PULL_REQUEST_MODEL_NAME = 'PullRequest';

@Exclude()
export class PullRequestDto extends BaseDBModel<PullRequestDto> {
  /* tslint:disable */
  @Exclude()
  _id: ObjectId;
  @Exclude()
  readonly __v: string;
  /* tslint:enable */

  @Expose()
  @IsString()
  id: string;

  @IsString()
  @Expose()
  url: string;

  @IsNumber()
  @Expose()
  number: number;

  @IsString()
  @Expose()
  title: string;

  @IsString()
  @Expose()
  description: string;

  @Expose()
  creator: User;

  @Expose()
  createdOn: Date;

  @Expose()
  labels: any[];

  @Expose()
  history: {
    [ key: string ]: any;
  };

  @Expose()
  repository: RepoDto;

  @IsOptional()
  @Expose()
  organization?: User;

  @IsOptional()
  @Expose()
  assignees?: User[];

  // constructor(partial: Partial<PullRequestDto>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}

export const PullRequestSchema = new Schema({
  id: { type: String, required: true, index: { unique: true } },
  url: { type: String, required: true },
  number: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  creator: {
    id: { type: Types.ObjectId, ref: 'User' },
    username: String
  },
  createdOn: { type: Date, required: true },
  labels: { type: [] },
  history: { type: Object }
}, {
  collation: { locale: 'en_US', strength: 2 }
});

export interface IPullRequest extends Document {
  readonly url: string;
  readonly number: number;
  readonly title: string;
  readonly description: string;
  readonly creator: User;
  readonly createdOn: Date;
  readonly labels: any[];
  readonly history: {
    [ key: string ]: any;
  };
  readonly repository: RepoDto;
  readonly organization?: User;
  readonly assignees?: User[];
}
