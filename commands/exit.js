const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exit")
    .setDescription("removes bot from channel"),
  execute: async ({ client, interaction }) => {
    await interaction.deferReply();
    try {
      const queue = useQueue(interaction.guildId);

      if (!queue.connection) {
        await interaction.reply("Not in a channel to exit");
        return;
      }
      queue.connection.destroy();
    } catch (error) {
      return error;
    }

    await interaction.editReply("Successfully removed");
  },
};
