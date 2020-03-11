import { Test, TestingModule } from '@nestjs/testing';
import { classToPlain } from 'class-transformer';

import { ConfigModule } from '@kb-config';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ ConfigModule ],
      providers: [ AppService ]
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', async (done) => {
    expect(service).toBeDefined();

    done();
  });

  it('should return package info', async (done) => {
    const packageDetails = classToPlain(await service.getPackageDetails());

    expect(packageDetails).toMatchSnapshot();

    done();
  });

  it('should re-use the same promise on different calls', async (done) => {
    const packageDetailsPromiseCall1 = service.getPackageDetails();
    const packageDetailsPromiseCall2 = service.getPackageDetails();

    expect(packageDetailsPromiseCall1).toEqual(packageDetailsPromiseCall2);

    done();
  });
});
