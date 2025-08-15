const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        const channel = member.guild.channels.cache.get(config.server.portal);
		if (!channel) return;

		const accountCreatedTimestamp = Math.floor(member.user.createdTimestamp / 1000);
		const name = member.user.displayName || member.user.username;
		const embedJoin = new EmbedBuilder()
			.setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) })
			.setTitle(`Welcome **${name}** 👋`)
			.setDescription(
				`You are the **${member.guild.memberCount}th** member\n` +
				`Your account was created on <t:${accountCreatedTimestamp}:D>\n` +
				`We’re glad to have you here!\n` +
				`Let’s make San Andreas a place worth playing!`
			)
			.setColor(0x00ff00)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		channel.send({ embeds: [embedJoin] });
    }
};