import { Observable } from '../core/Observable'

export function createFetchObservable(input: Request, init?: RequestInit) {
	return new Observable<Response>(s => {
		const abortController = new AbortController()

		fetch(input, { ...init, signal: abortController.signal }).then(s)

		return () => {
			abortController.abort()
		}
	})
}
