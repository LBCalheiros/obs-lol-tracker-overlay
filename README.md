# LoL OBS Tracker Overlay - v3

Versão básica do overlay para OBS.

## Hospedagem

O backend da minha versão do projeto foi hospedado no **Render**.

O Render executa o servidor Node.js e disponibiliza o overlay através de uma URL pública, permitindo que ele seja usado como fonte de navegador no OBS sem precisar manter o servidor rodando localmente.

## Rodar localmente

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

- largura: 600
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
