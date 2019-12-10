import { Test, TestingModule } from '@nestjs/testing';
import { classToPlain } from 'class-transformer';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ AppService ]
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should return package info', async () => {
    const packageDetails = classToPlain(await service.getPackageDetails());

    expect(packageDetails).toMatchSnapshot();
  });

  it('should re-use the same promise on different calls', async () => {
    const packageDetailsPromiseCall1 = service.getPackageDetails();
    const packageDetailsPromiseCall2 = service.getPackageDetails();

    expect(packageDetailsPromiseCall1).toEqual(packageDetailsPromiseCall2);
  });
});
