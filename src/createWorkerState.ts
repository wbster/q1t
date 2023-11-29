import { State } from "./State"
import { Observable } from "./core"

type Options = {
	isWorker: true
} | {
	worker: Worker
} | {
	workerUrl: URL | string
}

declare var self: any

function createOnMessage<T>() {
	return new Observable<MessageEvent<T>>(sub => {
		self.addEventListener('message', sub)
		return () => {
			self.removeEventListener('message', sub)
		}
	})
}

function workerObservable<T>(worker: Worker) {
	return new Observable<T>(sub => {

		const listener = (event: MessageEvent<T>) => sub(event.data)
		worker.addEventListener('message', listener)

		return () => {
			return worker.removeEventListener('message', listener)
		}
	})
}

export function createWorkerState<T>(initialValue: T, options: Options): State<T> {

	let ignoreMode = false
	const state = new State<T>(initialValue)

	if ('isWorker' in options && options.isWorker) {
		const onMessage = createOnMessage<T>()

		onMessage.subscribe(event => {
			ignoreMode = true
			state.next(event.data)
			ignoreMode = false
		})

		state.subscribe(value => {
			if (ignoreMode) return
			postMessage(value)
		})

		return state

	}

	let worker: Worker

	if ('worker' in options) {
		worker = options.worker
	} else if ('workerUrl' in options) {
		const url = options.workerUrl
		worker = new Worker(typeof url === 'string' ? url : url.href)
	} else {
		throw new Error('options is wrong')
	}

	workerObservable<T>(worker)
		.subscribe(data => {
			ignoreMode = true
			state.next(data)
			ignoreMode = false
		})

	state.subscribe(value => {
		if (ignoreMode) return
		worker.postMessage(value)
	})

	return state
}

createWorkerState({ value: 1 }, {
	'isWorker': true
})
	.subscribe(value => {
		console.log('value.value', value.value)
	})