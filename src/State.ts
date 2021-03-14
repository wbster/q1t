import EventEmitter from "./EventEmitter"
export type Param = Record<string, any>

const takeSymbol = Symbol()
type GiveObject = {
	[takeSymbol]: (func: () => void) => () => void
}

export default class State<T extends Param> {

	protected eventEmitter: EventEmitter
	public readonly target: T

	constructor(target: T) {
		this.eventEmitter = new EventEmitter()
		this.target = target
	}

	give<U extends keyof T & string>(names: Array<U>): GiveObject {
		return {
			[takeSymbol]: (func: () => void) => {
				return this.oneOf(names, func)
			}
		}
	}

	depends(takes: Array<GiveObject>, func: () => Partial<T>) {
		const unsubscribers = takes
			.map(t => t[takeSymbol])
			.map(fn => fn(() => this.update(func())))
		return () => {
			unsubscribers.forEach(fn => fn())
		}
	}

	awaitChange<U extends keyof T & string>(name: U): Promise<T[U]> {
		return new Promise(res => {
			this.once(name, res)
		})
	}

	protected getNames() {
		return <Array<keyof T & string>>Object.keys(this.target)
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

	get<U extends keyof T & string>(name: U): T[U] {
		return this.target[name]
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