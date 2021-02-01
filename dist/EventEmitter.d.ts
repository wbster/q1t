declare type Events = Record<string, Array<Function>>;
export default class EventEmitter {
    events: Events;
    constructor();
    on(name: string, func: Function): () => () => any;
    off(name: string, func: Function): () => () => any;
    once(name: string, func: Function): () => () => any;
    emit(name: string, ...args: any[]): void;
}
export {};
