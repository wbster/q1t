import { useEffect, useState } from 'react'
import { Observable } from "../core/Observable"
import { skip } from '../operators'

export function useObservable<const T>(obs: Observable<T>, initialValue: T) {
	const [value, setValue] = useState(() => {
		let value: T | undefined = undefined
		obs.subscribe((v) => {
			value = v
		}).unsubscribe()

		return value || initialValue
	})

	useEffect(() => {
		const subsciption = obs.pipe(skip(1)).subscribe((v) => {
			setValue(v)
		})

		return () => {
			subsciption.unsubscribe()
		}
	}, [])

	return [value]
}
