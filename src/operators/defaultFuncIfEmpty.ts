import type { IObservable, Operator } from '../core/IObservable'
import { Observable } from '../core/Observable'

export function defaultFuncIfEmpty<T>(defaultFunc: () => T): Operator<T> {
	return (observable: IObservable<T>) => new Observable<T>(subscriber => {
		let hasValue = false

		const subscription = observable.subscribe(value => {
			hasValue = true
			subscriber(value)
		})

		if (!hasValue) {
			subscriber(defaultFunc())
		}

		return () => {
			subscription.unsubscribe()
		}

	})
}
