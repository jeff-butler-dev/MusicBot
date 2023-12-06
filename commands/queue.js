const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("returns first 25 songs in queue"),
  execute: async ({ client, interaction }) => {
    await interaction.deferReply();
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      await interaction.reply("There is no song playing");
      return;
    }
    const queueString = queue.tracks
      .map((song, i) => {
        return `${i + 1}) ${song.duration} ${song.title}`;
      })
      .join("\n");
    const currentSong = queue.currentTrack;
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Current Song: ${currentSong.title}`)
          .setDescription(`\n\n**Queue**\n${queueString}`),
      ],
    });
  },
};
