"use strict";

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("Logged is as: ", client.user.tag);
});

const token =
  "MTMyMDA4OTg5OTM2MTExMjE2Ng.GS1urW.t1V93yiImd5dgKx7Q9lvWz-dQ36yrxrhLM7zsc";
client.login(token);
