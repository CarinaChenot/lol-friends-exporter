# lol-friends-exporter

Export your League of Legends friends list to a CSV file.

> [!IMPORTANT]
> Supports only exports on Mac for now. Create an issue if you’d like Windows support added :)

## Prerequisites

- **Deno v2+** — Install from [deno.com](https://docs.deno.com/runtime/getting_started/installation/).

## Usage

1. Clone the repository
2. `cd lol-friends-exporter`
4. Run `deno task export` **while having the League of Legends client running**

The CSV will be saved to your Downloads folder as `lol-friends.csv`.

## Output

The CSV contains the following columns:

| Column | Description |
|---|---|
| `gameName` | In-game name (e.g. `Faker`) |
| `gameTag` | Tagline (e.g. `KR1`) |
| `name` | Full Riot ID combining both (e.g. `Faker#KR1`) |
| `puuid` | Unique player UUID |
| `summonerId` | Summoner ID |
| `note` | Friend note you've set, if any |

## Disclaimer

_This package is not endorsed by Riot Games and does not reflect the views or
opinions of Riot Games or anyone officially involved in producing or managing
Riot Games properties. Riot Games and all associated properties are trademarks
or registered trademarks of Riot Games, Inc_
