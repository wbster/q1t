import type { IObservable, Operator } from "@/core/IObservable";
import { Observable } from "@/core/Observable";

export function withPrevValue<T>(): Operator<
	T,
	{ prev: T | null; current: T }
> {
	return (obs: IObservable<T>) => {
		return new Observable<{ prev: T | null; current: T }>((sub) => {
			let prev: T | null = null
			const subscription = obs.subscribe((value) => {
				sub({ prev, current: value })
				prev = value
			})

			return () => subscription.unsubscribe()
		})
	}
}
