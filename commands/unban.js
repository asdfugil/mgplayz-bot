const {
  noPerms,
  noBotPerms,
  findBannedUser
} = require("../modules/botModule.js");
module.exports = {
  name: "unban",
  cooldown: 3,
  guildOnly: true,
  args: true,
  description: "unbans a user",
  usage: "<user> [reason]",
  execute: async (message, args) => {
    const client = message.client;
    const check = client.emojis.cache.find(emoji => emoji.name === "Check");
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return noPerms("Ban Members", message.channel);
    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return noBotPerms("Ban Members", message.channel);
    let user = await findBannedUser(message, args[0]);
    if (!user) return message.reply("unknown user.");
    message.guild.unban(user,`${message.author.tag} - reason`)
    .then(u => message.reply(`${check} Successfully unbanned <@${user.id}>.`))
  }
};
