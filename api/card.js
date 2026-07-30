// api/card.js
// Returns a randomly-selected Daniel Caesar "now playing" style SVG card
// on every request. Deploy this on Vercel and embed the resulting URL
// in your GitHub README.

const TRACKS = [
  {
    title: "Best Part",
    album: "Freudian",
    duration: "3:33",
    albumId: "freudian", // Reference to album art
  },
  {
    title: "Get You",
    album: "Freudian",
    duration: "4:17",
    albumId: "freudian",
  },
  {
    title: "Japanese Denim",
    album: "Freudian",
    duration: "3:15",
    albumId: "freudian",
  },
  {
    title: "Blessed",
    album: "Case Study 01",
    duration: "3:20",
    albumId: "casestudy01",
  },
  {
    title: "Superpowers",
    album: "CASE STUDY 01",
    duration: "5:03",
    albumId: "casestudy01",
  },
  {
    title: "Love Again",
    album: "CASE STUDY 01",
    duration: "3:33",
    albumId: "casestudy01",
  },
  {
    title: "Please Do Not Lean",
    album: "Please Do Not Lean (feat. BADBADNOTGOOD)",
    duration: "3:19",
    albumId: "pdnl",
  },
];

// Album art from Last.fm CDN
const ALBUM_ART = {
  freudian:
    "https://lastfm.freetls.fastly.net/i/u/300x300/437daace5f2280e5fec3dee2ffd7377e.jpg",
  casestudy01:
    "https://lastfm.freetls.fastly.net/i/u/300x300/f2fff7cb1cae6b3886d749fe7bf86ca9.jpg",
  pdnl: "https://lastfm.freetls.fastly.net/i/u/300x300/7ab4f78932981481228761257599d1da.jpg",
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
    <text x="135" y="78" font-family="Verdana, sans-serif" font-size="12" fill="#6b6b6b">Daniel Caesar &#8226; ${album}</text>
    
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
