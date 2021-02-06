import State, { Param } from "./State"

export = function state<T extends Param>(target: T) {
	return new State(target)
}

exports.State = State