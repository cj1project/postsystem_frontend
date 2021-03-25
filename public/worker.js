self.addEventListener('message', async (event) => {
	console.log('Got message in the service worker', event);
});
self.addEventListener('push', function (event) {
	console.log('event', event);
	let title = 'New Message from Postmann';
	let options = {
		body: 'Welcome to postmann!',
		icon: '/images/icon.png',
		badge: '/images/badge.png',
	};
	//use variable "response" to determine which message to display
	if (event.data && event.data.text) {
		const response = event.data.text;
		title = '';
		options = {
			body: '',
			icon: '/images/icon.png',
			badge: '/images/badge.png',
		};
		if (response == 'subscription') {
			title = 'New Message from Postmann';
			options.body =
				'You have sucessfully subscribed to Postmann notifications :)';
		}
		if (response == 'notification') {
			title = "You've got new mail";
			options.body = 'You have received something in your mailbox!';
			options.actions = [
				{
					action: 'notification-action-history',
					title: 'History',
				},
				{
					action: 'notification-action-notification',
					title: 'See',
				},
			];
		}
	}
	const promiseChain = self.registration.showNotification(title, options);
	event.waitUntil(promiseChain);
});
self.addEventListener('notificationclick', function (event) {
	if (!event.action) {
		// Was a normal notification click
		console.log('Notification Click.');
		return;
	}

	//switch (event.action) {
	//	case 'default':
	const rootUrl = new URL('./history', location).href;
	event.notification.close();
	event.waitUntil(
		clients.matchAll().then((matchedClients) => {
			for (let client of matchedClients) {
				if (client.url.indexOf(rootUrl) >= 0) {
					return client.focus();
				}
			}
			return clients.openWindow(rootUrl).then(function (client) {
				client.focus();
			});
		})
	);
	//		break;
	//	case 'notification-action-notification':
	//		console.log("User ❤️️'s doughnuts.");
	//		break;
	//	}
});
