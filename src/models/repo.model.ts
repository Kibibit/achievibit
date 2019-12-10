import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Document, Schema } from 'mongoose';

export const REPO_MODEL_NAME = 'Repo';

export class CreateRepoDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly fullname: string;

  @ApiProperty()
  @IsString()
  readonly url: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly organization: string;
}

/* tslint:disable */
export class RepoDto extends CreateRepoDto {
  constructor(partial: Partial<RepoDto>) {
    super();
    Object.assign(this, partial);
  }

  @Exclude()
  readonly _id: string;
  @Exclude()
  readonly __v: string;
}
/* tslint:enable */

export const RepoSchema = new Schema({
  name: { type: String, required: true },
  fullname: { type: String, required: true, index: { unique: true } },
  url: { type: String, required: true },
  organization: String
});

export interface IRepo extends Document {
  readonly name: string;
  readonly fullname: string;
  readonly url: string;
  readonly organization?: string;
}
