const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { QueryType, useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Searches for a song")
        .addStringOption((option) =>
          option
            .setName("searchterms")
            .setDescription("search keywords")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Plays playlist from YT")
        .addStringOption((option) =>
          option.setName("url").setDescription("playlist url").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Plays song from YT")
        .addStringOption((option) =>
          option.setName("url").setDescription("song url").setRequired(true)
        )
    ),
  execute: async ({ client, interaction }) => {
    await interaction.deferReply();
    client.player.extractors.loadDefault();

    // Checking to see if user is even in channel first before trying to play anything
    if (!interaction.member.voice.channel)
      return interaction.reply("Join a channel first");

    //Creating queue object to be used in all commands and joining channel that it was created in
    const queue = await client.player.nodes.create(interaction.guild);
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    // Start of handle YT link
    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      // if above search returns no values, return no song found or assign track to trackToAdd
      if (result.tracks.length === 0) {
        return await interaction.reply("song not found");
      } else {
        trackToAdd = result.tracks[0];
      }

      // play and queue are assigned to different stacks. just adding to queue without check
      // will result in doubles of the first instance of a track being added
      if (queue.size === 0) {
        queue.play(trackToAdd);
      } else {
        queue.addTrack(trackToAdd);
      }

      embed = new EmbedBuilder()
        .setTitle(trackToAdd.title)
        .setDescription(`Track length [${trackToAdd.duration}]`)
        .setImage(trackToAdd.thumbnail);
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0) {
        await interaction.reply("playlist not found");
        return;
      }

      // We dont have to do the same check here as adding single track
      playListToAdd = result.playlist;
      queue.addTrack(playListToAdd);

      const queueString = queue.tracks
        .map((song, i) => {
          return `${i + 1}) ${song.duration} ${song.title}`;
        })
        .join("\n");

      embed = new EmbedBuilder()
        .setTitle("Playlist added")
        .setDescription(`\n\n**Queue**\n${queueString}`);
    } else if (interaction.options.getSubcommand() === "search") {
      let url = interaction.options.getString("searchterms");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0) {
        await interaction.reply("nothing found in search");
        return;
      }

      trackToAdd = result.tracks[0];

      if (queue.size === 0) {
        queue.play(trackToAdd);
      } else {
        queue.addTrack(trackToAdd);
      }

      embed = new EmbedBuilder()
        .setTitle(trackToAdd.title)
        .setDescription(`Track length [${trackToAdd.duration}]`)
        .setImage(trackToAdd.thumbnail);
    }
    if (!queue.isPlaying() && queue.size > 0)
      await queue.play(queue.tracks.data);
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
