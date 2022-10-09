// #wallstreetbets let's go on the biggest possible win !

module.exports = {
	title: 'Maximal',
	guess: odds => {
		const max = odds.reduce((acc, val) => val > acc ? val : acc, -Infinity)
		return odds.indexOf(max)
	},
	result: (place) => {}
}