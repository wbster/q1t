export class Subscription {
	constructor(private destroyHandler: () => void) {}

	unsubscribe() {
		this.destroyHandler()
	}
}
