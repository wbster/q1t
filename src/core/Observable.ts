import type { IObservable, Operator } from "./IObservable"
import { Subscription } from "./Subscription"

export class Observable<T> implements IObservable<T> {
	constructor(
		private subscriber: (subscriber: (event: T) => void) => () => void,
	) {}

	subscribe(cb: (event: T) => void) {
		const destroyHandler = this.subscriber((event: T) => {
			cb(event)
		})

		return new Subscription(() => destroyHandler())
	}

	pipe<R>(operator: Operator<T, R>): Observable<R> {
		return operator(this)
	}
}
