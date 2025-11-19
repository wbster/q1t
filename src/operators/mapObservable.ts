import type { IObservable, Operator } from "@/core/IObservable"
import { Observable } from "@/core/Observable"

export function mapObservable<T, E>(fn: (target: T) => E): Operator<T, E> {
	return (obs: IObservable<T>) => {
		return new Observable<E>((s) => {
			const subscription = obs.subscribe((value) => s(fn(value)))

			return () => subscription.unsubscribe()
		})
	}
}
