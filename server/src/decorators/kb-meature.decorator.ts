import { WinstonLogger } from '@kibibit/nestjs-winston';

const logger = new WinstonLogger('KbMeasure');

export const KbMeasure = (controlerName?: string) => (
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args) {
    logger.verbose(generateLogMessagge('START'));
    const start = logger.startTimer();
    const result = await Promise.resolve(originalMethod.apply(this, args));
    start.done({
      level: 'verbose',
      message: generateLogMessagge('END')
    });
    return result;

    function generateLogMessagge(msg: string) {
      return [
        `${ controlerName ? controlerName + '.' : '' }${ originalMethod.name }`,
        `(${ args && args.length ? '...' : '' }) ${ msg }`
      ].join('');
    }
  };
  
  return descriptor;
};
