const { MessageEmbed } = require("discord.js");
const { toHHMMSS, msToHMS } = require("../modules/botModule.js");
module.exports = {
  name: "queue",
  description: "shows music queue.",
  aliases: ["q"],
  guildOnly: true,
  async execute(message) {
    const { queue } = message.client;
    const x = message.client.emojis.cache.find(e => e.name === "Error");
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue)
      return message.channel.send(`${x} **The queue is empty.**`);
    if (!message.member.voice.channel) return message.channel.send(`${x} **Connect to a voice channel and try again.**`);
    if (message.member.voice.channel !== serverQueue.voiceChannel)
      return message.channel.send(`${x} **You must be in the same voice channel as the bot is in.**`)
    const sliced = serverQueue.songs.slice(1);
    const currenttime = serverQueue.connection.dispatcher.streamTime;
    let formatted = sliced
      .map((song, index) => {
        const position = index + 1;
        const item = `${position}.) [${song.title}](${song.url}) | \`${toHHMMSS(
          song.duration
        )}\` | Requested by: ${song.requestBy}`;
        return item;
      })
      .join("\n");
    if (!formatted.length) formatted = "The queue is empty.";
    const embed = new MessageEmbed()
      .setAuthor(
        "Music Queue",
        "https://cdn.glitch.com/ae1bf1e9-34d2-43e8-af23-88db1cbe9616%2F06C28668-C28E-47B9-9AF0-7E73F1FCE1D2.jpeg?v=1580381492008"
      )
      .setDescription(
        `__**Now Playing:**__ [${serverQueue.songs[0].title}](${serverQueue.songs[0].url
        }) | \`${msToHMS(currenttime)} / ${toHHMMSS(
          serverQueue.songs[0].duration
        )}\` | Requested by: ${serverQueue.songs[0].requestBy}\n\n__**Queue / Up Next:**__\n${formatted}`
      )
      .setColor("#FF0000");
    message.channel.send(embed);
  }
}