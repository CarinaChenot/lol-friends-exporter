import fs from 'fs';
import axios from 'axios';
import * as https from 'node:https';
import { stringify } from 'csv-stringify';

const LOCKFILE_PATH =
  '/Applications/League of Legends.app/Contents/LoL/lockfile';
const CERTIFICATE_DOWNLOAD_URL =
  'https://static.developer.riotgames.com/docs/lol/riotgames.pem';

// Get the port and password from the lockfile
const lockfile = fs.readFileSync(LOCKFILE_PATH, 'utf8');
const [_, __, port, password, protocol] = lockfile.split(':');

// Get the latest certificate
const { data: certificateContents } = await axios.get(CERTIFICATE_DOWNLOAD_URL);
const httpsAgent = new https.Agent({ ca: [certificateContents] });

// Initialize a http client to interact with the LCU
const client = axios.create({
  baseURL: `${protocol}://127.0.0.1:${port}`,
  headers: {
    Authorization: `Basic ${Buffer.from(`riot:${password}`).toString('base64')}`,
  },
  httpsAgent,
});

const { data } = await client.get('/lol-chat/v1/friends');

stringify(
  data.map((friend) => ({
    gameName: friend.gameName,
    gameTag: friend.gameTag,
    name: `${friend.gameName}#${friend.gameTag}`,
    puuid: friend.puuid,
    summonerId: friend.summonerId,
    note: friend.note,
  })),
  {
    header: true,
    columns: [
      { key: 'gameName', header: 'Game Name' },
      { key: 'gameTag', header: 'Game Tag' },
      { key: 'name', header: 'Name' },
      { key: 'puuid', header: 'PUUID' },
      { key: 'summonerId', header: 'Summoner ID' },
      { key: 'note', header: 'Note' },
    ],
  },
  (err, output) => fs.writeFileSync('lol-friends.csv', output, 'utf8'),
);
