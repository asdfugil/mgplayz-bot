const {
  noPerms,
  noBotPerms,
  findMember,
  findUser
} = require("../modules/botModule.js")
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "ban",
  args: true,
  cooldown: 3,
  description: "Bans a user/member from the server.",
  guildOnly: true,
  disableable: false,
  usage: "<user> <reason>",
  execute: async (message, args) => {
    const client = message.client;
    const banhammer = client.emojis.cache.find(emoji => emoji.name === "ban2");
    const check = client.emojis.cache.find(emoji => emoji.name === "Check");
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return noPerms("Ban Members", message.channel);
    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return noBotPerms("Ban Members", message.channel);
    const member = await findMember(message, args[0])
      .then(member => {
        if (
          member.roles.highest.position - message.member.roles.highest.position >=
          0
        )
          return message.channel.send(
            "You can't ban a user that has a higher or equal role than you!"
          );
        if (member.user.id === message.client.user.id)
          return message.channel.send(`Bruh if you wan't to ban me you can just Right Click on me and click "Ban ` + client.user.username + `"`);
        if (member.id === message.member.id)
          return message.channel.send(
            "Bruh why would you even ban yourself? Don't you have a brain?"
          );
        if (member.id === message.guild.owner.id)
          return message.channel.send("You can't ban the server owner!");
        if (
          member.roles.highest.position - message.guild.me.roles.highest.position >=
          0
        )
          return message.channel.send(
            "I can't ban this user because they have a higher or same role as the bot."
          );
        if (!member.bannable) return message.reply("The member is unbannable. Check that I have permissions to ban that user.");
        let days = parseInt(args[1], 10);
        if (days > 7) days = 0;
        let reason;
        if (days.toString() !== args[1]) {
          reason = args.slice(1).join(" ");
          days = 0;
        } else {
          reason = args.slice(2).join(" ");
        }
        if (!reason) reason = "No reason given";
        if (reason.join(" ") > 472)
          return message.reply(
            "Reason too long. Must be less than 472 characters!"
          );
        let msg;
        member.ban({
            days: days,
            reason: `${message.author.tag} - ${reason}`
          })
        .then(m => {
          if (days) {
              if (!reason) msg = `${check} <@${m.user.id}> (${m.user.tag}) was **banned** for ${days} days.`
              if (reason) msg = `${check} <@${m.user.id}> (${m.user.tag}) was **banned** for ${days} days.\nReason: **${reason}**.`
            }
            if (!days) {
              if (!reason) msg = `${check} <@${m.user.id}> (${m.user.tag}) was **banned**.`
              if (reason) msg = `${check} <@${m.user.id}> (${m.user.tag}) was **banned**.\nReason: **${reason}**`
            }
            const banned1 = new MessageEmbed()
            .setAuthor(client.user.tag, client.user.avatarURL)
            .setColor("RANDOM")
            .setDescription(msg)
            .setFooter(`Moderator: ${message.author.username}`);
            message.channel.send(banned1)
        })
      })
      .catch(async error => {
        const user = await findUser(message, args[0]).catch(error =>
          message.reply("Unknown user.")
        );
        let days = parseInt(args[1], 10);
        if (days > 7) days = 0;
        if (days < 0) days = 0;
        let msg = undefined;
        let reason;
        if (days.toString() !== args[1]) {
          reason = args.slice(1).join(" ");
          days = 0;
        } else {
          reason = args.slice(2).join(" ");
        }
        if (!reason) reason = "No reason provided."
        if (reason.length > 472)
          return message.reply(
            "Reason too long. Must be less than 472 characters!"
          )
        message.guild
          .ban(user.id, {
            days: days,
            reason: `${message.author.tag} - ${reason}`
          })
          .then(u => {
            if (days) {
              if (!reason) msg = `${check} <@${u.id}> (${u.tag}) was **banned** for ${days} days.`
              if (reason) msg = `${check} <@${u.id}> (${u.tag}) was **banned** for ${days} days.\nReason: **${reason}**.`
            }
            if (!days) {
              if (!reason) msg = `${check} <@${u.id}> (${u.tag}) was **banned**.`
              if (reason) msg = `${check} <@${u.id}> (${u.tag}) was **banned**.\nReason: **${reason}**`
            }
            const banned1 = new MessageEmbed()
            .setAuthor(client.user.tag, client.user.avatarURL)
            .setColor("RANDOM")
            .setDescription(msg)
            .setFooter(`Moderator: ${message.author.username}`);
            message.channel.send(banned1)
        });
      });
  }
};