const { noPerms } = require("../modules/botModule.js");

module.exports = {
  name: "disconnect",
  description: "Leaves the bot in the current voice channel.",
  aliases: ["leave"],
  args: false,
  disableable: false,
  guildOnly: true,
  execute: (message) => {
    const { queue } = message.client;
    const serverQueue = queue.get(message.guild.id);
    const channel = message.channel
    const x = message.client.emojis.cache.find(e => e.name === "Error");
    const { MANAGE_CHANNELS } = channel
      .permissionsFor(message.member)
      .serialize();
    if (!message.member.voice.channel)
      return message.channel.send(
        `${x} **Connect to a voice channel and try again.**`
      );
    if (!message.guild.me.voice.channel) return message.channel.send(`${x} **I'm not in a voice channel.**`);
    const userCount = message.member.voice.channel.members.filter(m => !m.user.bot).size
    if (userCount > 1 && !MANAGE_CHANNELS) noPerms("Manage Channels (can be bypassed if you're alone with the bot)", message.channel);
    else {
      if (serverQueue) {
        serverQueue.songs = [];
        serverQueue.looping = false;
        if (serverQueue.connection.dispatcher) {
          serverQueue.connection.dispatcher.resume();
          serverQueue.connection.dispatcher.end();
        }
        queue.delete(message.guild.id);
      }
      message.guild.me.voice.channel.leave();
      return message.channel.send(":mailbox_with_no_mail: **Disconnected.**");
    }
  }
}