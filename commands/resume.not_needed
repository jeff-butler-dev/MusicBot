const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('resume')
            .setDescription('resumes current song'),
        execute: async ({client, interaction}) => {

            const queue = client.player.getQueue(interaction.guild);

            if(!queue) {
                await interaction.reply('nothing in the queue to resume');
                return
            }
            
            queue.setPaused(false);

            await interaction.reply('Paused player')
        }
}