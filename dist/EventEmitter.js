"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(name, func) {
        if (!this.events[name])
            this.events[name] = [];
        this.events[name].push(func);
        return () => this.off(name, func);
    }
    off(name, func) {
        if (!this.events[name])
            this.events[name] = [];
        this.events[name] = this.events[name].filter(method => method !== func);
        return () => this.on(name, func);
    }
    once(name, func) {
        const descriptor = this.on(name, (...args) => {
            func(...args);
            descriptor();
        });
        return descriptor;
    }
    emit(name, ...args) {
        if (!this.events[name])
            this.events[name] = [];
        this.events[name].forEach(func => func(...args));
    }
}
exports.default = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map