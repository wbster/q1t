import type { IObservable, Operator } from "../core/IObservable"
import { Observable } from "../core/Observable"
import { State } from "../core/State"
import type { Subscription } from "../core/Subscription"
import { combineLatest } from "../methods/combileLatest"

declare let requestAnimationFrame: (cb: () => void) => number
declare let cancelAnimationFrame: (value: number) => void

function lerp(a: number, b: number, percent: number): number {
	return a + (b - a) * percent
}

export function ease(
	duration: number,
	easeFn: (percent: number) => number = (percent) => percent,
): Operator<number> {
	let frameId: ReturnType<typeof requestAnimationFrame> | null = null

	return (obs: IObservable<number>) => {
		return new Observable<number>((subscriber) => {
			let prevB: number | undefined = undefined
			let startTime = 0
			let endTime = 0
			const sub = obs.subscribe((b) => {
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
						const percent = (currentTime - startTime) / duration
						const nextValue = lerp(a, b, easeFn(percent))
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

export function easeArray(
	duration: number,
	easeFn: (percent: number) => number = (percent) => percent,
): Operator<number[]> {
	return (obs: IObservable<number[]>) =>
		new Observable<number[]>((subscriber) => {
			let list = [] as State<number>[]

			let subscribers: Subscription | null = null
			const subscription = obs.subscribe((array) => {
				if (list.length === 0) {
					list = array.map((v, i) => {
						return new State<number>(v)
					})
					const observables = list.map((b) => b.pipe(ease(duration, easeFn)))
					subscribers = combineLatest(observables).subscribe((value) => {
						subscriber(value)
					})
				}
				array.forEach((v, i) => list[i].setValue(v))
			})

			return () => {
				subscribers?.unsubscribe()
				subscription.unsubscribe()
			}
		})
}

export function toNextFrame<T>(): Operator<T> {
	return (obs: IObservable<T>) => {
		return new Observable<T>((subscriber) => {
			let frameId: ReturnType<typeof requestAnimationFrame> | null = null
			const sub = obs.subscribe((value) => {
				if (frameId) cancelAnimationFrame(frameId)
				frameId = requestAnimationFrame(() => {
					subscriber(value)
				})
			})

			return () => {
				if (frameId) cancelAnimationFrame(frameId)
				sub.unsubscribe()
			}
		})
	}
}
