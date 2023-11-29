import { BehaviorSubject } from '../core/BehaviorSubject'
import { Observable } from '../core/Observable'
import { Subscription } from '../core/Subscription'
import { combineLatest } from '../methods'

declare var requestAnimationFrame: (cb: () => void) => number
declare var cancelAnimationFrame: (value: number) => void

export function ease(duration: number) {
	function lerp(a: number, b: number, percent: number): number {
		return a + ((b - a) * percent)
	}

	let frameId: ReturnType<typeof requestAnimationFrame> | null = null
	return (obs: Observable<number>) => {
		return new Observable<number>(subscriber => {
			let prevB: number | undefined = undefined
			let startTime = 0
			let endTime = 0
			const sub = obs.subscribe(b => {
				if (frameId) cancelAnimationFrame(frameId)
				startTime = Date.now()
				endTime = Date.now() + duration
				const a = prevB ?? b
				function createTimer() {
					return requestAnimationFrame(() => {
						const currentTime = Date.now()
						if (currentTime > endTime) {
							prevB = b
							return subscriber(b)
						}
						const percent = (currentTime - startTime) / (duration)
						const nextValue = lerp(a, b, percent)
						prevB = nextValue
						subscriber(nextValue)
						frameId = createTimer()
					})
				}

				frameId = createTimer()
			})
			return () => {
				if (frameId) cancelAnimationFrame(frameId)
				sub.unsubscribe()
			}
		})
	}
}

export function easeArray(duration: number) {
	return (obs: Observable<number[]>) => new Observable<number[]>(subscriber => {

		let list = [] as BehaviorSubject<number>[]

		let subscribers: Subscription | null = null
		const subscription = obs.subscribe(array => {
			if (list.length === 0) {
				list = array.map((v, i) => {
					return new BehaviorSubject<number>(v)
				})
				const observables = list.map(b => b.pipe(ease(duration)))
				subscribers = combineLatest(observables).subscribe(value => {
					subscriber(value)
				})
			}
			array.forEach((v, i) => list[i].next(v))
		})

		return () => {
			subscribers?.unsubscribe()
			subscription.unsubscribe()
		}
	})
}