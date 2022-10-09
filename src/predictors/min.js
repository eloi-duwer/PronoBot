// The minimal odd is some sort of the mean place already...
// Why should we risk anything else ?

module.exports = {
	title: 'Minimal',
	guess: odds => {
		const min = odds.reduce((acc, val) => val < acc ? val : acc, +Infinity)
		return odds.indexOf(min)
	},
	result: (place) => {}
}