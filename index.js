import express from "express";
import { Client, GatewayIntentBits } from "discord.js";

const app = express();

app.use(express.json());

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const PORT = process.env.PORT || 10000;
const CHANNEL_ID = process.env.CHANNEL_ID;

const GAME_URL = "https://legion-samobojcow.github.io/spryt/";

app.get("/", (req, res) => {
  res.send("SPRYT bot działa!");
});

app.post("/score", async (req, res) => {
  const score = Number(req.body.score);

  if (!Number.isInteger(score) || score < 0) {
    return res.status(400).json({
      error: "Nieprawidłowy wynik"
    });
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

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

client.once("ready", () => {
  console.log(`Zalogowano jako ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
