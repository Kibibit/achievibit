import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import {
  index,
  modelOptions,prop as PersistInDb,
  Severity
} from '@typegoose/typegoose';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseModel } from '@kb-abstracts';

@Exclude()
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW
  },
  schemaOptions: {
    collation: { locale: 'en_US', strength: 2 },
    timestamps: true
  }
})
@index({ username: 1 }, { unique: true })
export class User extends BaseModel {
  
  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  @PersistInDb({ required: true, unique: true })
  readonly username: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @PersistInDb({ required: true })
  readonly url: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @PersistInDb({ required: true })
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
  @PersistInDb({ type: () => [String] })
  readonly users?: string[];

  @Expose()
  @ApiPropertyOptional()
  @IsArray()
  @PersistInDb({ type: () => [String] })
  readonly repos: string[];

  @Expose()
  @ApiPropertyOptional()
  @IsArray()
  @PersistInDb({ type: () => [String] })
  readonly organizations: string[];

  @Expose()
  @IsArray()
  @IsOptional()
  @PersistInDb()
  achievements: any[];

  @Exclude()
  @PersistInDb()
  readonly token: string;

  constructor(partial: Partial<User> = {}) {
    super();
    Object.assign(this, partial);
  }
}
