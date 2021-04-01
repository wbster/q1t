import { State, Param } from "./State"

const q1t = function state<T extends Param>(target: T) {
	return new State(target)
}

export = q1t