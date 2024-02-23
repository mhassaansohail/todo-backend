export abstract class EventEmitter {
    emitter: any;

    abstract on(eventName: string, listener: any): any

    abstract emit(eventName: string, event: any): any
}