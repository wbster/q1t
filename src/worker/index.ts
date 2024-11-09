import { EventEmitter } from "../core/EventEmitter"
import type { MaybePromise } from "../types"

export type JsonRpc<N extends string, T, ResponseData> = {
	name: N
	request: T
	response: ResponseData
	_fetchUniqId: number
}

export type JsonRpcRequest<M extends JsonRpc<string, any, any>> = {
	requestName: RequestName<M>
	data: M['request']
	_fetchUniqId?: number
}

export type JsonRpcResponse<M extends JsonRpc<string, any, any>> = {
	data: M['response']
	_fetchUniqId?: number
}

export type ResponseData<M extends JsonRpc<string, any, any>> = M['response']
export type RequestName<M extends JsonRpc<string, any, any>> = M['name']

export type Notification<N extends string, T> = {
	notificationName: N
	data: T
}

export type NotificationData<N extends Notification<string, any>> = N['data']
export type NotificationName<N extends Notification<string, any>> =
	N['notificationName']

export function isWorkerMessage<M extends JsonRpc<string, any, any>>(
	message: any,
): message is M {
	return message.requestName !== undefined || message._fetchUniqId !== undefined
}

export function isJsonRpcRequest<M extends JsonRpc<string, any, any>>(
	message: any,
): message is JsonRpcRequest<M> {
	return message.requestName !== undefined
}

export function isNotification<N extends Notification<string, any>>(
	message: any,
): message is N {
	return message.notificationName !== undefined
}

/**
 * client side of the connection
 */
export function connectWorker<
	M extends JsonRpc<string, any, any>,
	N extends Notification<string, any>,
>(worker: Worker) {
	const emitter = new EventEmitter<
		| { type: 'response'; data: JsonRpcResponse<M> }
		| { type: 'notification'; data: N }
	>()

	function handleMessage(message: JsonRpcResponse<M> | N) {
		if ('_fetchUniqId' in message) {
			emitter.emit('response', { data: message })
		} else {
			emitter.emit('notification', { data: message as N })
		}
	}

	function handle(event: MessageEvent) {
		const message = event.data as JsonRpcResponse<M> | N
		if (Array.isArray(message)) {
			message.forEach(handleMessage)
		} else {
			handleMessage(message)
		}
	}
	worker.addEventListener('message', handle)

	const queue = [] as unknown[]
	function push(message: unknown) {
		if (queue.length === 0) {
			queueMicrotask(() => {
				const messages = Array.from(queue)
				queue.length = 0
				worker.postMessage(messages)
			})
		}
		queue.push(message)
	}

	return {
		sendNotification<Name extends N['notificationName']>(
			name: Name,
			data: Extract<N, { notificationName: Name }>['data'],
		) {
			push({ notificationName: name, data })
		},

		onNotification: emitter.toObservable('notification'),

		destroy() {
			worker.terminate()
		},

		fetch<S extends M>(
			request: Omit<JsonRpcRequest<S>, '_fetchUniqId'>,
		): Promise<Omit<JsonRpcResponse<S>, '_fetchUniqId'>> {
			const requestId = Math.random()

			return new Promise((resolve, reject) => {
				const sub = emitter
					.toObservable('response')
					.subscribe(({ data: response }) => {
						if (response._fetchUniqId === requestId) {
							resolve(response)
							sub.unsubscribe()
						}
					})
				push({ ...request, _fetchUniqId: requestId })
			})
		},
	}
}

/**
 * worker side of the connection
 */
export function connectClient<
	M extends JsonRpc<string, any, any>,
	N extends Notification<string, any>,
>(options: {
	fetch: (request: JsonRpcRequest<M>) => MaybePromise<JsonRpcResponse<M>>,
	notificationHandler: (notification: N) => void,
}) {
	const queue = [] as unknown[]

	function push(message: unknown) {
		// self.postMessage(message)
		if (queue.length === 0) {
			queueMicrotask(() => {
				const messages = Array.from(queue)
				queue.length = 0
				self.postMessage(messages)
			})
		}
		queue.push(message)
	}

	const handleMessage = (message: unknown) => {
		if (isJsonRpcRequest<M>(message)) {
			if ('fetch' in options) {
				const result = options.fetch(message)
				if (result instanceof Promise) {
					result.then((response) => {
						push({ ...response, _fetchUniqId: message._fetchUniqId })
					})
				} else {
					push({ ...result, _fetchUniqId: message._fetchUniqId })
				}
			} else {
				console.warn('No fetch function provided')
			}
		} else if (isNotification<N>(message)) {
			if ('notificationHandler' in options) {
				options.notificationHandler(message)
			} else {
				console.warn('No notificationHandler provided')
			}
		}
	}

	function handle(event: MessageEvent) {
		const message = event.data
		if (Array.isArray(message)) {
			message.forEach(handleMessage)
		} else {
			handleMessage(message)
		}
	}

	self.addEventListener('message', handle)

	return () => {
		self.removeEventListener('message', handle)
	}
}
