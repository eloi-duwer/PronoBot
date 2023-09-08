const fs = require('fs')
const { readStats, writeStats } = require(__dirname + '/readStats')

const predictorsFolder = __dirname + '/predictors'
const predictorsFiles = fs.readdirSync(predictorsFolder)
const predictors = predictorsFiles.map(file => require(`${predictorsFolder}/${file}`))
console.log(`Loaded ${predictors.length} predictors: ${predictors.map(p => p.title).join(', ')}`)

let odds = []
let predictions = []
let currentPrediction

module.exports = function parseMsg(data) {
	let [tags, host, type, channel, ...msg] = data.split(' ')
	msg = msg.join(' ')
	const parsedTags = tags.split(';').reduce((acc, tag) => {
		const [key, val] = tag.split('=')
		return {
			...acc,
			[key]: val
		}
	}, {})

	tags = tags.split(';').reduce((acc, tag) => {
		const [tagName, tagValue] = tag.split('=')
		return {
			...acc,
			[tagName]: tagValue
		}
	}, {})

	if (tags['display-name'] === 'PronoKart') {
		// A game is starting
		if (msg.startsWith(':Cotes du moment : ')) {
			console.log(`New odds: `, msg)
			msg = msg.slice(':Cotes du moment : '.length)
			odds = msg.split(',').map(cote =>
				+cote.match(/.* = (?<points>\d+) pts/).groups.points
			)

			predictions = predictors.map(predictor => {
				const prediction = predictor.guess(odds)
				console.log(`Predictor '${predictor.title}' has guessed ${prediction + 1}`)
				return prediction
			})

			currentPrediction = findBestPrediction()
			console.log(odds)
		}

		// A game is ending
		if (msg.includes('ACTION Bravo à')) {
			const points = +msg.match(/qui gagnent (?<points>\d+) points !/)?.groups?.points
			const place = odds.indexOf(points)
			if (place === 0) {
				console.error(`Could not find placement related to odd ${odds}`)
				return
			}
			console.log(`Final Placement: ${place + 1}`)
			if (place === currentPrediction) {
				console.log(`Guessed correctly !`)
			} else {
				console.log(`Guessed incorrectly ( ._.)`)
			}
			const stats = readStats()
			predictors.forEach((p, i) => {
				const { title } = p
				if (!stats[title]) {
					stats[title] = {
						guess: 0,
						correct: 0
					}
				}
				if (predictions[i] === place) {
					stats[title].correct++
				}
				stats[title].guess++
			})
			writeStats(stats)
		}
	}
}

function findBestPrediction() {
	const stats = readStats()
	const predictorRatio = predictors.map(p => {
		const stat = stats[p.title]
		if (!stat) {
			return -Infinity
		}
		return stat.correct / stat.guess
	})
	const max = predictorRatio.reduce((acc, val) => val > acc ? val : acc, -Infinity)

	const predict = predictions[predictorRatio.indexOf(max)]
	const bestPredictor = predictors[predictorRatio.indexOf(max)]
	console.log(`Going to predict ${predict + 1}`)
	console.log(`Best predictor for this round: ${bestPredictor.title}`)
	return predict + 1
}