const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skips current song"),
  execute: async ({ client, interaction }) => {
    const queue = useQueue(interaction.guildId);
    await interaction.deferReply();

    try {
      if (queue.node.size === 0)
        return await interaction.reply("There is nothing in the queue to skip");
      if (!queue.connection)
        return await interaction.reply("Join a channel first");

      queue.node.skip();
    } catch (error) {
      return error;
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Skipped current track`)
          .setDescription("Track was successfully skipped"),
      ],
    });
  },
};
