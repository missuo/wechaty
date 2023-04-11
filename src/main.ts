/*
 * @Author: Vincent Young
 * @Date: 2023-04-11 12:33:05
 * @LastEditors: Vincent Young
 * @LastEditTime: 2023-04-11 12:54:20
 * @FilePath: /wechat-chatgpt/src/main.ts
 * @Telegram: https://t.me/missuo
 * 
 * Copyright © 2023 by Vincent, All Rights Reserved. 
 */
import { WechatyBuilder } from "wechaty";
import QRCode from "qrcode";

const bot = WechatyBuilder.build({
  name: "wechat-assistant", // generate xxxx.memory-card.json and save login data for the next login
  puppet: "wechaty-puppet-wechat",
  puppetOptions: {
    uos: true
  }
});
async function main() {
  const initializedAt = Date.now()
  bot
    .on("scan", async (qrcode, status) => {
      const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
      console.log(`Scan QR Code to login: ${status}\n${url}`);
      console.log(
        await QRCode.toString(qrcode, { type: "terminal", small: true })
      );
    })
    .on("login", async (user) => {
      console.log(`User ${user} logged in`);
    })
    .on("message", async (message) => {
      if (message.date().getTime() < initializedAt) {
        return;
      } else {
        const room = message.room();
        if (room) {
          const topic = await room.topic();
          console.log(`Room: ${topic} Sender: ${message.talker()} Text: ${message.text()}`);
        }
        if (message.text().startsWith("Guido")) {
          await message.say("真帅");
          return;
        }
        if (message.text().startsWith("@周辉")) {
          await message.say("天天艾特周老板干嘛呢");
          return;
        }
      }
    });
  try {
    await bot.start();
  } catch (e) {
    console.error(
      `⚠️ Bot start failed, can you log in through wechat on the web?: ${e}`
    );
  }
}
main();
