import { Observable } from "../core"
import type { IObservable, Operator } from "../core/IObservable"

export function take<T>(count: number): Operator<T> {
	return (obs: IObservable<T>) => {
		let i = 0
		return new Observable<T>((subscriber) => {
			const sub = obs.subscribe((value) => {
				if (i < count) {
					subscriber(value)
					i++
				}
			})

			return () => sub.unsubscribe()
		})
	}
}
