const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "credits",
  args: false,
  disableable: false,
  execute: message => {
    const client = message.client;
    const credits = new MessageEmbed()
      .setTitle("Special thanks to the following people")
      .setColor("RANDOM")
      .setDescription("Co-Owner/Helper: Nick Chan\nSupporters: RandomPerson244, TSS\nand you ;)")
    /*
      .addField("Creator", "- MGPlayz YT")
      .addField("Collaborators", "- Nick Chan")
      .addField("Development", "- MGPlayz YT\n- Nick Chan")
      .addField("Supporters", "- RandomPerson4281")
      .setFooter("Thanks for your support!");
      */
    message.channel.send(credits);
  }
};
