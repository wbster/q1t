"use strict";
const EventEmitter_1 = require("./EventEmitter");
module.exports = function state(target) {
    const event = new EventEmitter_1.default();
    return {
        on(name, func) {
            return event.on(name, func);
        },
        once(name, func) {
            return event.once(name, func);
        },
        set(name, value) {
            target[name] = value;
            event.emit(name, value);
        },
        onOf(names, func) {
            const descripts = names.map(name => this.on(name, () => func(target)));
            return () => descripts.forEach(descriptor => descriptor());
        },
        target: target,
        clear() {
            event.events = {};
        }
    };
};
//# sourceMappingURL=index.js.map