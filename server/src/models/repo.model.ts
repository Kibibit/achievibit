import { ApiProperty } from '@nestjs/swagger';
import { index, modelOptions, prop as PersistInDb } from '@typegoose/typegoose';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { BaseModel } from '@kb-abstracts';

@Exclude()
@modelOptions({
  schemaOptions: {
    collation: { locale: 'en_US', strength: 2 },
    timestamps: true
  }
})
@index({ fullname: 1 }, { unique: true })
export class Repo extends BaseModel {

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @PersistInDb({ required: true })
  readonly name: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @PersistInDb({ required: true, unique: true })
  readonly fullname: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @PersistInDb({ required: true })
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
