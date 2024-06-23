import type { IObservable, Operator } from "../core/IObservable"
import { Observable } from "../core/Observable"
import { Subject } from "../core/Subject"
import type { Subscription } from "../core/Subscription"

export function share<T>(): Operator<T> {
	const subject = new Subject<T>()
	let connectedCount = 0
	let subjectConnectSubcription: Subscription | null = null

	return (obs: IObservable<T>) => {
		if (connectedCount == 0) {
			subjectConnectSubcription = obs.subscribe((v) => subject.setValue(v))
		}

		return subject.pipe((obs) => {
			return new Observable<T>((sub) => {
				connectedCount++
				const subscription = obs.subscribe((value) => sub(value))

				return () => {
					connectedCount--
					if (connectedCount === 0) {
						subjectConnectSubcription?.unsubscribe()
						subjectConnectSubcription = null
					}

					return subscription.unsubscribe()
				}
			})
		})
	}
}
