module.exports = {
  name: "loop",
  usage: "<song|queue|disabled>",
  description: "Sets the music loop mode.\nAvailable options:\n `song`\n- Loops the currently playing song.\n\n`queue`\n- Loops the entire queue.\n\n`disabled / none`\n- Disables looping.",
  guildOnly: true,
  disableable: false,
  async execute(message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    const x = message.client.emojis.cache.find(e => e.name === "Error");
    if (!serverQueue) return message.channel.send(`${x} **There is nothing to loop.**`);
    if (!message.member.voice.channel)
      return message.channel.send(
        `${x} **Connect to a voice channel and try again.**`
      );
    if (message.member.voice.channel !== serverQueue.voiceChannel)
      return message.channel.send(`${x} **You must be in the same voice channel as the bot is in.**`)
    if (!args[0]) {
      if (serverQueue.looping === false) serverQueue.looping = "song";
      else serverQueue.looping = false;
    }
    else if (args[0] === "song") serverQueue.looping = "song";
    else if (args[0] === "all" || args[0] === "queue") serverQueue.looping = "queue";
    else if (args[0] === "disabled" || args[0] === "none") serverQueue.looping = false;
    else return message.channel.send(`${x} **That's not a valid option!**`);
    message.channel.send(":repeat_one: **Looping set to `" + serverQueue.looping + "`!**")
  }
}