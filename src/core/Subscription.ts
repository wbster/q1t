export class Subscription {

	constructor(private unsub: () => void) { }

	unsubscribe() {
		this.unsub()
	}

}
