const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('skip')
            .setDescription('skips current song'),
        execute: async ({client, interaction}) => {

            const queue = useQueue(interaction.guildId);

            if(queue.node.size == 0) {
                await interaction.reply('nothing in the queue to skip');
                return
            }
            
            queue.node.skip()

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Skipped current track`)
                    .setDescription('Track was successfully skipped')
                ]
            })
        }
}