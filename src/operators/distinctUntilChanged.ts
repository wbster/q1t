import type { IObservable, Operator } from "@/core/IObservable"
import { Observable } from "@/core/Observable"

function isEquals<T>(a: T, b: T): boolean {
	if (a === b) return true
	if (Array.isArray(a)) {
		if (!Array.isArray(b)) return false

		return a.length === b.length && a.every((v, i) => b[i] === v)
	}
	if (typeof a === "object" && typeof b === "object") {
		if (typeof b !== "object") return false
		if (a === null || b === null) return false
		const keysA = Object.keys(a) as (keyof T)[]
		const keysB = Object.keys(b) as (keyof T)[]
		const keyLengthEqual = keysA.length === keysB.length
		if (!keyLengthEqual) return false

		return keysA.every((key) => a[key] === b[key])
	}

	return false
}

export function distinctUntilChanged<T>(
	isEqualCompare: (a: T, b: T) => boolean = isEquals,
): Operator<T> {
	return (obs: IObservable<T>) => {
		return new Observable<T>((sub) => {
			let prevInit = false
			let prevValue: T | undefined = undefined

			const subscription = obs.subscribe((value) => {
				if (prevInit) {
					if (!isEqualCompare(value, prevValue as T)) {
						sub(value)
						prevValue = value as T
					}
				} else {
					prevValue = value as T
					prevInit = true
					sub(value)
				}
			})

			return () => subscription.unsubscribe()
		})
	}
}
