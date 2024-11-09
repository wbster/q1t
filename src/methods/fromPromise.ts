import { Observable } from "../core"

export function fromPromise<T>(
	promise: Promise<T>,
): Observable<{ status: true; value: T } | { status: false; err: Error }> {
	return new Observable((subscriber) => {
		let abort = false

		promise.then(
			(value) => {
				if (abort) return

				subscriber({ status: true, value })
			},
			(error) => {
				if (abort) return

				subscriber({ status: false, err: error })
			},
		)

		return () => {
			abort = true
		}
	})
}
