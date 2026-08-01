// api/card.js
// Returns a randomly-selected Daniel Caesar "now playing" style SVG card
// on every request. Deploy this on Vercel and embed the resulting URL
// in your GitHub README.

const TRACKS = [
  {
    title: "Best Part",
    artist: "Daniel Caesar",
    album: "Freudian",
    duration: "3:33",
    albumId: "freudian", // Reference to album art
  },
  {
    title: "Get You",
    artist: "Daniel Caesar",
    album: "Freudian",
    duration: "4:17",
    albumId: "freudian",
  },
  {
    title: "Japanese Denim",
    artist: "Daniel Caesar",
    album: "Freudian",
    duration: "3:15",
    albumId: "freudian",
  },
  {
    title: "Blessed",
    artist: "Daniel Caesar",
    album: "Case Study 01",
    duration: "3:20",
    albumId: "casestudy01",
  },
  {
    title: "Superpowers",
    artist: "Daniel Caesar",
    album: "CASE STUDY 01",
    duration: "5:03",
    albumId: "casestudy01",
  },
  {
    title: "Love Again",
    artist: "Daniel Caesar",
    album: "CASE STUDY 01",
    duration: "3:33",
    albumId: "casestudy01",
  },
  {
    title: "Please Do Not Lean",
    artist: "Daniel Caesar",
    album: "Please Do Not Lean (feat. BADBADNOTGOOD)",
    duration: "3:19",
    albumId: "pdnl",
  },
  {
    title: "God's Plan",
    artist: "Drake",
    album: "Scorpion",
    duration: "3:18",
    albumId: "scorpion",
  },
  {
    title: "In My Feelings",
    artist: "Drake",
    album: "Scorpion",
    duration: "3:37",
    albumId: "scorpion",
  },
  {
    title: "Nice For What",
    artist: "Drake",
    album: "Scorpion",
    duration: "3:30",
    albumId: "scorpion",
  },
  {
    title: "One Dance",
    artist: "Drake",
    album: "Views",
    duration: "2:53",
    albumId: "views",
  },
  {
    title: "Hotline Bling",
    artist: "Drake",
    album: "Views",
    duration: "4:27",
    albumId: "views",
  },
  {
    title: "Started From the Bottom",
    artist: "Drake",
    album: "Nothing Was the Same",
    duration: "2:53",
    albumId: "nwts",
  },
  {
    title: "Hold On, We're Going Home",
    artist: "Drake",
    album: "Nothing Was the Same",
    duration: "3:47",
    albumId: "nwts",
  },
  {
    title: "Headlines",
    artist: "Drake",
    album: "Take Care",
    duration: "3:56",
    albumId: "takecare",
  },
  {
    title: "Marvins Room",
    artist: "Drake",
    album: "Take Care",
    duration: "5:47",
    albumId: "takecare",
  },
  {
    title: "Passionfruit",
    artist: "Drake",
    album: "More Life",
    duration: "4:58",
    albumId: "morelife",
  },
  {
    title: "Fake Love",
    artist: "Drake",
    album: "More Life",
    duration: "3:30",
    albumId: "morelife",
  },
  {
    title: "Jimmy Cooks",
    artist: "Drake",
    album: "Honestly, Nevermind",
    duration: "3:38",
    albumId: "nevermind",
  },
  {
    title: "Rich Flex",
    artist: "Drake",
    album: "Her Loss",
    duration: "3:59",
    albumId: "herloss",
  },
];

const ALBUM_ART = {
  freudian:
    "https://lastfm.freetls.fastly.net/i/u/300x300/437daace5f2280e5fec3dee2ffd7377e.jpg",
  casestudy01:
    "https://lastfm.freetls.fastly.net/i/u/300x300/f2fff7cb1cae6b3886d749fe7bf86ca9.jpg",
  pdnl: "https://lastfm.freetls.fastly.net/i/u/300x300/7ab4f78932981481228761257599d1da.jpg",
  scorpion:
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/6d/8f/bb6d8f67-6d04-10b5-dd62-eb5809ac54fc/00602567879152.rgb.jpg/300x300bb.jpg",
  views:
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/f5/87/95f587f7-21c3-d5f9-d81a-4350f9caa020/16UMGIM27643.rgb.jpg/300x300bb.jpg",
  nwts:
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/60/e8/d1/60e8d144-2b8e-cbdc-9ff8-beaf9f4868b1/00602537542345.rgb.jpg/300x300bb.jpg",
  takecare:
    "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d2/53/62/d2536245-b94c-b3fd-7168-9512f655f6d4/00602527899091.rgb.jpg/300x300bb.jpg",
  morelife:
    "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/18/9d/b8/189db80b-bfa8-89d1-1514-5fcb7e5cf8f4/00602557611526.rgb.jpg/300x300bb.jpg",
  nevermind:
    "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/6d/31/ab/6d31abaf-7a07-05f1-13ad-72ec520b6bfb/22UMGIM67374.rgb.jpg/300x300bb.jpg",
  herloss:
    "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/e1/6e/6a/e16e6a89-3e6d-1936-1a9c-b51680bcd4c1/22UM1IM29132.rgb.jpg/300x300bb.jpg",
};

// Simple deterministic-ish pastel accent per track so the card feels
// consistent between reloads of the same song, purely cosmetic.
const ACCENTS = ["#c4956a", "#b98a63", "#d1a37c", "#a97d55", "#cf9d6f"];

// Fetch album art from Last.fm CDN and return as base64 data URI so
// GitHub's Camo proxy doesn't block the image.
async function getAlbumArt(albumId) {
  try {
    const url = ALBUM_ART[albumId];
    if (!url) return null;
    const response = await fetch(url);
    if (!response.ok) return null;
    const buf = Buffer.from(await response.arrayBuffer());
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg(track, albumArt) {
  const bg = "#f5f0e8";
  const eqColor = ACCENTS[Math.floor(Math.random() * ACCENTS.length)];
  const title = escapeXml(track.title);
  const artist = escapeXml(track.artist);
  const album = escapeXml(track.album);

  const spotifyUrl =
    "https://open.spotify.com/user/bh6sl3lqw5k3zh85ksdl73aqv?si=RlNrgWg6Rc2Iui5lwFyd8Q&amp;utm_source=copy_link";

  // Equalizer bars on the far right, like Spotify's desktop widget
  const barsSvg = Array.from({ length: 3 })
    .map((_, i) => {
      const x = 370 + i * 10;
      const dur = (0.7 + Math.random() * 0.8).toFixed(2);
      return `<rect x="${x}" y="42" width="5" height="16" rx="2" fill="${eqColor}">
        <animate attributeName="height" values="8;24;8" dur="${dur}s" repeatCount="indefinite" />
        <animate attributeName="y" values="48;36;48" dur="${dur}s" repeatCount="indefinite" />
      </rect>`;
    })
    .join("\n");

  // Random playback position for the progress bar
  const playedPct = Math.floor(Math.random() * 80) + 10;
  const progressW = 200;
  const fillW = Math.floor(progressW * playedPct / 100);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
    <defs>
      <clipPath id="c"><rect width="400" height="120" rx="16" /></clipPath>
    </defs>
    <a href="${spotifyUrl}" target="_top">
    <rect width="400" height="120" rx="16" fill="${bg}" />
    
    <g clip-path="url(#c)">
      <!-- Album art fills the full left height -->
      <image href="${albumArt}" x="0" y="0" width="120" height="120" />
    </g>
    
    <!-- Track info -->
    <text x="135" y="35" font-family="Verdana, sans-serif" font-size="11" fill="#8a8a8a">Now playing</text>
    <text x="135" y="58" font-family="Verdana, sans-serif" font-size="16" font-weight="bold" fill="#2b2b2b">${title}</text>
    <text x="135" y="78" font-family="Verdana, sans-serif" font-size="12" fill="#6b6b6b">${artist} &#8226; ${album}</text>
    
    <!-- Progress bar - like Spotify -->
    <rect x="135" y="100" width="${progressW}" height="4" rx="2" fill="#d4d0c8" />
    <rect x="135" y="100" width="${fillW}" height="4" rx="2" fill="#1DB954" />
    
    <!-- Animated equalizer -->
    ${barsSvg}
    </a>
  </svg>`;
}

module.exports = async (req, res) => {
  const track = TRACKS[Math.floor(Math.random() * TRACKS.length)];
  const albumArt = (await getAlbumArt(track.albumId)) || "";
  const svg = buildSvg(track, albumArt);

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'",
  );
  res.status(200).send(svg);
};
