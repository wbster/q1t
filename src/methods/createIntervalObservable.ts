import { Observable } from '../core/Observable'

export function createIntervalObservable(time: number) {
	return new Observable<void>(s => {
		const id = setInterval(() => s(), time)

		return () => clearInterval(id)
	})
}
