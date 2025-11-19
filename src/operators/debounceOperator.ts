import type { IObservable, Operator } from "@/core/IObservable"
import { Observable } from "@/core/Observable"

export function debounceOperator<T>(time: number): Operator<T, T> {
	return (obs: IObservable<T>) => {
		return new Observable<T>((sub) => {
			let timeout: ReturnType<typeof setTimeout> | null = null
			const subscription = obs.subscribe((value) => {
				if (timeout) {
					clearTimeout(timeout)
				}

				timeout = setTimeout(() => {
					sub(value)
				}, time)
			})

			return () => {
				if (timeout) {
					clearTimeout(timeout)
				}

				subscription.unsubscribe()
			}
		})
	}
}
