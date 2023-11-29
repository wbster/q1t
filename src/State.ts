import { BehaviorSubject } from "./core/BehaviorSubject"

export class State<T> extends BehaviorSubject<T>{

	/**
	 * @example const { inc } = this.createActions({ inc: v => v + 1 })
	 */
	createActions<K extends string>(actions: { [key in K]: (value: T) => T }) {
		const result = {} as { [key in K]: () => void }
		for (const name in actions) {
			result[name] = () => this.update(actions[name])
		}
		return result
	}
}

export function createState<T>(target: T) {
	return new State(target)
}
