# LoL OBS Tracker Overlay - v3

Versão básica do overlay para OBS.

## Rodar

```bash
npm install
npm run dev
```

Depois abra:

```text
http://localhost:3000
```

No OBS, adicione uma fonte **Navegador** usando:

```text
http://localhost:3000
```

Sugestão inicial:

- largura: 700
- altura: 650
- FPS: 30

O fundo da página é transparente.

## Dados exibidos

- Riot ID
- Elo atual
- Divisão
- LP
- Vitórias
- Derrotas
- Winrate
- Últimas 10 partidas
- Ícone do campeão
- KDA
- Duração
- Vitória/derrota

## Configuração

O arquivo `.env` deve continuar na raiz do projeto e conter a sua Personal API Key.

```env
RIOT_API_KEY=SUA_CHAVE
RIOT_GAME_NAME=SEU_NOME
RIOT_TAG_LINE=BR1
RIOT_PLATFORM=br1
RIOT_REGION=americas
PORT=3000
CACHE_TTL_SECONDS=60
```
