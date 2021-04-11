import { buildSchema, prop as PersistInDb } from '@typegoose/typegoose';
import { classToPlain, Exclude, Expose } from 'class-transformer';
import { Schema } from 'mongoose';

@Exclude()
export abstract class BaseModel {
  @PersistInDb()
  createdDate?: Date; // provided by timestamps
  @Expose()
  @PersistInDb()
  updatedDate?: Date; // provided by timestamps

  // @Expose({ name: 'id' })
  // @Transform(({ value }) => value && value.toString())
  // tslint:disable-next-line: variable-name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id?: any;

  id?: string; // is actually model._id getter

  // tslint:disable-next-line: variable-name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _v?: any;

  // add more to a base model if you want.

  toJSON() {
    return classToPlain(this);
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  static get schema(): Schema {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return buildSchema(this as any, {
      timestamps: true,
      toJSON: {
        getters: true,
        virtuals: true
      }
    });
  }

  static get modelName(): string {
    return this.name;
  }
}
