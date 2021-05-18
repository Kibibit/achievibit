import '../src/config/winston.config';

jest.mock('../src/config/winston.config');

const nativeConsoleError = global.console.warn;

global.console.warn = (...args) => {
  const msg = args.join('');
  if (
    msg.includes('Using Unsupported mongoose version') ||
    msg.includes('Setting "Mixed" for property')
  ) {
    return;
  }
  return nativeConsoleError(...args);
};
