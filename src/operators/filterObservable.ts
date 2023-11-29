import { Observable } from '../core/Observable'


export function filterObservable<T>(filterFn: (target: T) => boolean) {
	return (obs: Observable<T>) => {
		return new Observable<T>(s => {
			const subscription = obs.subscribe(value => {
				if (filterFn(value)) s(value)
			})
			return () => subscription.unsubscribe()
		})
	}
}
