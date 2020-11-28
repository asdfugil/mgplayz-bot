module.exports = {
  name: "volume",
  description: "Change the dispatcher volume.",
  cooldown: 6,
  execute: async (message, args) => {
    const x = message.client.emojis.cache.find(e => e.name === "Error");
    const check = message.client.emojis.cache.find(e => e.name === "Check");
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send(`${x} **Connect to a voice channel and try again.**`)
    if (!serverQueue) return message.channel.send(`${x} **There is no song playing.**`)
    if (!args[0] && serverQueue) return message.channel.send(`🔊 **Current volume is \`${serverQueue.volume}%\`.**`);
    const volume = parseFloat(args[0]);
    if (isNaN(volume)) return message.channel.send(`${x} **Please enter a valid value!**`);
    if (volume > 100 || volume < 1) return message.channel.send(`${x} **Please enter a value between 1 and 100.**`);
    serverQueue.volume = volume;
    serverQueue.connection.dispatcher.setVolume(volume / 100);
    return message.channel.send(`${check} **Volume is now set to \`${volume}%\`!**`);
  }
}