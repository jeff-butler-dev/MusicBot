const { slashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { queryType, QueryType } = require('discord-player');

module.exports = {
    data: new slashCommandBuilder()
            .setName('play')
            .setDescription('Plays a song')
            .addSubCommand(subcommand => {
                subcommand
                    .setName('search')
                    .setDescription('Searches for a song')
                    .addStringOption(option => {
                        option
                            .setName('searchterms')
                            .setDescription('search keywords')
                            .setRequired(true);
                    })
            })
            .addSubCommand(subcommand => {
                subcommand
                    .setName('playlist')
                    .setDescription('Plays playlist from YT')
                    .addStringOption(option => {
                        option
                            .setName('url')
                            .setDescription('playlist url')
                            .setRequired(true);
                    })
            })
            .addSubCommand(subcommand => {
                subcommand
                    .setName('song')
                    .setDescription('Plays song from YT')
                    .addStringOption(option => {
                        option
                            .setName('url')
                            .setDescription('song url')
                            .setRequired(true);
                    })
            }),
    execute: async ({client, interaction}) => {
        if (!interaction.member.voice.channel) {
            await interaction.reply('Join a channel before requesting')
            return;
        }

        const queue = await client.player.createQueue(interaction.guild);

        if(!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new MessageEmbed();

        if (interaction.options.getSubcommand() === 'song') {
            let url = interaction.options.getString('url')

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            if(result.tracks.length === 0) {
                await interaction.reply('song not found')
                return
            }

            const song = result[0];
            await queue.addTrack(song);

            embed
            .setDescription(`Added ${song.title}`)
            .setThumbnail(song.thumbnail)
        }

        else if (interaction.options.getSubcommand() === 'playlist') {
            let url = interaction.options.getString('url')

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if(result.tracks.length === 0) {
                await interaction.reply('playlist not found')
                return
            }

            const playlist = result[0];
            await queue.addTracks(song);

            embed
            .setDescription(`Added ${playlist.title}`)
            .setThumbnail(playlist.thumbnail)
        }
        else if (interaction.options.getSubcommand() === 'searchterms') {
            let url = interaction.options.getString('url')

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if(result.tracks.length === 0) {
                await interaction.reply('nothing found in search');
                return
            }

            const song = result[0];
            await queue.addTrack(song);

            embed
            .setDescription(`Added ${song.title}`)
            .setThumbnail(song.thumbnail)
        }
        
        if(!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embed]
        })
    }
}