const { MessageEmbed } = require("discord.js");
const { findMember } = require("../modules/botModule.js");

module.exports = {
    name: "avatar",
    description: "Returns the avatar/pfp of a server member.",
    usage: "<member>",
    execute: async (message, args) => {
        const client = message.client
        const x = client.emojis.cache.find(e => e.name === "Error");
        let user;
        if (args[0]) {
            user = await findMember(message, args.join(" ")).catch(error => {
                user = message.member;
            });
        } else user = message.member;
        const avatarEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(`${user.user.username}'s Avatar`, user.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setImage(user.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setTimestamp()
        message.channel.send(avatarEmbed);
    }
}