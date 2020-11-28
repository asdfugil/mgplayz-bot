module.exports = {
  name: "skip",
  description: "Skip a song!",
  aliases: ["s"],
  cooldown: 4,
  guildOnly: true,
  async execute(message) {
    const { queue } = message.client;
    const x = message.client.emojis.cache.find(emoji => emoji.name === "Error");
    const check = message.client.emojis.cache.find(e => e.name === "Check");
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue)
      return message.channel.send(`${x} **There is no song playing.**`);
    if (!message.member.voice.channel)
      return message.channel.send(
        `${x} **Connect to a voice channel and try again.**`
      );
    if (message.member.voice.channel !== serverQueue.voiceChannel)
      return message.channel.send(`${x} **You must be in the same voice channel as the bot is in.**`)
    if (
      message.member.voice.deaf ||
      message.member.voice.selfDeaf ||
      message.member.voice.serverDeaf
    )
      return message.channel.send(
        `${x} **You can't run this command while defened.**`
      );
    const { ADMINISTRATOR, MANAGE_CHANNELS } = message.channel
      .permissionsFor(message.member)
      .serialize();
    const userCount = message.member.voice.channel.members.filter(
      m => !m.user.bot
    ).size;
    if (userCount > 1 && !MANAGE_CHANNELS) {
      const required = Math.ceil(userCount / 2);
      if (!serverQueue.songs[0].voteSkips)
        serverQueue.songs[0].voteSkips = [];
      if (serverQueue.songs[0].voteSkips.includes(message.member.id))
        return message.channel.send("${x} **You already voted to skip!**");
      serverQueue.songs[0].voteSkips.push(message.member.id);
      queue.set(message.guild.id, serverQueue);
      if (serverQueue.songs[0].voteSkips.length >= required) {
        message.channel.send(":fast_forward: **Skipped.**");
        serverQueue.looping = false;

        return serverQueue.connection.dispatcher.end();
      }
      let reqvote;
      if (serverQueue.songs[0].voteSkips.length === 1)
        reqvote = `\`${required}\` vote left.`;
      else reqvote = `\`${required}\` votes left.`;
      message.channel.send(
        `${check} **You voted to skip the song. (${reqvote})**`
      );
    } else {
      serverQueue.looping = false;
      serverQueue.connection.dispatcher.end();
      message.channel.send(":fast_forward: **Skipped.**");
    }
  }
};
