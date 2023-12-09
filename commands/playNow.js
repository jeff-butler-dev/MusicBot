const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { useQueue, QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playnow")
    .setDescription("Plays YT song you pass in immedietly")
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

    try {
      // Checking to see if user is even in channel first before trying to play anything
      if (!interaction.member.voice.channel)
        return interaction.reply("Join a channel first");

      //Creating queue object to be used in all commands and joining channel that it was created in
      const queue = useQueue(interaction.guild.id);
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
          queue.insertTrack(trackToAdd);
          queue.node.skip();
        }
        embed = new EmbedBuilder()
          .setTitle(trackToAdd.title)
          .setDescription(`Track length [${trackToAdd.duration}]`)
          .setImage(trackToAdd.thumbnail);
      }
    } catch (error) {
      return error;
    }

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
