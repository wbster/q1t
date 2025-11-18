import { State } from "./State"

export const createLocalStorageState = <T>(key: string, initialValue: T) => {
	const state = new State(initialValue)
	const value = JSON.parse(localStorage.getItem(key) as any) as T

	state.setValue(value)

	const originalSetValue = state.setValue

	state.setValue = (value) => {
		originalSetValue(value)
		localStorage.setItem(key, JSON.stringify(value))
	}

	return state
}