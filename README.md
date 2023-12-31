# Basic Discord Music Bot

Simple tool created for friends.

Bot is currently hosted on free site that will turn off without constant interaction. Navigate to <https://pleaseworkbot.onrender.com/> on your browser and the bot will spin up shortly after.

## Release/Testing Server

The following server is used for testing and notifying of new releases. If you are a user of the bot, there is also a specific channel for feature requests or bug reporting.

Channel '#release-notif' is setup with a webhook to any releases that occur in <https://github.com/jeff-butler-dev/MusicBot>

<https://discord.gg/2QufSXSjgQ>

## Local Installation

Install the dependencies and devDependencies and start the server. Requires NodeJS prior to running the following

```sh
npm i
npm start
```

## Commands

| COMMAND        | DESC                                          |
| -------------- | --------------------------------------------- |
| /play          | base search method                            |
| /play search   | broad search of content using keyword         |
| /play playlist | queues up an entire Youtube playlist          |
| /play song     | plays a Youtube URL                           |
| /playnow song  | replaces current song and plays a Youtube URL |
| /pause         | pauses feed, used for both pause and resume   |
| /skip          | skips currently playing song                  |
| /exit          | kills player instance and everything in queue |

## Future work(subject to change based off feature requests discord server)

- Port all code to TS
- Improved error handling
- Helper function modules to re-use less code in every command file
- Testing all commands using JEST
