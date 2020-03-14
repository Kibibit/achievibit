import { buildSchema } from '@typegoose/typegoose';
import { classToPlain, Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { defaultsDeep } from 'lodash';
import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export class BaseDBModel<T> {
  @Exclude()
  defaults: Partial<T> = {};

  @Exclude()
  @IsOptional()
  _id: ObjectId;

  @Exclude()
  @IsOptional()
  __v: string | number;

  static schema(): Schema {
    return buildSchema(this, {
      timestamps: true,
      toJSON: {
        getters: true,
        virtuals: true
      }
    });
  }

  constructor(partial: Partial<T>) {
    defaultsDeep(this, partial, this.defaults);
  }

  toPrettyJSON() {
    return classToPlain(this);
  }

  toString() {
    return JSON.stringify(this.toPrettyJSON());
  }
}
