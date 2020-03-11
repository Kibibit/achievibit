interface ISmeeOptions {
  source: string;
  target: string;
  logger: any;
}

export default class SmeeClientMock {
  didEventStarted = false;
  didEventStopped = false;
  constructor(public options: ISmeeOptions) { }

  start() {
    const self = this;
    this.didEventStarted = true;

    return {
      events: 'initialized',
      close() {
        self.didEventStopped = true;
      }
    };
  }
}
