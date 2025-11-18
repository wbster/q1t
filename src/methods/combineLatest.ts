import type { IObservable } from "../core/IObservable"
import { Observable } from "../core/Observable"

type ObsValue<T> = T extends IObservable<infer U>
	? U
	: {
		[K in keyof T]: T[K] extends IObservable<infer U> ? U : never
	}

export function combineLatest<
	T extends IObservable<any>[] | [IObservable<any>, ...IObservable<any>[]],
>(observables: T): Observable<ObsValue<T>> {
	const values = Array(observables.length) as ObsValue<T>
	const initList = new Set<IObservable<any>>()

	return new Observable((sub) => {
		const subscriptions = observables.map((obs, index) => {
			return obs.subscribe((value) => {
				values[index] = value
				initList.add(obs)
				if (initList.size === observables.length) {
					sub(values)
				}
			})
		})

		return () => {
			subscriptions.forEach((subscription) => subscription.unsubscribe())
		}
	})
}
