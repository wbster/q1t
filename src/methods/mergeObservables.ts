import { Observable } from "../core/Observable"

export function mergeObservables<T>(list: Observable<T>[]): Observable<T> {
	return new Observable<T>(sub => {
		const subscriptions = list.map(obs => obs.subscribe(sub))

		return () => {
			subscriptions.forEach(sub => sub.unsubscribe())
		}
	})
}
