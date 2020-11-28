const Keyv = require('keyv') 
const { Message } = require('discord.js')
const {
  noPerms,
  noBotPerms,
  findMember
} = require("../modules/botModule.js");
const { MessageEmbed, GuildMember } = require("discord.js");
/**
 * @type { Keyv<string> } 
 */
const mutedRoles = new Keyv('sqlite://.data/database.sqlite',{namespace:'muted-roles'})
/**
 * @type { Keyv<string> } 
 */
const mutedMembers = new Keyv('sqlite://.data/database.sqlite',{namespace:'muted-members'})
module.exports = {
    name:'unmute',
    description:'unmute a member',
    usage:'<member> [reason]',
    args:1,
    guildOnly:true,
    /**
     * @param { Message } message
     * @param { Array<string> } args
     */
    async execute (message,args) {
        const client = message.client, check = client.emojis.cache.find(emoji => emoji.name === "Check"), x = client.emojis.cache.find(emoji => emoji.name === "Error");
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return noPerms('Manage Messages',message.channel)
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return noBotPerms("Manage Roles",message.channel)
        const role = message.guild.roles.get(await mutedRoles.get(message.guild.id))
        if (!role) return message.reply("Muted role is not set.")
        const member = await findMember(message,args[0]).catch(error => message.reply("That's not a valid member!"))
        if (!member.removeRole) return
        if (!member.roles.has(role.id)) return message.reply("That member is not muted.")
        const data = await mutedMembers.get(message.guild.id) || Object.create(null)
        delete data[member.id]
        mutedMembers.set(message.guild.id,data)
        await member.removeRole(role,args.slice(1).join(' '))
        message.channel.send(check + " **" + member.user.username + "** is now unmuted.")
    }
}