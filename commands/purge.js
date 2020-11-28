const { noPerms, noBotPerms } = require("../modules/botModule.js");

module.exports = {
  name: "purge",
  aliases: ["prune", "clear", "bulkdelete", "bulk-delete"],
  description:
    "Mass delete messages in a channel. Pinned messages will not be deleted.",
  args: 1,
  usage: "<integer>",
  disableable: true,
  info: "<integer> must be smaller than or equal to 1000.",
  execute: async (message, args) => {
    const client = message.client;
    const check = client.emojis.cache.find(emoji => emoji.name === "Check");
    const x = client.emojis.cache.find(emoji => emoji.name === "Error");
    const loading = client.emojis.cache.find(
      emoji => emoji.name === "loadingdiscord"
    );
    if (
      !message.channel.permissionsFor(message.member).serialize()
        .MANAGE_MESSAGES
    )
      return noPerms("Manage Messages", message.channel);
    if (
      !message.channel.permissionsFor(message.guild.me).serialize()
        .MANAGE_MESSAGES
    )
      return noBotPerms("Manage Messages", message.channel);
    const num = parseInt(args[0]);
    let rounded = Math.floor(num / 100) * 100;
    const diff = num - rounded;
    if (isNaN(num))
      return message.channel.send(`${x} **Arguments must be a number.**`);
    if (num > 1000 || num < 1)
      return message.channel.send(
        `${x} **Please use a value that's between 1 and 1000.**`
      );
    let deletedMsgs = [];
    let notPinneda = [];
    const notify = await message.channel.send(
      `${loading} Deleting Messages...`
    );
    const fetcheda = await message.channel.messages.fetch({
      limit: diff,
      before: message.id
    });
    fetcheda.forEach(m => {
      if (!m.pinned) notPinneda.push(m);
    });
    notify;
    const deleted = await message.channel.bulkDelete(notPinneda, {
      filterOld: true
    });
    await deleted.tap(m => deletedMsgs.push(m));
    while (rounded > 0) {
      let notPinned = [];
      const fetched = await message.channel.messages.fetch({
        limit: 100,
        before: message.id
      });
      fetched.forEach(m => {
        if (!m.pinned) notPinned.push(m);
      });
      const deleted = await message.channel.bulkDelete(notPinned, {
        filterOld: true
      });
      await deleted.tap(m => deletedMsgs.push(m));
      rounded -= 100;
    }
    if (!deletedMsgs.length)
      notify.edit(
        `${x} No messages found to delete.\nNote: Messages older than 2 weeks cannot be deleted.`
      );
    else if (deletedMsgs.length === 1) notify.edit(`${check} Deleted 1 message.`);
    else if (deletedMsgs.length > 1)
      notify.edit(`${check} Deleted ${deletedMsgs.length} messages.`);
  }
};
