import axios from 'axios';

// import { SetMetadata } from '@nestjs/common';

export const TaskHealthCheck = function (healthCheckId?: string) {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args) {
      await originalMethod.apply(this, args);
      if (healthCheckId) {
        await pingHealthCheck(healthCheckId);
      }
    };

    return descriptor;
  };
};

async function pingHealthCheck(healthCheckId: string) {
  await axios.get(`https://hc-ping.com/${ healthCheckId }`);
}
