import { singleton } from 'tsyringe';
import { IEventEmitter } from '../../Application/events/IEventEmitter';
import { EventEmitter as Emitter } from 'events';

@singleton()
export class EventManager implements IEventEmitter {
    emitter: any;
    constructor() {
        this.emitter = new Emitter();
    }

    on(eventName: string, listener: any) {
        this.emitter.on(eventName, listener);
    }

    emit(eventName: string, event: any) {
        this.emitter.emit(eventName, event);
    }
}
