import type { IObservable, Operator } from "../core/IObservable"
import { Observable } from "../core/Observable"

export function skipAfter<T, E>(skipper: Observable<E>): Operator<T> {
	return (observable: IObservable<T>) =>
		new Observable<T>((subscriber) => {
			let skipMode = false

			const subSkip = skipper.subscribe(() => {
				skipMode = true
			})

			const subNext = observable.subscribe((value) => {
				if (!skipMode) subscriber(value)
			})

			return () => {
				subSkip.unsubscribe()
				subNext.unsubscribe()
			}
		})
}
