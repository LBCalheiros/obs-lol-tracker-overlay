import "dotenv/config";

const key = process.env.RIOT_API_KEY;
const gameName = process.env.RIOT_GAME_NAME;
const tagLine = process.env.RIOT_TAG_LINE;
const platform = process.env.RIOT_PLATFORM ?? "br1";
const region = process.env.RIOT_REGION ?? "americas";

if (!key) {
  console.error("ERRO: RIOT_API_KEY não configurada.");
  process.exit(1);
}

if (!gameName || !tagLine) {
  console.error("ERRO: RIOT_GAME_NAME ou RIOT_TAG_LINE não configurado.");
  process.exit(1);
}

async function riotRequest(url) {
  console.log(`GET ${url}`);

  const response = await fetch(url, {
    headers: {
      "X-Riot-Token": key,
      Accept: "application/json",
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${response.status}: ${text}`);
  }

  return JSON.parse(text);
}

try {
  console.log("");
  console.log("================================");
  console.log(" TESTE DA RIOT API");
  console.log("================================");
  console.log("");

  console.log("1. ACCOUNT-V1");

  const account = await riotRequest(
    `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
  );

  console.log(`Nome: ${account.gameName}#${account.tagLine}`);
  console.log(`PUUID: ${account.puuid}`);
  console.log("");

  console.log("2. LEAGUE-V4");

  const league = await riotRequest(
    `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${encodeURIComponent(account.puuid)}`,
  );

  const solo = league.find((entry) => entry.queueType === "RANKED_SOLO_5x5");

  if (solo) {
    console.log(`Elo: ${solo.tier} ${solo.rank}`);
    console.log(`LP: ${solo.leaguePoints}`);
    console.log(`Vitórias: ${solo.wins}`);
    console.log(`Derrotas: ${solo.losses}`);
  } else {
    console.log("Nenhum registro de Solo/Duo encontrado.");
  }

  console.log("");

  console.log("3. MATCH-V5");

  const matchIds = await riotRequest(
    `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(account.puuid)}/ids?start=0&count=8`,
  );

  console.log(`Partidas encontradas: ${matchIds.length}`);

  console.log("");

  if (matchIds.length > 0) {
    console.log("4. DETALHES DA PRIMEIRA PARTIDA");

    const match = await riotRequest(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchIds[0])}`,
    );

    const player = match.info.participants.find(
      (participant) => participant.puuid === account.puuid,
    );

    if (player) {
      console.log(`Campeão: ${player.championName}`);
      console.log(`KDA: ${player.kills}/${player.deaths}/${player.assists}`);
      console.log(`Resultado: ${player.win ? "VITÓRIA" : "DERROTA"}`);
      console.log(
        `Duração: ${Math.floor(match.info.gameDuration / 60)}:${String(
          match.info.gameDuration % 60,
        ).padStart(2, "0")}`,
      );
    }
  }

  console.log("");
  console.log("================================");
  console.log(" API FUNCIONANDO CORRETAMENTE");
  console.log("================================");
  console.log("");
} catch (error) {
  console.error("");
  console.error("================================");
  console.error(" ERRO");
  console.error("================================");
  console.error("");

  console.error(error.message);

  process.exit(1);
}
