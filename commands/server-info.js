const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "server-info",
  description: "Return Server Information",
  aliases: ["serverinfo","guildinfo"],
  cooldown: 5,
  args: false,
  disableable: true,
  execute: (message, args)  => {
  const client = message.client;
  const online = client.emojis.cache.find(emoji => emoji.name === "online");
  const idle = client.emojis.cache.find(emoji => emoji.name === "idle");
  const dnd = client.emojis.cache.find(emoji => emoji.name === "dnd");
  const offline = client.emojis.cache.find(emoji => emoji.name === "offline");
  const serverInfo = new MessageEmbed()
  .setTimestamp()
  .setColor("RANDOM")
  const g = message.guild;
  const roles = []
  let j = 0
  g.roles.forEach(r => {
  if (j < 40) roles.push(r.toString())
  j++
  });
  const bots = g.members.filter(x => x.user.bot).size;
  const human = g.members.filter(x => !x.user.bot).size;
  if (g.region === "us-west") g.region = ":flag_us: US West";
  if (g.region === "us-east") g.region = ":flag_us: US East";
  if (g.region === "us-central") g.region = ":flag_us: US Central";
  if (g.region === "us-south") g.region = ":flag_us: US South";
  if (g.region === "singapore") g.region = ":flag_sg: Singapore";
    serverInfo.setTitle("Server Information", true)
    serverInfo.setThumbnail(g.iconURL)
    serverInfo.addField("Name", g.name, true)
    serverInfo.addField("Created At", g.createdAt.toLocaleString("en-US", {
        timeZone: "America/New_York"
        }), true)
    serverInfo.addField("Owner", g.owner.user, true)
    serverInfo.addField("Region", g.region, true);
    serverInfo.addField("Channels", `Text: ${g.channels.filter(x => x.type === 'text').size}\nVoice: ${g.channels.filter(x => x.type === 'voice').size}\nCategories: ${g.channels.filter(x => x.type === 'category').size}`, true)
    serverInfo.addField("Members", `Total: ${g.members.size}\nBots: ${bots}\nHumans: ${human}\n${online} ${g.members.filter(x => x.user.presence.status == 'online').size}  ${idle} ${g.members.filter(x => x.user.presence.status == 'idle').size}  ${dnd} ${g.members.filter(x => x.user.presence.status == 'dnd').size}  ${offline} ${g.members.filter(x => x.user.presence.status == 'offline').size}`, true)
    serverInfo.addField("Roles", `${g.roles.size}`, true);
    serverInfo.addField("Emojis", `${g.emojis.cache.size} (${g.emojis.cache.filter(e => e.animated).size} animated)`, true)
    serverInfo.addField("Bot Joined", g.me.joinedAt.toLocaleString("en-US", {
      timeZone: "America/New_York"
    }), true)
    
    message.channel.send(serverInfo)

  }
}