import type { IObservable, Operator } from "@/core/IObservable"
import { Observable } from "@/core/Observable"

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
	let frameId: ReturnType<typeof requestAnimationFrame> | null = null
	return (obs: IObservable<number[]>) =>
		new Observable<number[]>((subscriber) => {
			let prevB: number[] = []
			let startTime = 0
			let endTime = 0
			const sub = obs.subscribe((b) => {
				if (frameId) cancelAnimationFrame(frameId)
				startTime = Date.now()
				endTime = Date.now() + duration
				const a = prevB.length ? prevB : b
				function createTimer() {
					return requestAnimationFrame(() => {
						const currentTime = Date.now()
						if (currentTime > endTime) {
							prevB = b

							return subscriber(b)
						}
						const percent = (currentTime - startTime) / duration
						const percentValue = easeFn(percent)
						const nextValue = b.map((b, i) => lerp(a[i], b, percentValue))
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

export function fromZero(duration: number): Operator<number> {
	let frameId: ReturnType<typeof requestAnimationFrame>
	return (obs: IObservable<number>) => {
		return new Observable<number>((sub) => {
			let currentTime = Date.now()
			let endTime = Date.now() + duration
			let currentValue = 0

			function tick() {
				return requestAnimationFrame(() => {
					currentTime = Date.now()
					const progress = 1 - (endTime - currentTime) / duration
					const value = currentValue * progress
					sub(value)
					if (progress < 1) {
						frameId = tick()
					}
				})
			}

			const subscription = obs.subscribe((value) => {
				currentTime = Date.now()
				endTime = currentTime + duration
				currentValue = value
				cancelAnimationFrame(frameId)
				frameId = tick()
			})

			return () => {
				cancelAnimationFrame(frameId)
				subscription.unsubscribe()
			}
		})
	}
}
