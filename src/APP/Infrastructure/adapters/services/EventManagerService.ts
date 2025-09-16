import EventEmitter from "events";
import { IEventManager } from "../../../Application/interfaces/IEventManager";

export class EventManager implements IEventManager {
    emitter: any;
    constructor() {
        this.emitter = new EventEmitter();
    }
    
    on(eventName: string, listener: any) {
        this.emitter.on(eventName, listener)
    }
    
    emit(eventName: string, event: any) {
        this.emitter.emit(eventName, event)
    }

}