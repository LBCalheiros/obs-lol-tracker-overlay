import "dotenv/config";

const API_KEY = process.env.RIOT_API_KEY;

const PLATFORM = process.env.RIOT_PLATFORM ?? "br1";
const REGION = process.env.RIOT_REGION ?? "americas";

const platformHost = `https://${PLATFORM}.api.riotgames.com`;
const regionalHost = `https://${REGION}.api.riotgames.com`;

interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

interface LeagueEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

interface MatchParticipant {
  puuid: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
}

interface MatchInfo {
  gameDuration: number;
  gameMode: string;
  gameType: string;
  queueId: number;
  participants: MatchParticipant[];
}

interface MatchData {
  metadata: {
    matchId: string;
  };

  info: MatchInfo;
}

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

export async function getAccountByRiotId(
  gameName: string,
  tagLine: string,
): Promise<RiotAccount> {
  return riotFetch<RiotAccount>(
    `${regionalHost}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
  );
}

export async function getLeagueByPuuid(puuid: string): Promise<LeagueEntry[]> {
  return riotFetch<LeagueEntry[]>(
    `${platformHost}/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`,
  );
}

export async function getMatchIds(puuid: string): Promise<string[]> {
  return riotFetch<string[]>(
    `${regionalHost}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=0&count=10`,
  );
}

export async function getMatch(matchId: string): Promise<MatchData> {
  return riotFetch<MatchData>(
    `${regionalHost}/lol/match/v5/matches/${encodeURIComponent(matchId)}`,
  );
}
