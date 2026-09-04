import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getAccountByRiotId,
  getLeagueByPuuid,
  getMatchIds,
  getMatch,
} from "./riot.js";

const app = express();

const PORT = Number(process.env.PORT ?? 3000);
const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS ?? 60) * 1000;

const GAME_NAME = process.env.RIOT_GAME_NAME;
const TAG_LINE = process.env.RIOT_TAG_LINE;

let cache: {
  expiresAt: number;
  data: unknown;
} | null = null;

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function queueName(queueId: number): string {
  const names: Record<number, string> = {
    420: "Solo/Duo",
    440: "Flex",
    400: "Normal",
    430: "Normal",
    450: "ARAM",
    490: "Swiftplay",
  };

  return names[queueId] ?? `Queue ${queueId}`;
}

async function buildOverlayData() {
  if (!GAME_NAME || !TAG_LINE) {
    throw new Error("RIOT_GAME_NAME ou RIOT_TAG_LINE não configurado.");
  }

  // 1. Encontrar a conta pelo Riot ID
  const account = await getAccountByRiotId(GAME_NAME, TAG_LINE);

  // 2. Buscar elo
  const league = await getLeagueByPuuid(account.puuid);

  const solo = league.find((entry) => entry.queueType === "RANKED_SOLO_5x5");

  // 3. Buscar IDs das últimas 10 partidas
  const matchIds = await getMatchIds(account.puuid);

  // 4. Buscar detalhes das partidas
  const matches = await Promise.all(
    matchIds.map(async (matchId) => {
      const match = await getMatch(matchId);

      const player = match.info.participants.find(
        (participant) => participant.puuid === account.puuid,
      );

      if (!player) {
        return null;
      }

      return {
        matchId,
        champion: player.championName,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        win: player.win,
        duration: formatDuration(match.info.gameDuration),
        queue: queueName(match.info.queueId),
      };
    }),
  );

  return {
    player: {
      gameName: account.gameName,
      tagLine: account.tagLine,
    },

    rank: solo
      ? {
          tier: solo.tier,
          division: solo.rank,
          lp: solo.leaguePoints,
          wins: solo.wins,
          losses: solo.losses,

          winRate: Math.round(
            (solo.wins / Math.max(1, solo.wins + solo.losses)) * 100,
          ),
        }
      : null,

    matches: matches.filter(Boolean),
  };
}

// API do overlay
app.get("/api/overlay", async (_req, res) => {
  try {
    // Usar cache enquanto estiver válido
    if (cache && Date.now() < cache.expiresAt) {
      return res.json(cache.data);
    }

    // Buscar dados novos
    const data = await buildOverlayData();

    // Salvar no cache
    cache = {
      expiresAt: Date.now() + CACHE_TTL,
      data,
    };

    return res.json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
});

// Localização da pasta public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "../public");

// Servir frontend
app.use(express.static(publicPath));

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Overlay rodando na porta ${PORT}`);
});
