export abstract class IEventManager {
    emitter: any;

    abstract on(eventName: string, listener: any): any

    abstract emit(eventName: string, event: any): any
}