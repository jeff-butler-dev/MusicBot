const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('pause')
            .setDescription('pauses current song'),
        execute: async ({client, interaction}) => {

            const queue = client.player.getQueue(interaction.guild);

            if(!queue) {
                await interaction.reply('nothing in the queue to pause');
                return
            }
            
            queue.setPaused(true);

            await interaction.reply('Paused player')
        }
}