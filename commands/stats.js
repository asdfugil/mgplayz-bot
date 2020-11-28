const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const { MessageEmbed } = Discord;

module.exports = {
  name: "stats",
  description: "Shows bot statistics",
  aliases: ["bot-stats"],
  execute: async (message) => {
    const client = message.client;
    const duration = moment
    .duration(client.uptime)
    .format("D [day], H [hr], m [mins], s [sec]", { trim: "both" });
    const processDuration = moment
      .duration(process.uptime(), "seconds")
      .format("D [day], H [hr], m [min], s [sec]", { trim: "both" });
  const servers = await client.shard.broadcastEval("this.guilds.cache.size");
  const rssUsage = await client.shard.broadcastEval(
    "process.memoryUsage().rss/1024/1024"
  );
  const heapUsage = await client.shard.broadcastEval(
    "process.memoryUsage().heapUsed/1024/1024"
  );
  const nodeCPUUsage = await client.shard.broadcastEval(
    "process.cpuUsage().user"
  );
  const sysCPUUsage = await client.shard.broadcastEval(
    "process.cpuUsage().system"
  );
  const embed = new MessageEmbed()
    .setColor("#fce803")
    .setAuthor(
      "Bot Statistics",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQH90Wt8Lt4gYiifTtMd7Aynl7HvFHEtLX9TS_LHyi4l7VfNJa5"
    )
    .addField(
      `Memory Usage`,
      `${rssUsage
        .reduce((previous, count) => previous + count, 0)
        .toFixed(2)} MB RSS\n${heapUsage
        .reduce((previous, count) => previous + count, 0)
        .toFixed(2)} MB Heap`,
      true
    )
    .addField(
      `CPU Usage`,
      `NodeJS: ${(process.cpuUsage().user / 1024 / 1024).toFixed(
        2
      )}%\nSystem: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%`,
      true
    )
    .addField(`Uptime`, `Client: ${duration}\nSystem: ${processDuration}`, true)
    .addField(
      `Guilds`,
      `${servers.reduce((previous, count) => previous + count, 0)}`,
      true
    )
    .addField(`Server Shard ID`, `${message.guild.shard.id}`, true)
    .addField(`discord.js version`, `v${Discord.version}`, true)
    .addField(`NodeJS version`, `${process.version}`, true)
    .setTimestamp()
  message.channel.send(embed);
  }
}