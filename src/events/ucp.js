const {
	MessageFlags,
	EmbedBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder
} = require('discord.js');

const mysql = require('../mysql');
const config = require('../config');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.isButton()) {
			if (interaction.customId === 'ucp_register') {
				const userid = interaction.user.id;

				try {
					const [rows] = await mysql.execute('SELECT * FROM playerucp WHERE discord_id = ?', [userid]);
					if (rows.length > 0) {
						return interaction.reply({
							content: 'You are already registered in the server database, please verify to continue the process.',
							flags: MessageFlags.Ephemeral
						});
					}

					const modal = new ModalBuilder()
						.setCustomId('ucp_modal')
						.setTitle('UCP Registration');
					
					const input = new TextInputBuilder()
						.setCustomId('ucp_name')
						.setLabel('Input UCP name you want')
						.setStyle(TextInputStyle.Short)
						.setMinLength(3)
						.setMaxLength(18)
						.setRequired(true);
					
					const comp = new ActionRowBuilder().addComponents(input);
					modal.addComponents(comp);
					await interaction.showModal(modal);
				} catch (err) {
					console.error(err);
					return interaction.reply({
						content: config.error,
						flags: MessageFlags.Ephemeral
					});
				}
			}

			if (interaction.customId === 'ucp_reverif') {
				const userid = interaction.user.id;

				try {
					const [rows] = await mysql.execute('SELECT * FROM playerucp WHERE discord_id = ?', [userid]);
					if (rows.length === 0) {
						return interaction.reply({
							content: 'You are not registered in the server database, please make a UCP first',
							flags: MessageFlags.Ephemeral
						});
					}

					const ucpname = rows[0].ucp;
					const roleucp = interaction.guild.roles.cache.get(config.role.verified);
					if (roleucp) {
						interaction.member.roles.add(roleucp).catch((err) => {
							console.error(`[ROLE] Failed to add role: ${err}`);
						});
					} else {
						console.log('[ROLE] Role not found');
					}

					await interaction.member.setNickname(ucpname).catch((er) => {
						if (er) {
							console.error(`[NICKNAME] Failed to change name to ${ucpname}: ${er}`);
						} else {
							console.log(`[NICKNAME] Successfully change name to ${ucpname}`);
						}
					});

					await interaction.reply({
						content: `Welcome back <@${interaction.user.id}>! Glad to see you here again!`,
						flags: MessageFlags.Ephemeral
					});
				} catch (err) {
					console.error(err);
					return interaction.reply({
						content: config.error,
						flags: MessageFlags.Ephemeral
					});
				}
			}
		}

		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'ucp_modal') {
				const ucp = interaction.fields.getTextInputValue('ucp_name');
				const userid = interaction.user.id;
				const code = Math.floor(Math.random() * 100000) + 900000;

				try {
					const [res] = await mysql.execute('SELECT * FROM playerucp WHERE ucp = ?', [ucp]);
					if (res.length > 0) {
						return interaction.reply({
							content: `**${ucp}** name has been registered in the server database, please use another name`,
							flags: MessageFlags.Ephemeral
						});
					}

					await mysql.execute('INSERT INTO playerucp (ucp, vcode, discord_id) VALUES (?, ?, ?)', [ucp, code, userid]);
					await interaction.reply({
						content: `**__UCP Successfully Registered__**\n\nName: **${ucp}**\n\nPlease check your Direct Message.`,
						flags: MessageFlags.Ephemeral
					});

					const roleucp = interaction.guild.roles.cache.get(config.role.verified);
					if (roleucp) {
						interaction.member.roles.add(roleucp).catch((err) => {
							console.error(`[ROLE] Gagal menambahkan role: ${err}`);
						});
					} else {
						console.log('[ROLE] Role tidak ditemukan');
					}

					await interaction.member.setNickname(ucp).catch((er) => {
						if (er) {
							console.error(`[NICKNAME] Gagal mengubah nama ke ${ucp}: ${er}`);
						} else {
							console.log(`[NICKNAME] Berhasil mengubah nama ke ${ucp}`);
						}
					});

					const embed = new EmbedBuilder()
						.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
						.setTitle('UCP Successfully Registered')
						.setDescription(`Hi! Your UCP has been successfully registered in **${interaction.guild.name}**`)
						.addFields(
							{
								name: 'IP Address',
								value: `\`\`\`${config.server.ip}\`\`\``,
								inline: false
							},
							{
								name: 'Server Port',
								value: `\`\`\`${config.server.port}\`\`\``,
								inline: false
							},
							{
								name: 'PIN',
								value: `\`\`\`${code}\`\`\``,
								inline: false
							}
						)
						.setColor(config.color)
						.setImage(config.server.banner)
						.setTimestamp();
					
					await interaction.member.send({
						embeds: [embed]
					});
				} catch (err) {
					console.error(err);
					return interaction.reply({
						content: config.error,
						flags: MessageFlags.Ephemeral
					});
				}
			}
		}
	}
};