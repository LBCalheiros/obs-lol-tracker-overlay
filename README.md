# LoL OBS Tracker Overlay

Versão básica do overlay para OBS.

## Como obter uma Riot API Key

Para utilizar o projeto, é necessário possuir uma chave de API da Riot Games.

1. Acesse o portal oficial de desenvolvedores da Riot Games:
   https://developer.riotgames.com/

2. Faça login com sua conta Riot.

3. No painel, procure pela seção **Development API Key**.

4. Gere ou copie sua chave de desenvolvimento.

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
## Adicionar e remover informações

Para adicionar/remover KDA, tempo da partida, nome do campeão, etc.

Procure no arquivo `app.js` por `row.append(...` e adicione os dados desejados.

Alguns exemplos são:

- Imagem do campeão jogado: championIcon
- Nome do campeão jogado: championName
- Kill/Death/Assists: kda
- Barra com indicação de V/D: resultBar
- Tempo de duração da partida: duration

Outros dados podem ser encontrados na [Documentação oficial](https://developer.riotgames.com/apis/?utm_source=chatgpt.com#match-v5/GET_getMatchIdsByPUUID)
