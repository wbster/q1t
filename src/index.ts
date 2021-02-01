import EventEmitter from "./EventEmitter"
type Param = Record<string, any>

export = function state<T extends Param>(target: T) {
    const event = new EventEmitter()
    return {
        on<U extends keyof T & string>(name: U, func: (arg: T[U]) => void) {
            return event.on(name, func)
        },
        once<U extends keyof T & string>(name: U, func: (arg: T[U]) => void) {
            return event.once(name, func)
        },
        set<U extends keyof T & string>(name: U, value: T[U]): void {
            target[name] = value
            event.emit(name, value)
        },
        target: target,
        clear(): void {
            event.events = {}
        }
    }
}