import { Observable } from "./Observable"

export type BasicEvent = { type: string }

export class EventEmitter<E extends BasicEvent> {
	private childs = [] as EventEmitter<any>[]
	private map = new Map<E["type"], ((event: E) => void)[]>()

	on<N extends E["type"]>(
		name: N,
		func: (event: Extract<E, { type: N }>) => void,
	) {
		if (!this.map.has(name)) this.map.set(name, [])
		const list = this.map.get(name)
		if (!list) throw new Error("unexpected error")
		list.push(func as (event: E) => void)

		return () => this.off(name, func)
	}

	off<N extends E["type"]>(
		name: N,
		func: (event: Extract<E, { type: N }>) => void,
	) {
		if (!this.map.has(name)) this.map.set(name, [])
		const list = this.map.get(name)
		if (!list) throw new Error("unexpected error")
		this.map.set(
			name,
			list.filter((h) => h !== func),
		)

		return () => this.on(name, func)
	}

	emit<N extends E["type"]>(
		type: N,
		data: Omit<Extract<E, { type: N }>, "type">,
	) {
		const list = this.map.get(type) || []
		const event = { type, ...data } as Extract<E, { type: N }>
		list.forEach((handler) => handler(event))
		this.childs.forEach((c) => c.emit(type, data))
	}

	add<N extends BasicEvent>(emitter: EventEmitter<N>) {
		this.childs.push(emitter)
	}

	remove<N extends BasicEvent>(emitter: EventEmitter<N>) {
		this.childs = this.childs.filter((c) => c !== emitter)
	}

	toObservable<N extends E["type"]>(
		type: N,
	): Observable<Extract<E, { type: N }>> {
		return new Observable((subscriber) => {
			const unsub = this.on(type, (event) => subscriber(event))

			return () => unsub()
		})
	}
}
