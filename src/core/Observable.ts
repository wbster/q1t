import { IObservable } from './IObservable'
import { Subscription } from './Subscription'

export class Observable<E> implements IObservable<E> {

	constructor(private subscriber: (subscriber: (event: E) => void) => (() => void)) {
	}

	subscribe(cb: ((event: E) => void)) {
		const destr = this.subscriber((event: E) => {
			cb(event)
		})
		return new Subscription(() => destr())
	}

	pipe<R>(operator: (obs: Observable<E>) => Observable<R>) {
		return operator(this)
	}
}
