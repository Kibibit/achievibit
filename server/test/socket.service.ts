/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { debounceTime, first, share, tap } from 'rxjs/operators';
import { connect, Socket } from 'socket.io-client';

enum NATIVE_EVENTS {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    ERROR = 'error',
    RECONNECT = 'reconnect',
}

export class SocketService {
    private host = 'ws://localhost:10109';
    private events$: Record<string, Observable<any>> = {};
    socket: typeof Socket;

    errors$: Observable<any>;
    isConnected$: Observable<boolean>;

    constructor(defer?: boolean) {
        this.socket = connect(
            this.host,
            {
                autoConnect: !defer,
                forceNew: true
            },
        );

        this.errors$ = this.on('disconnect-reason');
        this.on<string>(NATIVE_EVENTS.DISCONNECT)
            .pipe(
                tap(reason => `disconnected: ${reason}`),
                debounceTime(5000),
            )
            .subscribe(reason => {
                if (reason === 'io server disconnect') {
                }
            });
    }

    on<T = any>(event: string): Observable<T> {
        if (this.events$[event]) {
            return this.events$[event];
        }

        this.events$[event] = new Observable<T>(observer => {
            this.socket.on(event, observer.next.bind(observer));

            return () => {
                this.socket.off(event);
                delete this.events$[event];
            };
        }).pipe(share());

        return this.events$[event];
    }

    once<T = any>(event: string): Observable<T> {
        return this.on(event).pipe(first());
    }
    emit<T = any>(event: string, data?: T, ack?: false): void;
    // This overloading is not working in TS 3.0.1
    // emit<S = any>(event: string, data?: any, ack?: true): Observable<S>;
    emit<T = any, S = any>(event: string, data?: T, ack?: true): Observable<S>;
    emit<T = any,S = any>(
      event: string,
      data?: T,
      ack?: boolean
    ): void | Observable<S> {
        if (ack) {
            return new Observable<S>(observer => {
                this.socket.emit(event, data, observer.next.bind(observer));
            }).pipe(first());
        } else {
            this.socket.emit(event, data);
        }
    }

    open() {
        this.socket.connect();
    }

    close() {
        this.socket.disconnect();
    }
}
