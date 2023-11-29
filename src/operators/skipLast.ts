import { Observable } from '../core/Observable'

export function skipLast<T>(count: number) {
	return (obs: Observable<T>) => {
		return new Observable<T>(sub => {

			const history = Array(count) as T[]

			let callCount = 0

			const subscription = obs.subscribe(value => {
				callCount += 1
				history.push(value)
				const first = history.shift()
				if (callCount > count) {
					sub(first)
				}
			})

			return () => [
				subscription.unsubscribe()
			]
		})
	}
}
