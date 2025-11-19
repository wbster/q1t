import type { IObservable, Operator } from "@/core/IObservable"
import { Observable } from "@/core/Observable"

/**
 * @example .pipe(tap(console.log))
 */
export function tap<T>(fn: (value: T) => void): Operator<T> {
	return (obs: IObservable<T>) => {
		return new Observable<T>((sub) => {
			const subscription = obs.subscribe((value) => {
				fn(value)
				sub(value)
			})

			return () => subscription.unsubscribe()
		})
	}
}
