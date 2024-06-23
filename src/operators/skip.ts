import type { IObservable, Operator } from "../core/IObservable"
import { Observable } from "../core/Observable"

export function skip<T>(count: number): Operator<T> {
	return (obs: IObservable<T>) => new Observable<T>(sub => {
		let currentSkipped = 0
		const subscription = obs.subscribe(value => {
			if (currentSkipped === count) {
				sub(value)
			} else {
				currentSkipped++
			}
		})

		return () => [
			subscription.unsubscribe()
		]
	})
}
