import type { Operator } from "./IObservable"
import { Observable } from "./Observable"
import { Subscription } from "./Subscription"

type InitAction<S, A extends any[]> = (value: S, ...args: A) => S
type InitActions<S> = { [key: string]: InitAction<S, any[]> }

type ArgumentsFromActions<A> = A extends InitAction<any, infer Args>
	? Args
	: never

type Actions<S, A extends InitActions<S>> = {
	[key in keyof A]: (...args: ArgumentsFromActions<A[key]>) => void
}

/**
 * @example const state = new State(0)
 * state.value = 1
 * state.update(oldState => oldState + 1)
 * state.subscribe(value => console.log(value))
 */
export class State<T> {
	#subs = new Set<((value: T) => void)>()
	#value: T
	constructor(value: T) {
		this.#value = value
	}

	get value() {
		return this.#value
	}

	set value(value: T) {
		this.#value = value
		this.#subs.forEach((sub) => {
			sub(value)
		})
	}

	/**
	 * @example state.update(oldState => ({ ...oldState, key: 'value' }))
	 */
	update(fn: (target: T) => T) {
		this.value = fn(this.value)
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
				return this.update((state) => method(state, ...args))
			}
		}

		return result
	}

	subscribe(cb: (value: T) => void) {
		this.#subs.add(cb)
		cb(this.#value)
		return new Subscription(() => {
			this.#subs.delete(cb)
		})
	}

	pipe<R>(operator: Operator<T, R>): Observable<R> {
		return new Observable<T>((sub) => {
			const subscription = this.subscribe((value) => {
				sub(value)
			})

			return () => subscription.unsubscribe()
		}).pipe(operator)
	}
}

export function createState<T>(target: T) {
	return new State(target)
}
