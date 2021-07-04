const Discord = require("discord.js");
const client = new Discord.Client();
const ffmpeg = require("ffmpeg");

const config = require("./config.json");
require("dotenv").config;
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", async (message) => {
  if (message.content === "jrec") {
    const channel = message.member.voice.channel;
    if (!channel)
      return message.channel.send("Please join a voice channel to record");

    const connection = await channel.join();
    const reciever = connection.receiver.createStream(message.member, {
      mode: "pcm",
      end: "manual",
    });
    try {
      const process = new ffmpeg("./pcm/audio.pcm");
      process.then(function (audio) {
        audio.fnExtractSoundToMP3("./vc/audio.mp3", function (error, file) {
          if (!error) console.log("Audio File:" + file);
        }),
          function (err) {
            console.log(`Error: ${err}`);
            message.channel.send(` Error: \`🔴 ${err} 🔴\``);
          };
      });
    } catch (e) {
      console.log(e);
      message.channel.send(`Error catched \`🔴 ${e} 🔴\``);
    }
  }
});
client.login(config.TOKEN);