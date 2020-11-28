const {
  noPerms,
  noBotPerms,
  findMember
} = require("../modules/botModule.js");
module.exports = {
  name: "kick",
  description: "Kicks a memeber form the server.",
  args: true,
  disableable: false,
  guildOnly: true,
  usage: "<member> [reason]",
  execute: async (message, args) => {
    const client = message.client;
    if (!message.member.hasPermission("KICK_MEMBERS"))
      return noPerms("Kick Members",message.channel)
    if (!message.guild.me.hasPermission("KICK_MEMBERS"))
      return noBotPerms("Kick Members",message.channel);
      findMember(message, args[0]).catch(error => {
        message.reply('Unknown member')
      })
    .then(member => {
      if ((member.highestRole.position - message.member.highestRole.position) >= 0)
        return message.reply(
          "You can't kick a user that has a higher or equal role than you!"
        );
      if (member.user.id === message.client.user.id)
        return message.channel.send(`Bruh if you wan't to kick me you can just Right Click on me and click "Kick ` + client.user.username + `"`);
      if (member.id === message.member.id)
        return message.channel.send(
          "Bruh why would you even kick yourself? Don't you have a brain?"
        );
      if (member.id === message.guild.owner.id)
        return message.channel.send("You can't kick the server owner!");
      if (
        (member.highestRole.position - message.guild.me.highestRole.position) >= 0
      )
        return message.channel.send(
          "I can't kick this user because they have a higher or same role as the bot."
        );
      if (args.slice(1).join(" ") > 512)
        return message.reply(
          "Reason too long. Must be less than 512 characters!"
        );
      if (!member.kickable) return message.channel.send("The member is unkickable. Check that I have permissions to kick that user.");
      member
        .kick(`${message.author.tag} - ${args.slice(1).join(" ") || 'No reason given'}`)
        .then(() => {
        message.channel.send(`${member.user.tag} was kicked from the server.\nReason: ${args.slice(1).join(' ') || 'No reason given'}`)
    })
      })
  }
};
