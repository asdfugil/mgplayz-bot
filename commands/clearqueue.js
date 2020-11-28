const { noPerms } = require("../modules/botModule.js");

module.exports = {
  name: "clearqueue",
  description: "Clears the queue but doesn't stop the currently playing music.",
  cooldown: 3,
  aliases: ["clearq"],
  execute: async (message, args) => {
    const { queue } = message.client;
    const x = message.client.emojis.cache.find(e => e.name === "Error");
    const check = message.client.emojis.cache.find(e => e.name === "Check");
    const serverQueue = queue.get(message.guild.id);
    const { MANAGE_CHANNELS } = message.channel
      .permissionsFor(message.member)
      .serialize();
    if (!message.member.voice.channel)
      message.channel.send(
        `${x} **Connect to a voice channel and try again.**`
      );
    if (!serverQueue) message.channel.send(`${x} **There is no song playing.`);
    if (!MANAGE_CHANNELS) return noPerms("Manage Channel", message.channel)
    else {
     serverQueue.songs.splice(1, serverQueue.songs.length);
     message.channel.send(`${check} **Queue successfully cleared!**`)
    }
  }
};
