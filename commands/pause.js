const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('pause')
            .setDescription('pauses current song'),
        execute: async ({client, interaction}) => {

            const queue = useQueue(interaction.guildId);

            if(queue.node.size == 0) {
                await interaction.reply('nothing in the queue to pause');
                return
            }
            
            if(!queue.node.isPaused() && !queue.node.size > 0)queue.node.setPaused(true)
            else if(queue.node.isPaused() && !queue.node.size > 0)queue.node.setPaused(false)

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Paused current track`)
                    .setDescription('Pause was successful')
                ]
            })
        }
}