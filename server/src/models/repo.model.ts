import { ApiProperty } from '@nestjs/swagger';
import { prop as PersistInDb } from '@typegoose/typegoose';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { BaseModel } from '@kb-abstracts';

@Exclude()
export class Repo extends BaseModel {

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @PersistInDb()
  readonly name: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @PersistInDb()
  readonly fullname: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @PersistInDb()
  readonly url: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @IsOptional()
  @PersistInDb()
  readonly organization: string;

  constructor(partial: Partial<Repo> = {}) {
    super();
    Object.assign(this, partial);
  }
}
