Promise.resolve()
.then(() => {
	Promise.resolve()
	.then(() => {
		console.log(1)
		return Promise.resolve();  // then 
	}).then(() => {
		console.log(2)
	})
}).then(() => {
	console.log(3);
}).then(() => {
	console.log(4);
}).then(()=>{
	console.log(5);
}).then(()=>{
	console.log(6);
})
