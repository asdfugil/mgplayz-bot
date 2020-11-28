const mutedRoles = new (require("keyv"))("sqlite://.data/database.sqlite", {
  namespace: "muted-roles"
});
const mutedMembers = new (require("keyv"))("sqlite://.data/database.sqlite", {
  namespace: "muted-members"
});
const moment = require("moment");
require("moment-duration-format");
const {
  noPerms,
  noBotPerms,
  findMember
} = require("../modules/botModule.js");
const { MessageEmbed, GuildMember } = require("discord.js");
const parse = require("parse-duration");
module.exports = {
  name: "mute",
  guildOnly: true,
  description: "mute a member",
  usage: "<member> [duration] [reason]",
  cooldown: 2,
  args: 1,
  execute: async (message, args) => {
    const client = message.client, check = client.emojis.cache.find(emoji => emoji.name === "Check"), x = client.emojis.cache.find(emoji => emoji.name === "Error");
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return noPerms("Manage Messages", message.channel);
    if (!message.guild.me.hasPermission("MANAGE_ROLES"))
      return noBotPerms("Manage Roles", message.channel);
    const muted = await mutedRoles.get(message.guild.id);
    if (!muted)
      return message.channel.send(
        `${x} **The muted role is not set.**`
      );
    const mutedRole = message.guild.roles.get(muted);
    if (!mutedRole)
      return message.channel.send(
        `${x} **The muted role configuration is corrupted.**`
      );
    // if ((mutedRole.position - message.guild.me.highestRole.position) > 0) return noBotPermission("A role higher than the muted role")
    const member = await findMember(message, args[0])
      .catch(error => message.channel.send(`${x} **Unknown member.**`))
      .then(async member => {
        if (!member.addRole) return;
        console.log(member.id);
        let data = await mutedMembers.get(message.guild.id);
        if (!data) data = {};
        let duration = parse(args[1]);
        if (!duration) {
          member.addRole(mutedRole.id, args.slice(1).join(" "));
          duration = 1.729e308;
        } else member.addRole(mutedRole.id, args.slice(2).join(" "));
        data[member.id] = Date.now() + duration;
        mutedMembers.set(message.guild.id, data);
        const read = moment
          .duration(duration)
          .format(
            "Y [year], M [month], W [week], D [day], m [minute], s [second]", { trim: "both" });
        if (duration === 1.729e308 || !duration) message.channel.send(`${check} **${member.user.username}** is now muted.`);
        else message.channel.send(`${check} **${member.user.username}** is now muted for `+ "`" + read + "`.");
      });
  }
};