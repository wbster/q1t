import type { IObservable, Operator } from "@/core/IObservable"
import { Observable } from "@/core/Observable"
import { State } from "@/core/State"
import type { Subscription } from "@/core/Subscription"
import { existsOperator } from "./existsOperator"

export function share<T>(): Operator<T> {
	const currentState = new State<T | null>(null)
	let connectedCount = 0
	let currentStateSubscription: Subscription | null = null

	return (originalObs: IObservable<T>) => {
		return currentState.pipe(existsOperator()).pipe((obs) => {
			return new Observable<T>((sub) => {
				if (connectedCount === 0) {
					currentStateSubscription = originalObs.subscribe((v) =>
						currentState.value = v,
					)
				}
				connectedCount++
				const subscription = obs.subscribe((value) => sub(value))

				return () => {
					connectedCount--
					if (connectedCount === 0) {
						currentStateSubscription?.unsubscribe()
						currentStateSubscription = null
					}

					return subscription.unsubscribe()
				}
			})
		})
	}
}
