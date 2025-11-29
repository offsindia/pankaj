// Global variable for the YouTube player instance
let player;

// Function called by the YouTube API script to load the player
// This function name is mandatory (onYouTubeIframeAPIReady)
function onYouTubeIframeAPIReady() {
    // The video ID is ZVWO4lR69EA
    player = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: 'ZVWO4lR69EA', 
        playerVars: {
            'controls': 0, // No controls
            'modestbranding': 1, // No YouTube logo
            'rel': 0, // No related videos
            'showinfo': 0, // No title/info
            'loop': 1, // Loop video
            'playlist': 'ZVWO4lR69EA', // Mandatory for looping
            'autoplay': 1, // Start playing
            'mute': 1 // START MUTED to ensure guaranteed autoplay
        },
        events: {
            // Once the player is ready, explicitly ensure it's muted and playing
            'onReady': (event) => {
                event.target.mute();
                event.target.playVideo();
                // We also need to add pointer events back to allow interaction after loading
                const iframe = document.getElementById('youtube-player').querySelector('iframe');
                if (iframe) {
                    iframe.style.pointerEvents = 'none'; // Keep hidden interaction
                }
            }
        }
    });
}

// script.js — Original Logic for counters, stocks, and buttons
document.addEventListener('DOMContentLoaded', () => {
  // --------- CONFIG ----------
  const TELEGRAM_URL = 'YOUR_TELEGRAM_CHANNEL_INVITE_LINK'; // <-- REPLACE THIS WITH YOUR TELEGRAM LINK
  const FOOTER_TEXT = 'Ad and Funnel made by Modern Work And Solutions';
  const JSON_FILE = 'merged_stocks.json'; // preferred (fetch). Place in same folder.
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

  // 2) Stocks loader: try JSON, fallback to window.topStocks
  let topStocks = [];

  async function loadStocks() {
    // Note: The merged_topStocks.js file is provided as input, so we use window.topStocks
    if (Array.isArray(window.topStocks) && window.topStocks.length) {
      topStocks = window.topStocks;
      return;
    }

    // Try fetch merged_stocks.json
    try {
      const res = await fetch(JSON_FILE, { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const arr = await res.json();
      if (Array.isArray(arr) && arr.length) {
        topStocks = arr.map(s => ({
          code: (s.code || s.symbol || '').toString().toUpperCase().trim(),
          name: (s.name || s.company || '').toString().trim()
        }));
        return;
      }
    } catch (err) {
      console.warn('Could not fetch stocks from file.', err);
    }
  }

  // 3) Utility helpers (unchanged)
  function escapeHtml(str = '') {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
  function norm(s = '') {
    return String(s).toUpperCase().normalize('NFKD').replace(/[̀-ͯ]/g,'');
  }

  // 4) Autocomplete rendering & logic (unchanged)
  let highlightedIndex = -1;
  function renderDropdown(results) {
    stockDropdown.innerHTML = '';
    highlightedIndex = -1;
    if (!results || !results.length) {
      stockDropdown.style.display = 'none';
      return;
    }
    const fragment = document.createDocumentFragment();
    results.forEach((st) => {
      const div = document.createElement('div');
      div.className = 'stock-item';
      div.tabIndex = 0;
      div.innerHTML = `<span class="stock-code">${escapeHtml(st.code)}</span><span class="stock-name">${escapeHtml(st.name)}</span>`;
      div.addEventListener('click', () => {
        stockInput.value = st.name;
        stockDropdown.style.display = 'none';
        stockInput.focus();
      });
      fragment.appendChild(div);
    });
    stockDropdown.appendChild(fragment);
    stockDropdown.style.display = 'block';
  }

  function searchStocks(q) {
    const qn = norm(q.trim());
    if (!qn) { stockDropdown.style.display = 'none'; return; }
    const results = [];
    for (let i = 0; i < topStocks.length && results.length < MAX_RESULTS; i++) {
      const s = topStocks[i];
      if (!s) continue;
      if (norm(s.code).includes(qn) || norm(s.name).includes(qn)) results.push(s);
    }
    renderDropdown(results);
  }

  function debounce(fn, wait = 150) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  const doSearch = debounce((e) => searchStocks(e.target.value), 160);
  stockInput.addEventListener('input', doSearch);

  stockInput.addEventListener('keydown', (e) => {
    const items = stockDropdown.querySelectorAll('.stock-item');
    if (stockDropdown.style.display === 'none' || items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
      updateHighlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, 0);
      updateHighlight(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && items[highlightedIndex]) items[highlightedIndex].click();
    } else if (e.key === 'Escape') {
      stockDropdown.style.display = 'none';
    }
  });

  function updateHighlight(items) {
    items.forEach((it, idx) => it.classList.toggle('highlight', idx === highlightedIndex));
    if (highlightedIndex >= 0 && items[highlightedIndex]) items[highlightedIndex].scrollIntoView({ block: 'nearest' });
  }

  document.addEventListener('click', (e) => {
    if (!stockInput.contains(e.target) && !stockDropdown.contains(e.target)) {
      stockDropdown.style.display = 'none';
    }
  });

  // 5) Telegram redirect & footer text (MODIFIED for Unmute)
  if (footerAdText) footerAdText.textContent = FOOTER_TEXT;
  
  if (checkNowBtn) checkNowBtn.addEventListener('click', () => {
    // Step 1: UNMUTE the video for the user to hear the audio
    if (window.player && typeof window.player.unMute === 'function') {
        window.player.unMute();
        console.log('Video Unmuted by user interaction.');
    }
    
    // Step 2: Redirect to the Telegram Channel
    // We delay the redirect slightly to allow the unmuting action to register before navigation
    setTimeout(() => {
        try {
            window.open(TELEGRAM_URL, '_blank', 'noopener');
        } catch (e) {
            window.location.href = TELEGRAM_URL;
        }
    }, 300); // 300ms delay for smooth transition
  });

  // 6) Countdown (Unchanged)
  const countdownTargetDate = new Date();
  countdownTargetDate.setHours(countdownTargetDate.getHours() + 9);
  countdownTargetDate.setMinutes(countdownTargetDate.getMinutes() + 19);
  countdownTargetDate.setSeconds(countdownTargetDate.getSeconds() + 35);

  function updateCountdown() {
    const now = Date.now();
    const distance = countdownTargetDate.getTime() - now;
    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Init: load stocks then ready UI
  (async () => {
    await loadStocks();
    if (!Array.isArray(topStocks)) topStocks = [];
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
