import type { IObservable, Operator } from "../core/IObservable"
import { Observable } from "../core/Observable"
import type { Subscription } from "../core/Subscription"

export function switchMap<T, E>(
	fn: (value: T) => IObservable<E>,
): Operator<T, E> {
	return (obs: IObservable<T>) => {
		return new Observable<E>((sub) => {
			let prevSub: Subscription | null = null
			const subscription = obs.subscribe((value) => {
				if (prevSub) {
					prevSub.unsubscribe()
				}

				prevSub = fn(value).subscribe((value) => {
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
