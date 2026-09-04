const DDRAGON_VERSION_URL =
  "https://ddragon.leagueoflegends.com/api/versions.json";

const DDRAGON_CHAMPION_URL = (version) =>
  `https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/champion.json`;

const DDRAGON_CHAMPION_ICON_URL = (version, championFile) =>
  `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championFile}.png`;

const RANK_ICON_URL = (tier) => `/assets/ranks/${tier.toLowerCase()}.png`;

const state = {
  ddragonVersion: null,
  champions: null,
};

function showError(message) {
  const element = document.getElementById("error");
  element.textContent = message;
  element.classList.remove("hidden");
}

function hideError() {
  document.getElementById("error").classList.add("hidden");
}

async function loadDataDragon() {
  const versionsResponse = await fetch(DDRAGON_VERSION_URL);
  const versions = await versionsResponse.json();

  state.ddragonVersion = versions[0];

  const championResponse = await fetch(
    DDRAGON_CHAMPION_URL(state.ddragonVersion),
  );

  const championData = await championResponse.json();

  state.champions = championData.data;
}

function getChampionFile(championName) {
  const champion = Object.values(state.champions ?? {}).find(
    (champion) => champion.name === championName,
  );

  return champion?.id ?? championName;
}

function renderRank(rank, player) {
  document.getElementById("player-name").textContent =
    `${player.gameName}#${player.tagLine}`;

  if (!rank) {
    document.getElementById("rank-tier").textContent = "UNRANKED";
    document.getElementById("rank-division").textContent = "";
    document.getElementById("rank-lp").textContent = "";
    document.getElementById("wins").textContent = "";
    document.getElementById("losses").textContent = "";
    document.getElementById("winrate").textContent = "";

    return;
  }

  document.getElementById("rank-tier").textContent = rank.tier;
  document.getElementById("rank-division").textContent = rank.division;
  document.getElementById("rank-lp").textContent = `${rank.lp} LP`;
  document.getElementById("wins").textContent = `${rank.wins} W`;
  document.getElementById("losses").textContent = `${rank.losses} L`;
  document.getElementById("winrate").textContent = `${rank.winRate}% WR`;

  const icon = document.getElementById("rank-icon");
  icon.src = RANK_ICON_URL(rank.tier);
  icon.alt = `${rank.tier} ${rank.division}`;
}

function renderMatches(matches) {
  const list = document.getElementById("match-list");
  list.innerHTML = "";

  for (const match of matches) {
    const row = document.createElement("div");
    row.className = "match";

    const resultBar = document.createElement("div");
    resultBar.className = `result-bar ${match.win ? "win" : "loss"}`;

    const championIcon = document.createElement("img");
    championIcon.className = "champion-icon";
    championIcon.alt = match.champion;
    championIcon.src = DDRAGON_CHAMPION_ICON_URL(
      state.ddragonVersion,
      getChampionFile(match.champion),
    );

    const championName = document.createElement("div");
    championName.className = "champion-name";
    championName.textContent = match.champion;

    const kda = document.createElement("div");
    kda.className = "kda";
    kda.textContent = `${match.kills} / ${match.deaths} / ${match.assists}`;

    const duration = document.createElement("div");
    duration.className = "duration";
    duration.textContent = match.duration;

    row.append(championIcon, resultBar);

    list.appendChild(row);
  }
}

async function updateOverlay() {
  try {
    hideError();

    if (!state.ddragonVersion || !state.champions) {
      await loadDataDragon();
    }

    const response = await fetch("/api/overlay", {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Erro ao carregar os dados.");
    }

    renderRank(data.rank, data.player);
    renderMatches(data.matches);
  } catch (error) {
    console.error(error);
    showError(error.message ?? "Erro desconhecido.");
  }
}

updateOverlay();
setInterval(updateOverlay, 60_000);
