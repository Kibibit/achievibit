import { KbNotFoundExceptionFilter } from '@kb-filters';

describe('NotFoundExceptionFilterFilter', () => {
  it('should be defined', () => {
    expect(new KbNotFoundExceptionFilter('')).toBeDefined();
  });
});
