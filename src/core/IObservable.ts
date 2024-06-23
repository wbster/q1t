import type { Observable } from "./Observable"
import type { Subscription } from "./Subscription"

export interface IObservable<E> {
	subscribe(cb: (event: E) => void): Subscription
	pipe<R>(operator: Operator<E, R>): Observable<R>
}

export type Operator<T, R = T> = (obs: IObservable<T>) => Observable<R>
