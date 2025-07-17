const { ActivityType } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`\x1b[32m[CLIENT] \x1b[34m${client.user.tag} \x1b[37mis now Online!\x1b[0m`);

		client.user.setActivity(`Melovart SA-MP & Bot Community!`, { type: ActivityType.Listening });
		client.user.setStatus('dnd');
	}
};