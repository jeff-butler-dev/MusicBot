const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("shows the first 10 songs in queue"),
  execute: async ({ client, interaction }) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      await interaction.reply("There is no song playing");
      return;
    }

    //need to refactor to make end result look better.
    testArray = [];
    const queueString = queue.tracks
      .map((song, i) => {
        testArray.push({ name: song.duration, value: song.title });
        return `${i + 1}) ${song.duration}\ ${song.title}`;
      })
      .join("/n");
    const currentSong = queue.currentTrack;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Current Song: ${currentSong.title}`)
          .setDescription("List of current songs")
          .setFields(testArray),
      ],
    });
  },
};
