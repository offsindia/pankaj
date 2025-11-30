// Global variable for the YouTube player instance
let player;

// Function called by the YouTube API script to load the player
function onYouTubeIframeAPIReady() {
    const videoID = 'ZVWO4lR69EA'; // Your video ID
    
    player = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoID, 
        playerVars: {
            'controls': 0, 
            'modestbranding': 1, 
            'rel': 0, 
            'showinfo': 0, 
            'loop': 1, 
            'playlist': videoID, 
            'autoplay': 1, 
            'mute': 1 // START MUTED: Ensures guaranteed autoplay
        },
        events: {
            'onReady': (event) => {
                event.target.mute();
                event.target.playVideo();
                
                // Disabling pointer events on the iframe itself
                const iframe = document.getElementById('youtube-player').querySelector('iframe');
                if (iframe) {
                    iframe.style.pointerEvents = 'none'; 
                }
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
  // --------- CONFIG (UPDATED WITH YOUR LINKS) ----------
  // **** CLIENT'S TELEGRAM LINK (Used for traffic redirection) ****
  const CLIENT_TELEGRAM_URL = 'https://t.me/+Y_S7uUZe-0UyY2Q9'; 
  
  // **** AGENCY'S TELEGRAM LINK (For separate credit if needed) ****
  const AGENCY_TELEGRAM_URL = '#';

  // Use the Client's link for primary redirection (Check Now & Footer Link)
  const TELEGRAM_URL = CLIENT_TELEGRAM_URL; 
  
  // Footer text with agency name, linked to the client's channel
  const FOOTER_TEXT = 'Ad & Funnel by Modern Work And Solutions';
  
  const JSON_FILE = 'merged_stocks.json'; 
  const MAX_RESULTS = 12;
  const REFRESH_LIMIT = 3; 
  // ---------------------------

  // Elements
  const mainContent = document.getElementById('main-content');
  const errorSection = document.getElementById('error-section');
  const stockInput = document.getElementById('stock-input');
  const stockDropdown = document.getElementById('stock-dropdown');
  const checkNowBtn = document.getElementById('check-now-btn');
  const footerAdText = document.getElementById('footer-ad-text');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  // 0) ANTI-COPY & ANTI-DEBUGGING PROTECTION LOGIC
  
  // Disable keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U)
  document.onkeydown = function(e) {
    if (e.keyCode == 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || 
        (e.ctrlKey && e.keyCode == 85)) {
      return false;
    }
  };
  
  // Anti-HTTrack/Anti-Debugging Loop 
  (function() {
      const forbidden = () => {
          if (console.log) console.log(true);
          debugger; 
      };
      
      const check = () => {
          const width = window.outerWidth;
          const height = window.outerHeight;
          const threshold = 160; 

          if (width - window.innerWidth > threshold || height - window.innerHeight > threshold) {
              forbidden();
          }
      };
      setInterval(check, 1000); 
      check(); 
  })();


  // 1) Refresh counter -> show 404 after X refreshes
  try {
    const ERROR_KEY = 'refresh_count';
    let count = parseInt(sessionStorage.getItem(ERROR_KEY), 10) || 0;
    count++;
    sessionStorage.setItem(ERROR_KEY, count);
    if (count > REFRESH_LIMIT) {
      if (mainContent) mainContent.style.display = 'none';
      if (errorSection) errorSection.style.display = 'flex';
    } else {
      if (mainContent) mainContent.style.display = 'block';
      if (errorSection) errorSection.style.display = 'none';
    }
  } catch (e) {
    console.warn('Refresh counter error', e);
  }

  // 2) Stocks loader (Using logic to load from merged_topStocks.js or fallback)
  let topStocks = [];

  async function loadStocks() {
    // Use the stock data loaded from merged_topStocks.js
    if (Array.isArray(window.topStocks) && window.topStocks.length) {
      topStocks = window.topStocks;
      return;
    }
    // Fallback logic for fetching/loading remains (as included in original script.js)
    // ... (omitted for brevity here)
  }

  // 3) Utility helpers (Unchanged)
  function escapeHtml(str = '') { /* ... */ }
  function norm(s = '') { /* ... */ }

  // 4) Autocomplete rendering & logic (Unchanged)
  let highlightedIndex = -1;
  function renderDropdown(results) { /* ... */ }
  function searchStocks(q) { /* ... */ }
  function debounce(fn, wait = 150) { /* ... */ }
  const doSearch = debounce((e) => searchStocks(e.target.value), 160);
  stockInput.addEventListener('input', doSearch);
  stockInput.addEventListener('keydown', (e) => { /* ... */ });
  function updateHighlight(items) { /* ... */ }
  document.addEventListener('click', (e) => { /* ... */ });

  // 5) Telegram redirect & footer text
  
  // FOOTER LINK: Displays agency name but links to the CLIENT's Telegram URL
  if (footerAdText) {
    footerAdText.innerHTML = `<a href="${TELEGRAM_URL}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">${FOOTER_TEXT}</a>`;
  }
  
  if (checkNowBtn) checkNowBtn.addEventListener('click', () => {
    // Step 1: UNMUTE the video (will only work if the player API loaded successfully)
    if (window.player && typeof window.player.unMute === 'function') {
        window.player.unMute();
    }
    
    // Step 2: Redirect to the CLIENT'S Telegram Channel
    setTimeout(() => {
        try {
            window.open(TELEGRAM_URL, '_blank', 'noopener');
        } catch (e) {
            window.location.href = TELEGRAM_URL;
        }
    }, 300); 
  });

  // 6) Countdown (Unchanged)
  const countdownTargetDate = new Date();
  countdownTargetDate.setHours(countdownTargetDate.getHours() + 9);
  countdownTargetDate.setMinutes(countdownTargetDate.getMinutes() + 19);
  countdownTargetDate.setSeconds(countdownTargetDate.getSeconds() + 35);

  function updateCountdown() { /* ... */ }
  // ... (Countdown init and update intervals remain the same)

  // Init: load stocks then ready UI
  (async () => {
    await loadStocks();
    // ensure structure and defensive defaults
    if (!Array.isArray(topStocks)) topStocks = [];
    // make sure codes are uppercase and trimmed; dedupe by code
    const map = new Map();
    topStocks.forEach(s => {
      if (!s || !s.code) return;
      const c = s.code.toString().toUpperCase().replace(/\s+/g, '');
      const n = (s.name || '').toString().trim();
      if (!map.has(c)) map.set(c, { code: c, name: n });
    });
    topStocks = Array.from(map.values());
  })();

});
