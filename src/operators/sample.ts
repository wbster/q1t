import type { IObservable, Operator } from "../core/IObservable"
import { Observable } from "../core/Observable"

export function sample<T, E>(obsTrigger: Observable<T>): Operator<E> {
	return (prevObservable: IObservable<E>) => {
		return new Observable<E>((subscriber) => {
			let lastE: E | undefined = undefined
			let initValue = false
			const sub1 = prevObservable.subscribe((value) => {
				lastE = value
				initValue = true
			})

			const sub2 = obsTrigger.subscribe(() => {
				if (initValue) {
					subscriber(lastE as E)
				}
			})

			return () => {
				sub1.unsubscribe()
				sub2.unsubscribe()
			}
		})
	}
}
