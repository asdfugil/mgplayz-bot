require("dotenv").config();
const Discord = require("discord.js");
const {
  noBotPerms,
  decodeEntities,
  toHHMMSS
} = require("../modules/botModule.js");
const ytdl = require("ytdl-core");
const { MessageEmbed } = Discord;
const ytsr = require("ytsr");
const ytpl = require("ytpl");
const COOKIE = "your-cookie-here"
module.exports = {
  name: "play",
  description:
    "Plays a song / playlist from YouTube. (Powered by [ytdl-core](https://github.com/fent/node-ytdl-core), [ytpl](https://github.com/TimeForANinja/node-ytpl), and [ytsr](https://github.com/TimeForANinja/node-ytsr))",
  guildOnly: true,
  aliases: ["p"],
  usage: "<song query / youtube video url / youtube playlist url>",
  args: true,
  cooldown: 5,
  disableable: false,
  execute: async (message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    const channel = message.member.voice.channel;
    const youtube = message.client.emojis.cache.find(
      emoji => emoji.name === "youtube"
    );
    const x = message.client.emojis.cache.find(emoji => emoji.name === "Error");
    if (!serverQueue) {
      if (!channel)
        return message.channel.send(
          `${x} **Connect to a voice channel and try again.**`
        );
    } else {
      if (channel !== serverQueue.voiceChannel)
        return message.channel.send(
          `${x} **You must be in the same voice channel as the bot is in.**`
        );
    }
    const { CONNECT, SPEAK } = channel
      .permissionsFor(message.guild.me)
      .serialize();
    if (!CONNECT || !SPEAK)
      return noBotPerms("Connect & Speak", message.channel);
    if (
      message.member.voice.deaf ||
      message.member.voice.selfDeaf ||
      message.member.voice.serverDeaf
    )
      return message.channel.send(
        `${x} **You can't run this command while defened.**`
      );
    // if the user provided a playlist as the argument
    if (args.join(" ").includes("=list")) {
      const url = args.join(" ");
      const playlist = await ytpl(url.split("list=")[1]);
      const vids = playlist.items;

      for (const songInfo of vids)
        await module.exports.queueSong(songInfo, message);
    }
    // if the user provided a youtube video link as the argument
    else if (ytdl.validateURL(args.join(" "))) {
      const songInfo = await ytdl.getBasicInfo(args.join(" "));
      return await module.exports.queueSong(songInfo, message);
    } else {
      // if the user provided a song name as the argument
      message.channel.send("**🔍 Searching for `" + args.join(" ") + "`...**");
      const result = (await ytsr(args.join(" "), { limit: 10 })).items.filter(
        a => a.type === "video"
      );
      const results = result;
      if (!results.length)
        return message.channel.send(
          `<:Error:665142091906809877> **No results found. Please try another keyword!**`
        );
      const arranged = results
        .map((songitem, index) => {
          const num = index + 1;
          const item = `${num}.) ${decodeEntities(songitem.title)}`;
          return item;
        })
        .join("\n");
      const msg =
        "```\nSelect an item in the list below - 15 seconds\n" +
        arranged +
        "\n```";
      var msg2 = await message.channel.send(msg);
      try {
        message.channel
          .createMessageCollector(x => x.author.id === message.author.id, {
            max: 1,
            time: 15000
          })
          .on("collect", async m => {
            var videoIndex = parseInt(m.content);
            if (m.content < 1 || m.content > 10)
              return message.channel.send(
                `<:Error:665142091906809877> **Please use a number between 1 and 10.**`
              );
            if (m.content.toLowerCase() === "cancel")
              return msg2
                .delete()
                .then(() =>
                  message.channel.send(
                    `<:Error:665142091906809877> **Cancelled command.**`
                  )
                );
            if (isNaN(videoIndex))
              return message.channel.send(
                `<:Error:665142091906809877> **Arguments must be a number.**`
              );
            const songInfo = await ytdl.getBasicInfo(
              results[videoIndex - 1].link.split("?v=")[1]
            );
            return await module.exports.queueSong(songInfo, message);
          });
      } catch (error) {
        console.error(error);
        message.channel.send(
          `${x} **Selection timed out. Please try again and type a number!**`
        );
      }
    }
  },
  queueSong: async (songInfo, message) => {
    const { queue } = message.client;
    const channel = message.member.voice.channel;
    const x = message.client.emojis.cache.find(f => f.name === "Error");
    const serverQueue = queue.get(message.guild.id);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      duration: songInfo.videoDetails.lengthSeconds,
      thumbnail: songInfo.videoDetails.thumbnail.thumbnails.pop().url, // fetch the highest thumbnail quality
      author: songInfo.videoDetails.ownerChannelName,
      voteSkips: [],
      live: songInfo.videoDetails.isLiveContent,
      requestBy: `<@!${message.member.user.id}>`
    };
    if (song.live === true)
      return message.channel.send(`${x} **Live videos cannot be played.**`);
    if (song.duration > 17999)
      return message.channel.send(
        `${x} **Cannot play songs that are 5 hrs long or more.**`
      );
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        songs: [song],
        volume: 50,
        playing: true,
        looping: false
      };

      try {
        const connection = await channel.join();
        queueContruct.connection = connection;
        queue.set(message.guild.id, queueContruct);
        module.exports.play(message, queueContruct.songs[0]);
      } catch (error) {
        console.log(error);
        queue.delete(message.guild.id);
        return message.channel.send(
          `${x} **An error occurred while trying to connect to the voice channel!**`
        );
      }
    } else {
      serverQueue.songs.push(song);
      const queueVideoEmbed = new MessageEmbed()
        .setThumbnail(song.thumbnail)
        .setColor("RANDOM")
        .setAuthor("Added to queue", message.author.displayAvatarURL())
        .setTitle(song.title)
        .setURL(song.url)
        .addField("Author", song.author)
        .addField("Duration", toHHMMSS(song.duration))
        .addField("Queue Position", serverQueue.songs.indexOf(song) + 1)
        .addField("Requested by", song.requestBy);
      return message.channel.send(queueVideoEmbed);
    }
  },
  play: async (message, song) => {
    const { queue } = message.client;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);
    const x = message.client.emojis.cache.find(emoji => emoji.name === "Error");

    if (!song) {
      queue.delete(guild.id);
      return;
    }

    let mainStream = await ytdl(song.url, {
      filter: "audio",
      requestOptions: { headers: { cookie: COOKIE }, maxRedirects: 4 },
      bitrate: "auto"
    });

    const dispatcher = await serverQueue.connection
      .play(mainStream, { bitrate: "auto" })
      .on("speaking", speaking => {
        if (!speaking) {
          if (serverQueue.looping !== "song") {
            if (serverQueue.looping === "queue")
              serverQueue.songs.push(serverQueue.songs[0]);
            serverQueue.songs.shift();
          }
          serverQueue.songs.shift();
          module.exports.play(message, serverQueue.songs[0]);
        }
      })
      .on("error", error => {
        console.error(error);
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return message.channel.send(
          `${x} **Oops, an error occured while trying to execute that operation.**`
        );
      });
    dispatcher.setVolume(serverQueue.volume / 100);
    const videoEmbed = new MessageEmbed()
      .setThumbnail(song.thumbnail)
      .setColor("RANDOM")
      .setAuthor("Now Playing", message.author.displayAvatarURL())
      .setTitle(song.title)
      .setURL(song.url)
      .addField("Author", song.author)
      .addField("Duration", toHHMMSS(song.duration))
      .addField("Requested by", song.requestBy);
    if (serverQueue.looping) return;
    message.channel.send(videoEmbed);
  }
};
