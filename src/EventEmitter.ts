type Events = Record<string, Array<Function>>

export default class EventEmitter {
	events: Events;

	constructor() {
		this.events = {};
	}

	on(name: string, func: Function) {
		if (!this.events[name])
			this.events[name] = [];
		this.events[name].push(func);
		return () => this.off(name, func);
	}

	off(name: string, func: Function) {
		if (!this.events[name])
			this.events[name] = [];
		this.events[name] = this.events[name].filter(method => method !== func);
		return () => this.on(name, func);
	}

	once(name: string, func: Function) {
		const descriptor = this.on(name, (...args) => {
			func(...args)
			descriptor()
		})
		return descriptor
	}

	emit(name: string, ...args) {
		if (!this.events[name])
			this.events[name] = [];
		this.events[name].forEach(func => func(...args))
	}
}

