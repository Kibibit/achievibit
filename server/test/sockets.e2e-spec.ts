import { Test, TestingModule } from '@nestjs/testing';
import { observe } from 'rxjs-marbles/jest';
import { take, tap } from 'rxjs/operators';

import { AppModule } from '@kb-app';

import { SocketService } from './socket.service';
import { Utils } from './utils';

describe('Web Socket Events (e2e)', () => {
  let socket: SocketService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    await Utils.startServer(testingModule);
    // each test need a new socket connection
    socket = await Utils.createSocket();
  });

  afterEach(async () => {
    // each test need to release the connection for next
    await Utils.closeApp();
  });

  test('socket connection', observe(() => {
    return socket.once('connect')
      .pipe(tap(() => expect(true).toBeTruthy()));
  }));

  test('Events topic', observe(() => {
    let counter = 1;

    socket
      .once('connect')
      .pipe(tap(() => socket.emit('events', { test: 'test' })))
      .subscribe();

    return socket.on('events')
      .pipe(
        take(3),
        tap(data => expect(data).toBe(counter++))
      );
  }));

  test('Message topic', observe(() => {
    const messageData = { test: 'test' };
    socket
      .once('connect')
      .pipe(tap(() => socket.emit('message', messageData)))
      .subscribe();

    return socket.once('message-response')
      .pipe(tap(data => expect(data).toEqual(messageData)));
  }));
});
