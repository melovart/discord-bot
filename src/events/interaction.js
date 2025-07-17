const { MessageFlags } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'An error occurred while executing this command.',
					flags: MessageFlags.Ephemeral
				});
			}
			return;
		}
	}
};