import { singleton } from 'tsyringe';
import { EventEmitter } from '../../Application/events/EventEmitter';
import { EventEmitter as Emitter } from 'events';

@singleton()
export class EventManager implements EventEmitter {
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
