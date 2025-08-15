const { ActivityType } = require('discord.js');
const getstatus = require('../utils/getstatus');
const config = require('../config');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`\x1b[32m[CLIENT] \x1b[34m${client.user.tag} \x1b[37mis now Online!\x1b[0m`);

		const ip = config.server.ip;
		const port = config.server.port;

		async function updateStatus() {
			const status = await getstatus(ip, port);
			if (status) {
				client.user.setActivity(`${status.players} players!`, { type: ActivityType.Listening });
				client.user.setStatus('online');
			} else {
				client.user.setActivity(`Server is now Offline`, { type: ActivityType.Listening });
				client.user.setStatus('online');
			}
		}

		updateStatus();
		setInterval(updateStatus, 30000);
	}
};