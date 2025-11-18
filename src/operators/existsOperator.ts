import type { IObservable } from "../core/IObservable"
import { Observable } from "../core/Observable"

export function existsOperator<T>() {
	return (obs: IObservable<T>) => {
		return new Observable<NonNullable<T>>(sub => {
			const subscription = obs.subscribe(val => {
				if (val !== undefined && val !== null) {
					sub(val)
				}
			})

			return () => {
				subscription.unsubscribe()
			}
		})
	}
}