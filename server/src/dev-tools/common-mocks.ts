import { Exclude, Expose } from 'class-transformer';
import { prop as PersistInDb, ReturnModelType } from '@typegoose/typegoose';

import { ArgumentsHost, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseModel, BaseService } from '@kb-abstracts';

export const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  sendFile: jest.fn().mockReturnThis(),
  mockClear: () => {
    mockResponse.status.mockClear();
    mockResponse.json.mockClear();
    mockResponse.sendFile.mockClear();
  }
};

export const hostMock = (req, res, roles?: string[]): ArgumentsHost => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx: any = {};
  ctx.switchToHttp = jest.fn().mockReturnValue({
      getRequest: () => req,
      getResponse: () => res
  });
  ctx.getHandler = jest.fn().mockReturnValue({ roles });

  return ctx;
};

@Exclude()
export class MockModel extends BaseModel {
  @PersistInDb()
  mockPrivateAttribute: string;

  @Expose()
  @PersistInDb({ required: true })
  mockAttribute: string;

  @Exclude()
  @PersistInDb()
  updatedDate?: Date;

  constructor(partial: Partial<MockModel> = {}) {
    super();
    Object.assign(this, partial);
  }
}

@Injectable()
export class MockService extends BaseService<MockModel> {
  constructor(
    @InjectModel(MockModel.modelName)
    private readonly injectedModel: ReturnModelType<typeof MockModel>
  ) {
    super(injectedModel, MockModel);
  }
}
