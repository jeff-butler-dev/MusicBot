require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const { Player } = require("discord-player");

const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.login(process.env.TOKEN);

client.on(Events.ClientReady, () => {
  // creating main player instance
  client.player = new Player(client, {
    ytdlOptions: {
      quality: "highestaudio",
      highWaterMark: 1 << 25,
    },
  });

  client.player.extractors.loadDefault();

  // creating list of commands to distribute to servers
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
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  try {
    await command.execute({ client, interaction });
  } catch (error) {
    await interaction.editReply({ content: "Unable to play" });
  }
});
