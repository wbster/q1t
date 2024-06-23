import type { IObservable, Operator } from '../core/IObservable'
import { Observable } from '../core/Observable'

export function skipLast<T>(count: number): Operator<T> {
	return (obs: IObservable<T>) => {
		return new Observable<T>(sub => {

			const history = Array(count) as T[]

			let callCount = 0

			const subscription = obs.subscribe(value => {
				callCount += 1
				history.push(value)
				const first = history.shift()
				if (callCount > count && first) {
					sub(first)
				}
			})

			return () => [
				subscription.unsubscribe()
			]
		})
	}
}
