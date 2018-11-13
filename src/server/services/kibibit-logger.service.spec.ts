import { Test, TestingModule } from '@nestjs/testing';
import { KibibitLoggerService } from './kibibit-logger.service';

describe('LoggerService', () => {
  let service: KibibitLoggerService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KibibitLoggerService]
    }).compile();

    service = module.get<KibibitLoggerService>(KibibitLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have an info module', () => {
    expect(service.info).toBeDefined();
  });

  it('should call the super log function on call to info', () => {
        // mock log to check if it ran
        Object.getPrototypeOf(KibibitLoggerService.prototype).log = jest.fn();
        const logFn = Object.getPrototypeOf(KibibitLoggerService.prototype).log;
        const testLogger = new KibibitLoggerService(null, true);

        testLogger.info('hello!');

        expect(logFn).toHaveBeenCalledTimes(1);
  });
});
