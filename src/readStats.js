const fs = require('fs')

const predictorStatsFile = __dirname + '/predictorStats.json'

module.exports = {
	readStats: () => {
		return JSON.parse(fs.readFileSync(predictorStatsFile))
	},
	writeStats: (stats) => {
		fs.writeFileSync(predictorStatsFile, JSON.stringify(stats, null, 2))
	}
}