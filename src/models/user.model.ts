import { Achievement, AchievementSchema } from '@kb-models/achievement.model';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Schema } from 'mongoose';

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
}

/* tslint:disable */
export class UserDto extends CreateUserDto {
  constructor(partial: Partial<UserDto>) {
    super();
    Object.assign(this, partial);
  }

  @Exclude()
  readonly _id: string;
  @Exclude()
  readonly __v: string;

  achievements: Achievement[];
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
