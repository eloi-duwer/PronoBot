const express = require('express')

const app = express()

app.get('/oauth', (req, res) => {
	console.log('GET')
	console.log(req.params)
	res.send('OK')
})

app.listen(3000, () => {
	console.log('server listening on 3000')
})