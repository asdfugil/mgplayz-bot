const { Collection } = require("discord.js");
const Keyv = require("keyv");
const serialize = require("serialize-javascript");
const { deserialize } = require("../modules/botModule.js");
const ranks = new Keyv("sqlite://.data/database.sqlite", {
  namespace: "ranks",
  serialize: serialize,
  deserialize: deserialize
});
module.exports = client => {
  /*
  run when the client has become ready
  check for deleted guilds etc.
  */
  client.guilds.cache.forEach(guild => {
    if (!ranks.get(guild.id)) ranks.set(guild.id, Object.create(null));
  });
};
