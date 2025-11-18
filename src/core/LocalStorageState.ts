import { skip } from "../operators"
import { State } from "./State"

export const createLocalStorageState = <T>(key: string, initialValue: T) => {
	const state = new State(initialValue)
	const value = JSON.parse(localStorage.getItem(key) as any) as T

	state.value = value

	state.pipe(skip(1)).subscribe((value) => {
		localStorage.setItem(key, JSON.stringify(value))
	})

	return state
}