const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('exit')
            .setDescription('removes bot from channel'),
        execute: async ({client, interaction}) => {

            const queue = client.player.getQueue(interaction.guild);

            if(!queue) {
                await interaction.reply('nothing in the queue to pause');
                return
            }
            
            queue.destroy();

            await interaction.reply('Paused removed')
        }
}