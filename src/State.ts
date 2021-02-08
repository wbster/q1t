import EventEmitter from "./EventEmitter"
export type Param = Record<string, any>

export default class State<T extends Param> {
	private eventEmitter: EventEmitter
	public target: T
	constructor(target: T) {
		this.eventEmitter = new EventEmitter()
		this.target = target
	}

	update(target: Partial<T>) {
		for (let name in target) {
			this.set(name, target[name])
		}
	}

	on<U extends keyof T & string>(name: U, func: (arg: T[U], target?: T) => void) {
		return this.eventEmitter.on(name, func)
	}

	once<U extends keyof T & string>(name: U, func: (arg: T[U], target?: T) => void) {
		return this.eventEmitter.once(name, func)
	}

	set<U extends keyof T & string>(name: U, value: T[U]): void {
		this.target[name] = value
		this.eventEmitter.emit(name, value, this.target)
	}

	oneOf<U extends keyof T & string>(names: Array<U>, func: (target: T) => void) {
		const descripts = names.map(name => this.on(name, () => func(this.target)))
		return () => descripts.forEach(descriptor => descriptor())
	}

	private onOf<U extends keyof T & string>(names: Array<U>, func: (target: T) => void) {
		console.warn('"onOf" will be removed in future releases. Use "oneOf"')
		return this.oneOf(names, func)
	}

	clear<U extends keyof T & string>(name?: U) {
		if (name === undefined) {
			return this.clearAll()
		} else {
			return this.remove(name)
		}
	}

	clearAll() {
		this.eventEmitter.eventList = {}
	}

	remove<U extends keyof T & string>(name: U) {
		delete this.eventEmitter.eventList[name]
	}

}