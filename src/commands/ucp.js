const {
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder
} = require('discord.js');
const config = require('../config');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ucp')
		.setDescription('UCP Panel'),
	async execute (interaction) {
		const userid = interaction.user.id;
		if (userid !== config.owner_id) {
			return interaction.reply({
				content: config.denied,
				flags: MessageFlags.Ephemeral
			});
		}

		const embed = new EmbedBuilder()
			.setAuthor({
				name: interaction.guild.name,
				iconURL: interaction.guild.iconURL({ dynamic: true })
			})
			.setTitle('UCP Registration')
			.setDescription(
				'Hi players! This panel is intended for creating a user control panel, which will be used to manage your character. Make sure you know the functions of the buttons below.'
			)
			.addFields(
				{
					name: '**__Register Button__**',
					value: '> This button is used to create your new UCP which will be used to play on our server.',
					inline: false
				},
				{
					name: '**__Reverif Button__**',
					value: '> This button is used to re-verify your UCP account if you exit our Discord server, your account will be in Unverified status if you exit our Discord server.',
					inline: false
				}
			)
			.setImage(config.server.banner)
			.setColor(config.color)
			.setTimestamp();
		
		const b1 = new ButtonBuilder()
			.setCustomId('ucp_register')
			.setLabel('Register')
			.setEmoji('📝')
			.setStyle(ButtonStyle.Success);
		
		const b2 = new ButtonBuilder()
			.setCustomId('ucp_reverif')
			.setLabel('Reverif')
			.setEmoji('🗒️')
			.setStyle(ButtonStyle.Primary);
		
		const row = new ActionRowBuilder().addComponents(b1, b2);
		
		await interaction.reply({ content: 'Panel Successfully Send', flags: MessageFlags.Ephemeral });
		await interaction.channel.send({ embeds: [embed], components: [row] });
	}
};