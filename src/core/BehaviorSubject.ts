import { Subject } from './Subject'

export class BehaviorSubject<E> extends Subject<E> {

	constructor(value: E) {
		super()
		this.inited = true
		this.value = value
	}

	getValue(): E {
		return this.value as E
	}

	/**
	 * @example subject.update(oldState => ({ ...oldState, key: 'value' }))
	 */
	update(fn: (target: E) => E) {
		this.next(fn(this.getValue()))
	}

}
