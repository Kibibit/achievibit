import { classToPlain, Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';

export class BaseDBModel {
  // @Expose({ name: 'id' })
  // @Transform((value) => value && value.toString())
  @Exclude()
  @IsOptional()
  _id: ObjectId;

  @Exclude()
  @IsOptional()
  __v: string | number;

  toJSON() {
    return classToPlain(this);
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}
