import { Subject } from "./Subject"

type InitAction<S, A extends any[]> = (value: S, ...args: A) => S
type InitActions<S> = { [key: string]: InitAction<S, any[]> }

type ArgumentsFromActions<A> = A extends InitAction<any, infer Args> ? Args : never

type Actions<S, A extends InitActions<S>> = {
	[key in keyof A]: (...args: ArgumentsFromActions<A[key]>) => void
}

export class State<T> extends Subject<T> {

	constructor(value: T) {
		super()
		this.setValue(value)
	}

	getValue(): T {
		return this.value as T
	}

	/**
	 * @example subject.update(oldState => ({ ...oldState, key: 'value' }))
	 */
	update(fn: (target: T) => T) {
		this.setValue(fn(this.getValue()))
	}

	/**
	 * @example const { inc } = this.createActions({ inc: v => v + 1 })
	 * inc()
	 * @example const { add } = this.createActions({ add: (v, a) => v + a })
	 * add(5)
	 */
	createActions<D extends InitActions<T>>(actions: D) {
		const result = {} as Actions<T, D>
		for (const name in actions) {
			const method = actions[name]
			result[name] = (...args) => {
				return this.update(state => method(state, ...args))
			}
		}

		return result
	}
}

export function createState<T>(target: T) {
	return new State(target)
}
