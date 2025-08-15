const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
		const channel = member.guild.channels.cache.get(config.server.portal);
		if (!channel) return;

		const name = member.displayName || member.user.tag;
		const embedLeave = new EmbedBuilder()
			.setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) })
			.setTitle(`Goodbye ${name} 👋`)
			.setColor(0xff0000)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setDescription(
				`You joined since <t:${Math.floor(member.joinedTimestamp / 1000)}:D>\n` +
				`Current members **${member.guild.memberCount} remaining**` +
				`see you out there`
			)
			.setTimestamp();

		await channel.send({ embeds: [embedLeave] });
	},
};
