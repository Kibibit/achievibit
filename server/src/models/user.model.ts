import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { prop as PersistInDb } from '@typegoose/typegoose';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

import { BaseModel } from '@kb-abstracts';

@Exclude()
export class User extends BaseModel {
  
  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  @PersistInDb()
  readonly username: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @PersistInDb()
  readonly url: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @PersistInDb()
  readonly avatar: string;

  @Expose()
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @PersistInDb()
  readonly organization: boolean;

  @Expose()
  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  @PersistInDb()
  readonly users?: string[];

  @Expose()
  @ApiPropertyOptional()
  @IsArray()
  @PersistInDb()
  readonly repos: string[];

  @Expose()
  @IsArray()
  @IsOptional()
  @PersistInDb()
  achievements: any[];

  @PersistInDb()
  readonly token: string;

  constructor(partial: Partial<User> = {}) {
    super();
    Object.assign(this, partial);
  }
}
