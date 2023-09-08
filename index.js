const WebSocketClient = require('websocket').client;
const fs = require('fs')
const parseMsg = require('./src/parseMsg')

const client = new WebSocketClient();

const token = fs.readFileSync('./twitch_key.txt').toString('utf-8')

const channel = '#misterjday'
const logFile = 'tchat.txt'

client.on('connectFailed', function(error) {
	console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
	console.log('WebSocket Client Connected');

	connection.on('message', msg => {
		if (msg.type === 'utf8') {
			const data = msg.utf8Data
			fs.appendFileSync(logFile, data)
			if (data.startsWith('@badge-info=')) {
				parseMsg(data)
			}
		}
	})

	connection.on('close', () => {
		console.log('Client closed connection')
	})

	connection.sendUTF('CAP REQ :twitch.tv/tags')
	connection.sendUTF(`PASS oauth:${token}`)
	connection.sendUTF(`NICK mookieCaster`)
	connection.sendUTF(`JOIN ${channel}`)
});

client.connect('ws://irc-ws.chat.twitch.tv:80')