const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

(async () => {
	try {
		console.log('Cleaning SlashCommand...');

		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID),
			{ body: [] }
		);

		console.log('\x1b[33m[SLASH] \x1b[37mSlashCommand \x1b[32mSuccessfully \x1b[37mCleared\x1b[0m');
	} catch (error) {
		console.error(error);
	}
})();