import { Observable } from '../core/Observable'

export function tap<T>(fn: (value: T) => void) {
	return (obs: Observable<T>) => {
		return new Observable<T>(sub => {
			const subscription = obs.subscribe(value => {
				fn(value)
				sub(value)
			})
			return () => subscription.unsubscribe()
		})
	}
}
