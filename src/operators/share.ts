import { Observable } from '../core/Observable'
import { Subject } from '../core/Subject'
import { Subscription } from '../core/Subscription'

export function share<T>() {
	const subject = new Subject<T>()
	let connectedCount = 0
	let subjectConnectSubcription: Subscription | null = null
	return (obs: Observable<T>) => {
		if (connectedCount == 0) {
			subjectConnectSubcription = subject.connect(obs)
		}
		return subject
			.pipe(obs => {
				return new Observable<T>(sub => {
					connectedCount++
					const subscription = obs.subscribe(value => sub(value))
					return () => {
						connectedCount--
						if (connectedCount === 0) {
							subjectConnectSubcription.unsubscribe()
							subjectConnectSubcription = null
						}
						return subscription.unsubscribe()
					}
				})
			})
	}
}
