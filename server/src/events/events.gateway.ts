import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {
  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer()
  server: Server;

  constructor() {
    this.logger.log('testing, testing...');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: unknown): WsResponse<unknown> {
    this.logger.log('got here!');

    return {
      event: 'message-response',
      data
    };
  }

  @SubscribeMessage('events')
  onEvent(/* @MessageBody() data: unknown */): Observable<WsResponse<number>> {
    const event = 'events';
    const response = [1, 2, 3];

    return from(response).pipe(
      map(data => ({ event, data }))
    );
  }

  handleDisconnect() {
    this.logger.log('Client disconnected:');
    // console.log(client);
  }

  handleConnection() {
    this.logger.log('Client connected:');
    // console.log(client);
  }
}
