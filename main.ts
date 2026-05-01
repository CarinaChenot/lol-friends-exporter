import { stringify } from "@std/csv/stringify";
import { encodeBase64 } from "@std/encoding";

const LOCKFILE_PATH =
  "/Applications/League of Legends.app/Contents/LoL/lockfile";
const CERTIFICATE_DOWNLOAD_URL =
  "https://static.developer.riotgames.com/docs/lol/riotgames.pem";

// Get the port and password from the lockfile
const lockfile = await Deno.readTextFile(LOCKFILE_PATH);
const [_, __, port, password, protocol] = lockfile.split(":");

// Get the latest certificate
const certResponse = await fetch(CERTIFICATE_DOWNLOAD_URL);
const certificateContents = await certResponse.text();

// Client to make authenticated requests to the LCU
const baseURL = `${protocol.trim()}://127.0.0.1:${port}`;
const authHeader = `Basic ${encodeBase64(`riot:${password}`)}`;

const client = async (path: string) => {
  const caCerts = [certificateContents];
  return await fetch(`${baseURL}${path}`, {
    headers: { Authorization: authHeader },
    client: Deno.createHttpClient({ caCerts }),
  });
};

const response = await client("/lol-chat/v1/friends");
const data = await response.json();

const rows = data.map((friend: Record<string, string>) => ({
  gameName: friend.gameName,
  gameTag: friend.gameTag,
  name: `${friend.gameName}#${friend.gameTag}`,
  puuid: friend.puuid,
  summonerId: friend.summonerId,
  note: friend.note,
}));

const csv = stringify(rows, {
  columns: ["gameName", "gameTag", "name", "puuid", "summonerId", "note"],
});

const home = Deno.env.get("HOME");
const outputPath = `${home}/Downloads/lol-friends.csv`;

await Deno.writeTextFile(outputPath, csv);
console.log(
  `Exported ${rows.length} friends to ${outputPath}`,
);
