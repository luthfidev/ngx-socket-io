import * as i0 from '@angular/core';
import { InjectionToken, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import * as io from 'socket.io-client';

class WrappedSocket {
    config;
    subscribersCounter = {};
    eventObservables$ = {};
    ioSocket;
    emptyConfig = {
        url: '',
        options: {},
    };
    constructor(config) {
        this.config = config;
        if (config === undefined) {
            config = this.emptyConfig;
        }
        const url = config.url;
        const options = config.options;
        const ioFunc = io.default ? io.default : io;
        this.ioSocket = ioFunc(url, options);
    }
    of(namespace) {
        this.ioSocket.of(namespace);
    }
    on(eventName, callback) {
        this.ioSocket.on(eventName, callback);
    }
    once(eventName, callback) {
        this.ioSocket.once(eventName, callback);
    }
    connect(callback) {
        return this.ioSocket.connect(callback);
    }
    disconnect(_close) {
        return this.ioSocket.disconnect.apply(this.ioSocket, arguments);
    }
    emit(_eventName, ..._args) {
        return this.ioSocket.emit.apply(this.ioSocket, arguments);
    }
    removeListener(_eventName, _callback) {
        return this.ioSocket.removeListener.apply(this.ioSocket, arguments);
    }
    removeAllListeners(_eventName) {
        return this.ioSocket.removeAllListeners.apply(this.ioSocket, arguments);
    }
    fromEvent(eventName) {
        if (!this.subscribersCounter[eventName]) {
            this.subscribersCounter[eventName] = 0;
        }
        this.subscribersCounter[eventName]++;
        if (!this.eventObservables$[eventName]) {
            this.eventObservables$[eventName] = new Observable((observer) => {
                const listener = (data) => {
                    observer.next(data);
                };
                this.ioSocket.on(eventName, listener);
                return () => {
                    this.subscribersCounter[eventName]--;
                    if (this.subscribersCounter[eventName] === 0) {
                        this.ioSocket.removeListener(eventName, listener);
                        delete this.eventObservables$[eventName];
                    }
                };
            }).pipe(share());
        }
        return this.eventObservables$[eventName];
    }
    fromOneTimeEvent(eventName) {
        return new Promise(resolve => this.once(eventName, resolve));
    }
    listeners(eventName) {
        return this.ioSocket.listeners(eventName);
    }
    listenersAny() {
        return this.ioSocket.listenersAny();
    }
    listenersAnyOutgoing() {
        return this.ioSocket.listenersAnyOutgoing();
    }
    off(eventName, listener) {
        if (!eventName) {
            // Remove all listeners for all events
            return this.ioSocket.offAny();
        }
        if (eventName && !listener) {
            // Remove all listeners for that event
            return this.ioSocket.off(eventName);
        }
        // Removes the specified listener from the listener array for the event named
        return this.ioSocket.off(eventName, listener);
    }
    onAny(callback) {
        return this.ioSocket.onAny(callback);
    }
    onAnyOutgoing(callback) {
        return this.ioSocket.onAnyOutgoing(callback);
    }
    prependAny(callback) {
        return this.ioSocket.prependAny(callback);
    }
    prependAnyOutgoing(callback) {
        return this.ioSocket.prependAnyOutgoing(callback);
    }
    timeout(value) {
        return this.ioSocket.timeout(value);
    }
    volatile() {
        return this.ioSocket.volatile;
    }
}

/** Socket factory */
function SocketFactory(config) {
    return new WrappedSocket(config);
}
const SOCKET_CONFIG_TOKEN = new InjectionToken('__SOCKET_IO_CONFIG__');
class SocketIoModule {
    static forRoot(config) {
        return {
            ngModule: SocketIoModule,
            providers: [
                { provide: SOCKET_CONFIG_TOKEN, useValue: config },
                {
                    provide: WrappedSocket,
                    useFactory: SocketFactory,
                    deps: [SOCKET_CONFIG_TOKEN],
                },
            ],
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: SocketIoModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.8", ngImport: i0, type: SocketIoModule });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: SocketIoModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: SocketIoModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { WrappedSocket as Socket, SocketIoModule };
//# sourceMappingURL=ngx-socket-io.mjs.map
