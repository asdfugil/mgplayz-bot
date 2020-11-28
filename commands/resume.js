module.exports = {
  name: "resume",
  description: "resumes the music",
  guildOnly: true,
  async execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id)
    const x = message.client.emojis.cache.find(e => e.name === "Error");
    if (!message.member.voice.channel) return message.channel.send(`${x} **Connect to a voice channel and try again.**`);
    if (!serverQueue) return message.channel.send(`${x} **There is nothing playing in the voice channel.**`);
    if (message.member.voice.channel !== serverQueue.voiceChannel)
      return message.channel.send(`${x} **You must be in the same voice channel as the bot is in.**`)
    if (!serverQueue.connection.dispatcher.paused) return message.channel.send(`${x} **Song is not paused.**`);
    serverQueue.connection.dispatcher.resume()
    message.channel.send(":play_pause: **Resumed.**")
  }
}