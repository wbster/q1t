import { Subscription } from './Subscription'

export interface IObservable<E> {
	subscribe(cb: (event: E) => void): Subscription
	pipe<R>(operator: (obs: IObservable<E>) => IObservable<R>): IObservable<R>
}
