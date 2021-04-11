const nativeConsoleError = global.console.warn;

global.console.warn = (...args) => {
  if (args.join('').includes('Using Unsupported mongoose version')) {
    return;
  }
  return nativeConsoleError(...args);
}
