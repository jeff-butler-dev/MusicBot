const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('queue')
            .setDescription('shows the first 10 songs in queue'),
        execute: async({client, interaction}) => {
            const queue = client.player.getQueue(interaction.guild);

            if (!queue || !queue.playing) {
                await interaction.reply('There is no song playing')
                return
            }

            const queueString = queue.tracks.slice(0,10).map((song, i) => {
                return `${i + 1}) ${song.duration}\ ${song.title}`
            }).join('/n');

            const currentSong = queue.current;

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`Currently playing ${currentSong.title}`)
                ]
            })
        }
    }