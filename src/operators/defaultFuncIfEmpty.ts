import { Observable } from '../core/Observable'

export function defaultFuncIfEmpty<T>(defaultFunc: () => T) {
	return (observable: Observable<T>) => new Observable<T>(subscriber => {
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
