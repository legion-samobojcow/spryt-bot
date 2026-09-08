import express from "express";
import {
  Client,
  GatewayIntentBits
} from "discord.js";

const app = express();

app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PORT = process.env.PORT || 10000;

const GAME_URL = "https://legion-samobojcow.github.io/spryt/";

// Strona testowa Rendera
app.get("/", (req, res) => {
  res.send("🃏 SPRYT bot działa!");
});

// Odbieranie wyniku gry
app.post("/score", async (req, res) => {
  const score = Number(req.body.score);
  const channelId = req.body.channelId;

  if (!Number.isInteger(score) || score < 0) {
    return res.status(400).json({
      error: "Nieprawidłowy wynik"
    });
  }

  if (!channelId) {
    return res.status(400).json({
      error: "Brak channelId"
    });
  }

  try {
    const channel = await client.channels.fetch(channelId);

    await channel.send(
      `🎯 **Wynik gry: ${score} punktów!**`
    );

    res.json({ ok: true });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Nie udało się wysłać wyniku"
    });
  }
});

// Komenda -spryt
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.trim().toLowerCase() === "-spryt") {
   const gameUrl = `${GAME_URL}?channel=${message.channel.id}`;

await message.channel.send(
  `🃏 **SPRYT — masz 15 sekund!**\n🎮 **Zagraj tutaj:** ${gameUrl}`
);
  }
});

client.once("ready", () => {
  console.log(`🃏 Zalogowano jako ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Serwer działa na porcie ${PORT}`);
});
