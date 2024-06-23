import { useCallback, useEffect, useReducer } from "react"
import type { State } from "../core/State"
import { skip } from "../operators"

export function useReactiveState<T>(state: State<T>) {
	const value = state.getValue()

	const setValue = useCallback((value: T | ((value: T) => T)) => {
		if (typeof value === "function") {
			state.update(value as (v: T) => T)
		} else {
			state.setValue(value)
		}
	}, [])

	const [_, render] = useReducer(
		() => null,
		value,
		() => null,
	)

	useEffect(() => {
		const subscription = state.pipe(skip(1)).subscribe(() => {
			render()
		})

		return () => subscription.unsubscribe()
	}, [])

	return [value, setValue] as [T, (v: T) => T]
}
