import { type Operator, type IObservable, Observable } from "../core"

export function debounceOperator<T>(time: number): Operator<T, T> {
	return (obs: IObservable<T>) => {
		return new Observable<T>((sub) => {
			let timeout: number | null = null
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
