import { Observable } from "@/core/Observable"

export function createTimeoutObservable(time: number) {
	return new Observable<void>((s) => {
		const id = setTimeout(() => s(), time)

		return () => clearTimeout(id)
	})
}
