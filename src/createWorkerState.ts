import type { State } from "./core/State"
import { Observable } from "./core/Observable"
import { Subscription } from "./core/Subscription"

type Options =
	| {
			isWorker: true
	  }
	| {
			worker: Worker
	  }
	| {
			workerUrl: URL | string
	  }

declare var self: any

function createOnMessage<T>() {
	return new Observable<MessageEvent<T>>((sub) => {
		self.addEventListener("message", sub)
		return () => {
			self.removeEventListener("message", sub)
		}
	})
}

function workerObservable<T>(worker: Worker) {
	return new Observable<T>((sub) => {
		const listener = (event: MessageEvent<T>) => sub(event.data)
		worker.addEventListener("message", listener)

		return () => {
			return worker.removeEventListener("message", listener)
		}
	})
}

export function createWorkerState<T>(
	state: State<T>,
	options: Options,
): Subscription {
	let ignoreMode = false

	const subs = [] as Subscription[]
	if ("isWorker" in options && options.isWorker) {
		const onMessage = createOnMessage<T>()

		const onMessageSibsription = onMessage.subscribe((event) => {
			ignoreMode = true
			state.value = event.data
			ignoreMode = false
		})

		const stateSubscription = state.subscribe((value) => {
			if (ignoreMode) return
			postMessage(value)
		})

		subs.push(onMessageSibsription)
		subs.push(stateSubscription)

		return new Subscription(() => {
			subs.forEach((sub) => sub.unsubscribe())
		})
	}

	let worker: Worker

	if ("worker" in options) {
		worker = options.worker
	} else if ("workerUrl" in options) {
		const url = options.workerUrl
		worker = new Worker(typeof url === "string" ? url : url.href)
	} else {
		throw new Error("options is wrong")
	}

	const workerSubscription = workerObservable<T>(worker).subscribe((data) => {
		ignoreMode = true
		state.value = data
		ignoreMode = false
	})

	const stateSubscription = state.subscribe((value) => {
		if (ignoreMode) return
		worker.postMessage(value)
	})

	subs.push(workerSubscription, stateSubscription)

	return new Subscription(() => {
		subs.forEach((sub) => sub.unsubscribe())
	})
}
