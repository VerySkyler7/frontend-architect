Promise.resolve()
	.then(() => {
		Promise.resolve()
			.then(() => console.log(1))
			.then(() => console.log(2))

		console.log(0);
	}).then(() => {
		console.log(3);
	}).then(() => {
		console.log(4);
	})
