import { State } from "./State"

export class LocalStorageState<T> extends State<T> {
	constructor(private key: string, initialValue: T) {
		super((JSON.parse(localStorage.getItem(key) as any) as T) || initialValue)
	}

	setValue(value: T) {
		super.setValue(value)
		localStorage.setItem(this.key, JSON.stringify(value))
	}
}
