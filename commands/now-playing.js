const { MessageEmbed } = require("discord.js");
const { toHHMMSS } = require("../modules/botModule.js");
const { msToHMS } = require("../modules/botModule.js");

module.exports = {
  name: "now-playing",
  aliases: ["np"],
  guildOnly: true,
  description: "Shows the currently playing song in the voice channel.",
  async execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    const x = message.client.emojis.cache.find(emoji => emoji.name === "Error");
    if (!serverQueue)
      return message.channel.send(`${x} **There is no song playing.**`);
    const currenttime = serverQueue.connection.dispatcher.streamTime;
    if (message.member.voice.channel !== serverQueue.voiceChannel)
      return message.channel.send(`${x} **You must be in the same voice channel as the bot is in.**`)
    const nowplaying = new MessageEmbed()
      .setThumbnail(serverQueue.songs[0].thumbnail)
      .setColor("RANDOM")
      .setAuthor("Now Playing", message.author.displayAvatarURL());
    if (!serverQueue.connection.dispatcher.paused)
      nowplaying.setDescription(
        `:arrow_forward:  **${msToHMS(currenttime)} / ${toHHMMSS(
          serverQueue.songs[0].duration
        )}**`
      );
    else
      nowplaying.setDescription(
        `:pause_button:  **${msToHMS(currenttime)} / ${toHHMMSS(
          serverQueue.songs[0].duration
        )}**`
      );
    nowplaying.setTitle(serverQueue.songs[0].title);
    nowplaying.setURL(serverQueue.songs[0].url);
    nowplaying.addField("Author", serverQueue.songs[0].author);
    nowplaying.addField("Requested by", serverQueue.songs[0].requestBy)
    return message.channel.send(nowplaying);
  }
};
