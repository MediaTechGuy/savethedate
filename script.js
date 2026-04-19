/* ─────────────────────────────────────────────
   Blessing & Tolulope — Save The Date
   script.js
───────────────────────────────────────────── */

/* ── STATE ── */
let isOpened  = false;
let isPlaying = false;

/* ── ELEMENTS ── */
const body        = document.body;
const musicEl     = document.getElementById('music');
const playBtn     = document.getElementById('playBtn');
const iconPlay    = document.getElementById('iconPlay');
const iconPause   = document.getElementById('iconPause');
const musicBars   = document.getElementById('musicBars');

/* ═══════════════════════════════════════════
   OPEN ENVELOPE
═══════════════════════════════════════════ */
function openEnvelope() {
  if (isOpened) return;
  isOpened = true;

  body.classList.add('opened');

  /* Start music after the letter fully appears (~1.4s) */
  setTimeout(startMusic, 1500);
}

/* ═══════════════════════════════════════════
   MUSIC — primary: local MP3
   fallback: YouTube iframe API
═══════════════════════════════════════════ */

/* ── Try local MP3 first ── */
function startMusic() {
  if (!musicEl) { initYouTube(); return; }

  musicEl.volume = 0.7;

  const playPromise = musicEl.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        /* MP3 playing fine */
        setPlayingUI(true);
      })
      .catch(() => {
        /* Browser blocked autoplay — show player, let user tap */
        setPlayingUI(false);
        /* Also try YouTube as fallback */
        initYouTube();
      });
  }

  /* Listen for native audio events */
  musicEl.addEventListener('play',  () => setPlayingUI(true));
  musicEl.addEventListener('pause', () => setPlayingUI(false));
  musicEl.addEventListener('ended', () => setPlayingUI(false));

  /* If file not found / error, fall back to YouTube */
  musicEl.addEventListener('error', () => {
    console.warn('Local audio failed — switching to YouTube fallback.');
    initYouTube();
  });
}

/* ── Toggle play/pause (called by button) ── */
function toggleMusic() {
  /* Try local MP3 first */
  if (musicEl && musicEl.src && !musicEl.error) {
    if (musicEl.paused) {
      musicEl.play().then(() => setPlayingUI(true)).catch(() => {});
    } else {
      musicEl.pause();
      setPlayingUI(false);
    }
    return;
  }

  /* Fallback: YouTube player */
  if (ytPlayer && ytAPIReady) {
    if (isPlaying) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
  }
}

/* ── Update UI ── */
function setPlayingUI(playing) {
  isPlaying = playing;
  iconPlay.style.display  = playing ? 'none'  : 'block';
  iconPause.style.display = playing ? 'block' : 'none';
  playing
    ? musicBars.classList.remove('paused')
    : musicBars.classList.add('paused');
}

/* ═══════════════════════════════════════════
   YOUTUBE FALLBACK
   Video: "Can I Have This Dance" — HSM 2 OST
═══════════════════════════════════════════ */
const YT_VID    = 'xBpbM9SXQXE';
let ytPlayer    = null;
let ytAPIReady  = false;

function initYouTube() {
  /* Only load once */
  if (document.getElementById('yt-script')) return;

  const tag    = document.createElement('script');
  tag.id       = 'yt-script';
  tag.src      = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function () {
  ytAPIReady = true;

  ytPlayer = new YT.Player('yt-player', {
    width:  '1',
    height: '1',
    videoId: YT_VID,
    playerVars: {
      autoplay:       1,
      controls:       0,
      rel:            0,
      loop:           1,
      playlist:       YT_VID,
      modestbranding: 1,
    },
    events: {
      onReady(e) {
        e.target.setVolume(70);
        e.target.playVideo();
      },
      onStateChange(e) {
        if (e.data === YT.PlayerState.PLAYING) setPlayingUI(true);
        if (e.data === YT.PlayerState.PAUSED ||
            e.data === YT.PlayerState.ENDED)   setPlayingUI(false);
      },
    },
  });
};
