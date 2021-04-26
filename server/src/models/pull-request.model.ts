import { ApiProperty } from '@nestjs/swagger';
import { index, modelOptions, prop as PersistInDb } from '@typegoose/typegoose';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { BaseModel } from '../abstracts/base.model.abstract';

@Exclude()
@modelOptions({
  schemaOptions: {
    collation: { locale: 'en_US', strength: 2 },
    timestamps: true
  }
})
@index({ prid: 1 }, { unique: true })
export class PullRequest extends BaseModel {
  
  @Expose()
  @IsString()
  @ApiProperty()
  @PersistInDb({ required: true, unique: true })
  prid: string;

  @Expose()
  @IsString()
  @PersistInDb({ required: true })
  url: string;

  @Expose()
  @IsNumber()
  @PersistInDb({ required: true })
  number: number;

  @Expose()
  @IsString()
  @PersistInDb()
  title: string;

  @Expose()
  @IsString()
  @PersistInDb()
  description: string;

  @Expose()
  @PersistInDb()
  creator: string;

  @Expose()
  @PersistInDb()
  createdOn: Date;

  @Expose()
  @PersistInDb()
  labels: string[];

  @Expose()
  @PersistInDb()
  history: {
    [ key: string ]: any;
  };

  @Expose()
  @PersistInDb()
  repository: string;

  @Expose()
  @IsOptional()
  @PersistInDb()
  organization?: string;

  @Expose()
  @IsOptional()
  @PersistInDb()
  assignees?: string[];

  constructor(partial: Partial<PullRequest> = {}) {
    super();
    Object.assign(this, partial);
  }
}
