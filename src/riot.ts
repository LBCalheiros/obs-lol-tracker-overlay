import "dotenv/config";

const API_KEY = process.env.RIOT_API_KEY;
const PLATFORM = process.env.RIOT_PLATFORM ?? "br1";
const REGION = process.env.RIOT_REGION ?? "americas";

const platformHost = `https://${PLATFORM}.api.riotgames.com`;
const regionalHost = `https://${REGION}.api.riotgames.com`;

async function riotFetch<T>(url: string): Promise<T> {
  if (!API_KEY) {
    throw new Error("RIOT_API_KEY não configurada.");
  }

  const response = await fetch(url, {
    headers: {
      "X-Riot-Token": API_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(`Riot API ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

export async function getAccountByRiotId(gameName: string, tagLine: string) {
  return riotFetch(
    `${regionalHost}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
  );
}

export async function getLeagueByPuuid(puuid: string) {
  return riotFetch(
    `${platformHost}/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`,
  );
}

export async function getMatchIds(puuid: string) {
  return riotFetch<string[]>(
    `${regionalHost}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=0&count=10`,
  );
}

export async function getMatch(matchId: string) {
  return riotFetch(
    `${regionalHost}/lol/match/v5/matches/${encodeURIComponent(matchId)}`,
  );
}
