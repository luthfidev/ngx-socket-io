import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import * as io from 'socket.io-client';
export class WrappedSocket {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LWlvLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc29ja2V0LWlvLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkMsT0FBTyxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUl2QyxNQUFNLE9BQU8sYUFBYTtJQVNKO0lBUnBCLGtCQUFrQixHQUEyQixFQUFFLENBQUM7SUFDaEQsaUJBQWlCLEdBQW9DLEVBQUUsQ0FBQztJQUN4RCxRQUFRLENBQU07SUFDZCxXQUFXLEdBQW1CO1FBQzVCLEdBQUcsRUFBRSxFQUFFO1FBQ1AsT0FBTyxFQUFFLEVBQUU7S0FDWixDQUFDO0lBRUYsWUFBb0IsTUFBc0I7UUFBdEIsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFDeEMsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDekIsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDNUIsQ0FBQztRQUNELE1BQU0sR0FBRyxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDL0IsTUFBTSxPQUFPLEdBQVEsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNwQyxNQUFNLE1BQU0sR0FBSSxFQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxFQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDOUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxFQUFFLENBQUMsU0FBaUI7UUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELEVBQUUsQ0FBQyxTQUFpQixFQUFFLFFB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QztJQUVELE9BQU8sQ0FBQyxLQUFhO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ2hDLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHNoYXJlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuaW1wb3J0IHsgU29ja2V0SW9Db25maWcgfSBmcm9tICcuL2NvbmZpZy9zb2NrZXQtaW8uY29uZmlnJztcblxuZXhwb3J0IGNsYXNzIFdyYXBwZWRTb2NrZXQge1xuICBzdWJzY3JpYmVyc0NvdW50ZXI6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcbiAgZXZlbnRPYnNlcnZhYmxlcyQ6IFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8YW55Pj4gPSB7fTtcbiAgaW9Tb2NrZXQ6IGFueTtcbiAgZW1wdHlDb25maWc6IFNvY2tldElvQ29uZmlnID0ge1xuICAgIHVybDogJycsXG4gICAgb3B0aW9uczoge30sXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IFNvY2tldElvQ29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25maWcgPSB0aGlzLmVtcHR5Q29uZmlnO1xuICAgIH1cbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IGNvbmZpZy51cmw7XG4gICAgY29uc3Qgb3B0aW9uczogYW55ID0gY29uZmlnLm9wdGlvbnM7XG4gICAgY29uc3QgaW9GdW5jID0gKGlvIGFzIGFueSkuZGVmYXVsdCA/IChpbyBhcyBhbnkpLmRlZmF1bHQgOiBpbztcbiAgICB0aGlzLmlvU29ja2V0ID0gaW9GdW5jKHVybCwgb3B0aW9ucyk7XG4gIH1cblxuICBvZihuYW1lc3BhY2U6IHN0cmluZykge1xuICAgIHRoaXMuaW9Tb2NrZXQub2YobmFtZXNwYWNlKTtcbiAgfVxuXG4gIG9uKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICB0aGlzLmlvU29ja2V0Lm9uKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgb25jZShldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5pb1NvY2tldC5vbmNlKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgY29ubmVjdChjYWxsYmFjaz86IChlcnI6IGFueSkgPT4gdm9pZCkge1xuICAgIHJldHVybiB0aGlzLmlvU29ja2V0LmNvbm5lY3QoY2FsbGJhY2spO1xuICB9XG5cbiAgZGlzY29ubmVjdChfY2xvc2U/OiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5pb1NvY2tldC5kaXNjb25uZWN0LmFwcGx5KHRoaXMuaW9Tb2NrZXQsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBlbWl0KF9ldmVudE5hbWU6IHN0cmluZywgLi4uX2FyZ3M6IGFueVtdKSB7XG4gICAgcmV0dXJuIHRoaXMuaW9Tb2NrZXQuZW1pdC5hcHBseSh0aGlzLmlvU29ja2V0LCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmVtb3ZlTGlzdGVuZXIoX2V2ZW50TmFtZTogc3RyaW5nLCBfY2FsbGJhY2s/OiBGdW5jdGlvbikge1xuICAgIHJldHVybiB0aGlzLmlvU29ja2V0LnJlbW92ZUxpc3RlbmVyLmFwcGx5KHRoaXMuaW9Tb2NrZXQsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZW1vdmVBbGxMaXN0ZW5lcnMoX2V2ZW50TmFtZT86IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmlvU29ja2V0LnJlbW92ZUFsbExpc3RlbmVycy5hcHBseSh0aGlzLmlvU29ja2V0LCBhcmd1bWVudHMpO1xuICB9XG5cbiAgZnJvbUV2ZW50PFQ+KGV2ZW50TmFtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgaWYgKCF0aGlzLnN1YnNjcmliZXJzQ291bnRlcltldmVudE5hbWVdKSB7XG4gICAgICB0aGlzLnN1YnNjcmliZXJzQ291bnRlcltldmVudE5hbWVdID0gMDtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVyc0NvdW50ZXJbZXZlbnROYW1lXSsrO1xuXG4gICAgaWYgKCF0aGlzLmV2ZW50T2JzZXJ2YWJsZXMkW2V2ZW50TmFtZV0pIHtcbiAgICAgIHRoaXMuZXZlbnRPYnNlcnZhYmxlcyRbZXZlbnROYW1lXSA9IG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcjogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKGRhdGE6IFQpID0+IHtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KGRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmlvU29ja2V0Lm9uKGV2ZW50TmFtZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc3Vic2NyaWJlcnNDb3VudGVyW2V2ZW50TmFtZV0tLTtcbiAgICAgICAgICBpZiAodGhpcy5zdWJzY3JpYmVyc0NvdW50ZXJbZXZlbnROYW1lXSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5pb1NvY2tldC5yZW1vdmVMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50T2JzZXJ2YWJsZXMkW2V2ZW50TmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkucGlwZShzaGFyZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRPYnNlcnZhYmxlcyRbZXZlbnROYW1lXTtcbiAgfVxuXG4gIGZyb21PbmVUaW1lRXZlbnQ8VD4oZXZlbnROYW1lOiBzdHJpbmcpOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8VD4ocmVzb2x2ZSA9PiB0aGlzLm9uY2UoZXZlbnROYW1lLCByZXNvbHZlKSk7XG4gIH1cblxuICBsaXN0ZW5lcnMoZXZlbnROYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5pb1NvY2tldC5saXN0ZW5lcnMoZXZlbnROYW1lKTtcbiAgfVxuXG4gIGxpc3RlbmVyc0FueSgpIHtcbiAgICByZXR1cm4gdGhpcy5pb1NvY2tldC5saXN0ZW5lcnNBbnkoKTtcbiAgfVxuXG4gIGxpc3RlbmVyc0FueU91dGdvaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmlvU29ja2V0Lmxpc3RlbmVyc0FueU91dGdvaW5nKCk7XG4gIH1cblxuICBvZmYoZXZlbnROYW1lPzogc3RyaW5nLCBsaXN0ZW5lcj86IEZ1bmN0aW9uW10pIHtcbiAgICBpZiAoIWV2ZW50TmFtZSkge1xuICAgICAgLy8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yIGFsbCBldmVudHNcbiAgICAgIHJldHVybiB0aGlzLmlvU29ja2V0Lm9mZkFueSgpO1xuICAgIH1cblxuICAgIGlmIChldmVudE5hbWUgJiYgIWxpc3RlbmVyKSB7XG4gICAgICAvLyBSZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgdGhhdCBldmVudFxuICAgICAgcmV0dXJuIHRoaXMuaW9Tb2NrZXQub2ZmKGV2ZW50TmFtZSk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIGxpc3RlbmVyIGZyb20gdGhlIGxpc3RlbmVyIGFycmF5IGZvciB0aGUgZXZlbnQgbmFtZWRcbiAgICByZXR1cm4gdGhpcy5pb1NvY2tldC5vZmYoZXZlbnROYW1lLCBsaXN0ZW5lcik7XG4gIH1cblxuICBvbkFueShjYWxsYmFjazogKGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkKSB7XG4gICAgcmV0dXJuIHRoaXMuaW9Tb2NrZXQub25BbnkoY2FsbGJhY2spO1xuICB9XG5cbiAgb25BbnlPdXRnb2luZyhjYWxsYmFjazogKGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkKSB7XG4gICAgcmV0dXJuIHRoaXMuaW9Tb2NrZXQub25BbnlPdXRnb2luZyhjYWxsYmFjayk7XG4gIH1cblxuICBwcmVwZW5kQW55KGNhbGxiYWNrOiAoZXZlbnQ6IHN0cmluZywgLi4uYXJnczogYW55W10pID0+IHZvaWQpIHtcbiAgICByZXR1cm4gdGhpcy5pb1NvY2tldC5wcmVwZW5kQW55KGNhbGxiYWNrKTtcbiAgfVxuXG4gIHByZXBlbmRBbnlPdXRnb2luZyhcbiAgICBjYWxsYmFjazogKGV2ZW50OiBzdHJpbmcgfCBzeW1ib2wsIC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkXG4gICkge1xuICAgIHJldHVybiB0aGlzLmlvU29ja2V0LnByZXBlbmRBbnlPdXRnb2luZyhjYWxsYmFjayk7XG4gIH1cblxuICB0aW1lb3V0KHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5pb1NvY2tldC50aW1lb3V0KHZhbHVlKTtcbiAgfVxuXG4gIHZvbGF0aWxlKCkge1xuICAgIHJldHVybiB0aGlzLmlvU29ja2V0LnZvbGF0aWxlO1xuICB9XG59XG4iXX0=