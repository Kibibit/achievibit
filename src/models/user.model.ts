import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Document, Schema } from 'mongoose';

import { Achievement, AchievementSchema, BaseDBModel } from '@kb-models';

export const USER_MODEL_NAME = 'User';

/** serves as an example for now on how to define this.
 * This won't actually create users in our public API since we only create
 * a user "reference" object from\to our github oAuth users.
 */
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly url: string;

  @ApiProperty()
  @IsString()
  readonly avatar: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly organization: boolean;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  readonly users?: string[];

  @ApiProperty()
  @IsArray()
  readonly repos: string[];

  @Exclude()
  readonly token: string;
}

/* tslint:disable */
export class UserDto extends BaseDBModel {
  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly url: string;

  @ApiProperty()
  @IsString()
  readonly avatar: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly organization: boolean;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  readonly users?: string[];

  @ApiProperty()
  @IsArray()
  readonly repos: string[];

  @Exclude()
  readonly token: string;

  achievements: Achievement[];

  constructor(partial: Partial<UserDto>) {
    super();
    Object.assign(this, partial);
  }
}
/* tslint:enable */

export const UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  url: { type: String, required: true },
  avatar: { type: String, required: true },
  organization: Boolean,
  users: {
    type: [ String ],
    required() { return this.organization === true ? true : false; }
  },
  repos: { type: [ String ], required: true },
  achievements: { type: [ AchievementSchema ] }
}, {
  collation: { locale: 'en_US', strength: 2 }
});

export interface IUser extends Document {
  readonly username: string;
  readonly url: string;
  readonly avatar: string;
  readonly organization: boolean;
  readonly users?: string[];
  readonly repos: string[];
}
