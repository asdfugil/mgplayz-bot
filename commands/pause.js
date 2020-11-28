module.exports = {
  name: "pause",
  description: "Pauses the music",
  aliases: ["stop"],
  guildOnly: true,
  disableable: false,
  async execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id)
    const x = message.client.emojis.cache.find(e => e.name === "Error");
    if (!message.member.voice.channel)
      return message.channel.send(
        `${x} **Connect to a voice channel and try again.**`
      );
    if (!serverQueue) return message.channel.send(`${x} **There is nothing playing in the voice channel.**`);
    if (message.member.voice.channel !== serverQueue.voiceChannel)
    return message.channel.send(`${x} **You must be in the same voice channel as the bot is in.**`)
    if (serverQueue.connection.paused) return message.channel.send(`${x} **Song already paused.**`);
    serverQueue.connection.dispatcher.pause(true)
    message.channel.send(":pause_button: **Paused.**")
  }
}