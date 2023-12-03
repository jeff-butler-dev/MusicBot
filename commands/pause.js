const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("pauses current song"),
  execute: async ({ client, interaction }) => {
    const queue = useQueue(interaction.guildId);

    try {
      if (!interaction.member.voice.channel || !queue) {
        await interaction.reply("Unable to pause");
        return;
      }
      queue.node.setPaused(!queue.node.isPaused());
    } catch (error) {
      console.log(error);
    }
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Paused current track`)
          .setDescription("Pause was successful"),
      ],
    });
  },
};
