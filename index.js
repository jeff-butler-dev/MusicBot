require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const { Player, useQueue } = require("discord-player");

const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

client.player.extractors.loadDefault();

client.on(Events.ClientReady, () => {
  const guild_ids = client.guilds.cache.map((guild) => guild.id);
  const rest = new REST().setToken(process.env.TOKEN);

  for (const guildID of guild_ids) {
    rest
      .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildID), {
        body: commands,
      })
      .then(() => console.log(`Added commands to ${guildID}`))
      .catch(console.error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!client.player) {
    client.player = new Player(client, {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      },
    });
  }

  const command = client.commands.get(interaction.commandName);
  if (!interaction.isCommand()) return;
  try {
    await command.execute({ client, interaction });
  } catch (error) {
    console.log(error);
    await interaction.editReply({ content: "Error running command" });
  }
});

client.login(process.env.TOKEN);
