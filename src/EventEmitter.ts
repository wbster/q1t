type Events = Record<string, Array<Function>>

export class EventEmitter {
	eventList: Events

	constructor() {
		this.eventList = {}
	}

	on(name: string, func: Function) {
		if (!this.eventList[name])
			this.eventList[name] = []
		this.eventList[name].push(func)
		return () => this.off(name, func)
	}

	off(name: string, func: Function) {
		if (!this.eventList[name])
			this.eventList[name] = []
		this.eventList[name] = this.eventList[name].filter(method => method !== func)
		return () => this.on(name, func)
	}

	once(name: string, func: Function) {
		const descriptor = this.on(name, (...args) => {
			func(...args)
			descriptor()
		})
		return descriptor
	}

	emit(name: string, ...args) {
		if (!this.eventList[name])
			this.eventList[name] = []
		this.eventList[name].forEach(func => func(...args))
	}
}