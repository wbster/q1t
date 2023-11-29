import { Observable } from '../core/Observable'

export function mapObservable<T, E>(fn: (target: T) => E) {
	return (obs: Observable<T>) => {
		return new Observable<E>(s => {
			const subscription = obs.subscribe(value => s(fn(value)))
			return () => subscription.unsubscribe()
		})
	}
}
