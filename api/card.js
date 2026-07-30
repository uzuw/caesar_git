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
  freudian: "https://lastfm.freetls.fastly.net/i/u/300x300/437daace5f2280e5fec3dee2ffd7377e.jpg",
  casestudy01: "https://lastfm.freetls.fastly.net/i/u/300x300/f2fff7cb1cae6b3886d749fe7bf86ca9.jpg",
  pdnl: "https://lastfm.freetls.fastly.net/i/u/300x300/7ab4f78932981481228761257599d1da.jpg",
};

// Simple deterministic-ish pastel accent per track so the card feels
// consistent between reloads of the same song, purely cosmetic.
const ACCENTS = ["#c4956a", "#b98a63", "#d1a37c", "#a97d55", "#cf9d6f"];

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg(track) {
  const bg = "#f5f0e8";
  const bar = ACCENTS[Math.floor(Math.random() * ACCENTS.length)];
  const title = escapeXml(track.title);
  const album = escapeXml(track.album);

  // Get album art URL
  const albumArt =
    ALBUM_ART[track.albumId] ||
    "https://via.placeholder.com/60/000000/FFFFFF?text=🎵";

  // A few animated "equalizer" bars, similar spirit to the original widget
  const barsSvg = Array.from({ length: 3 })
    .map((_, i) => {
      const x = 20 + i * 8;
      const dur = (0.8 + Math.random() * 0.6).toFixed(2);
      return `<rect x="${x}" y="20" width="4" height="14" rx="2" fill="${bar}">
        <animate attributeName="height" values="6;16;6" dur="${dur}s" repeatCount="indefinite" />
        <animate attributeName="y" values="27;16;27" dur="${dur}s" repeatCount="indefinite" />
      </rect>`;
    })
    .join("\n");

  const spotifyUrl =
    "https://open.spotify.com/user/bh6sl3lqw5k3zh85ksdl73aqv?si=RlNrgWg6Rc2Iui5lwFyd8Q&amp;utm_source=copy_link";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
    <a href="${spotifyUrl}" target="_top">
    <rect width="400" height="120" rx="16" fill="${bg}" />
    
    <!-- Album Art (60x60) -->
    <image href="${albumArt}" x="8" y="30" width="60" height="60" rx="6" />
    
    <text x="78" y="40" font-family="Verdana, sans-serif" font-size="11" fill="#8a8a8a">Now playing</text>
    <text x="78" y="62" font-family="Verdana, sans-serif" font-size="16" font-weight="bold" fill="#2b2b2b">${title}</text>
    <text x="78" y="82" font-family="Verdana, sans-serif" font-size="12" fill="#6b6b6b">Daniel Caesar &#8226; ${album}</text>
    
    <!-- Equalizer bars -->
    <g>${barsSvg}</g>
    </a>
  </svg>`;
}

module.exports = (req, res) => {
  const track = TRACKS[Math.floor(Math.random() * TRACKS.length)];
  const svg = buildSvg(track);

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.status(200).send(svg);
};
