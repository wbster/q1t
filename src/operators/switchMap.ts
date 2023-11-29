import { IObservable } from "../core/IObservable"
import { Observable } from "../core/Observable"
import { Subscription } from "../core/Subscription"

export function switchMap<T, E>(fn: (value: T) => IObservable<E>) {
	return (obs: Observable<T>) => {
		return new Observable<E>(sub => {
			let prevSub: Subscription | null = null
			const subscription = obs.subscribe(value => {

				if (prevSub) {
					prevSub.unsubscribe()
				}

				prevSub = fn(value).subscribe(value => {
					sub(value)
				})
			})

			return () => {
				prevSub?.unsubscribe()
				subscription.unsubscribe()
			}
		})
	}
}
