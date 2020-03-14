import { ApiProperty } from '@nestjs/swagger';
import { arrayProp, index, modelOptions, plugin, prop } from '@typegoose/typegoose';
import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoosePaginate from 'mongoose-paginate';

import { Achievement, BaseDBModel } from '@kb-models';

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
@modelOptions({
  schemaOptions: {
    collation: { locale: 'en_US', strength: 2 },
    timestamps: true
  }
})
@index({ username: 1 }, { unique: true })
@plugin(mongoosePaginate)
export class User extends BaseDBModel<User> {
  readonly defaults = {
    repos: [],
    users: [],
    organization: false,
    achievements: [],
    organizations: []
  };

  @ApiProperty()
  @IsNotEmpty()
  @prop({ required: true, unique: true })
  readonly username!: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose({ name: 'homepage' })
  @prop({ required: true })
  readonly url!: string;

  @ApiProperty()
  @IsString()
  @prop({ required: true })
  readonly avatar!: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @prop()
  readonly organization: boolean;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @arrayProp({ required() { return this.organization === true ? true : false; }, type: String })
  readonly users?: string[];

  @ApiProperty()
  @IsArray()
  @arrayProp({ required: true, type: String })
  readonly repos: string[];

  @Exclude()
  @prop()
  readonly token: string;

  @ApiProperty()
  @IsArray()
  @arrayProp({ required: true, type: String })
  readonly organizations: string[];

  @ApiProperty()
  @IsArray()
  @arrayProp({ type: Achievement })
  achievements: Achievement[];

  // constructor(partial: Partial<User>) {
  //   super();
  //   defaultsDeep(this, partial, {
  //     repos: [],
  //     users: [],
  //     organization: false,
  //     achievements: [],
  //     organizations: []
  //   } as Partial<User>);
  // }
}
