// Global variable for the YouTube player instance
let player;

// Function called by the YouTube API script to load the player
// This function name is mandatory (onYouTubeIframeAPIReady)
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
            'autoplay': 1, // Start playing (will only work if muted)
            'mute': 1 // START MUTED to ensure guaranteed autoplay
        },
        events: {
            'onReady': (event) => {
                event.target.mute();
                event.target.playVideo();
                
                // Keep pointer events disabled in CSS to prevent accidental clicks on the video
                const iframe = document.getElementById('youtube-player').querySelector('iframe');
                if (iframe) {
                    iframe.style.pointerEvents = 'none'; 
                }
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
  // --------- CONFIG ----------
  const TELEGRAM_URL = 'tg://join?invite=L379AEHBqGNjOGVl'; // <--- PLEASE REPLACE THIS WITH YOUR TELEGRAM LINK
  const FOOTER_TEXT = 'Ad and Funnel made by Modern Work And Solutions';
  const MAX_RESULTS = 12;
  const REFRESH_LIMIT = 3; // Number of refreshes before 404 error shows
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

  // 2) Stock Data (Inline for simplicity, as JSON/JS file was too large)
  let topStocks = [
    { code: 'RELIANCE', name: 'Reliance Industries Ltd' },
    { code: 'HDFCBANK', name: 'HDFC Bank Ltd' },
    { code: 'BHARTIARTL', name: 'Bharti Airtel Ltd' },
    { code: 'TCS', name: 'Tata Consultancy Services Ltd' },
    { code: 'TITAGARH', name: 'Titagarh Rail Systems Ltd' }, 
    { code: 'TATASTEEL', name: 'Tata Steel Ltd' },
    { code: 'ICICIBANK', name: 'ICICI Bank Ltd' },
    { code: 'SBIN', name: 'State Bank of India' },
    { code: 'INFY', name: 'Infosys Ltd' },
    { code: 'BAJFINANCE', name: 'Bajaj Finance Ltd' },
    { code: 'HINDUNILVR', name: 'Hindustan Unilever Ltd' },
    { code: 'LT', name: 'Larsen & Toubro Ltd' },
    { code: 'ITC', name: 'ITC Ltd' },
    { code: 'MARUTI', name: 'Maruti Suzuki India Ltd' },
    { code: 'M&M', name: 'Mahindra & Mahindra Ltd' },
    { code: 'HCLTECH', name: 'HCL Technologies Ltd' },
    { code: 'SUNPHARMA', name: 'Sun Pharmaceutical Inds. Ltd' },
    { code: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd' },
    { code: 'AXISBANK', name: 'Axis Bank Ltd' },
    { code: 'TITAN', name: 'Titan Company Ltd' },
    { code: 'ULTRACEMCO', name: 'UltraTech Cement Ltd' },
    { code: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd' },
    { code: 'NTPC', name: 'NTPC Ltd' },
    { code: 'ONGC', name: 'Oil & Natural Gas Corpn Ltd' },
    { code: 'POWERGRID', name: 'Power Grid Corp. of India Ltd' },
    { code: 'ADANIENT', name: 'Adani Enterprises Ltd' },
    { code: 'ASIANPAINT', name: 'Asian Paints Ltd' },
    { code: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd' },
    { code: 'HDFCLIFE', name: 'HDFC Life Insurance Co. Ltd' },
    { code: 'INDUSINDBK', name: 'IndusInd Bank Ltd' },
    { code: 'JSWSTEEL', name: 'JSW Steel Ltd' },
    { code: 'NESTLEIND', name: 'Nestle India Ltd' },
    { code: 'TECHM', name: 'Tech Mahindra Ltd' },
    { code: 'WIPRO', name: 'Wipro Ltd' },
    { code: 'DMART', name: 'Avenue Supermarts Ltd' },
    { code: 'PIDILITIND', name: 'Pidilite Industries Ltd' },
    { code: 'SRF', name: 'SRF Ltd' },
    { code: 'GODREJCP', name: 'Godrej Consumer Products Ltd' },
    { code: 'BERGEPAINT', name: 'Berger Paints India Ltd' },
    { code: 'IRCTC', name: 'Indian Railway Catering & Tourism Corp. Ltd' },
    { code: 'ZEEL', name: 'Zee Entertainment Ent. Ltd' },
    { code: 'TATAMOTORS', name: 'Tata Motors Ltd' },
    { code: 'TATACONSUM', name: 'Tata Consumer Products Ltd' },
    { code: 'GAIL', name: 'GAIL (India) Ltd' },
    { code: 'COALINDIA', name: 'Coal India Ltd' },
    { code: 'BPCL', name: 'Bharat Petroleum Corp. Ltd' },
    { code: 'IOC', name: 'Indian Oil Corp. Ltd' },
    { code: 'HINDPETRO', name: 'Hindustan Petroleum Corp. Ltd' },
    { code: 'GRASIM', name: 'Grasim Industries Ltd' },
    { code: 'LICI', name: 'Life Insurance Corp. of India' },
    { code: 'VEDANTA', name: 'Vedanta Ltd' },
    { code: 'HINDALCO', name: 'Hindalco Industries Ltd' },
    { code: 'SAIL', name: 'Steel Authority of India Ltd' },
    { code: 'TVSMOTOR', name: 'TVS Motor Company Ltd' },
    { code: 'BEL', name: 'Bharat Electronics Ltd' },
    { code: 'HAL', name: 'Hindustan Aeronautics Ltd' },
    { code: 'ZOMATO', name: 'Zomato Ltd' },
    { code: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd' },
    { code: 'SUZLON', name: 'Suzlon Energy Ltd' },
    { code: 'EICHERMOT', name: 'Eicher Motors Ltd' },
    { code: 'CIPLA', name: 'Cipla Ltd' },
    { code: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Ltd' },
    { code: 'APOLLOHOS', name: 'Apollo Hospitals Enterprise Ltd' },
    { code: 'TRENT', name: 'Trent Ltd' },
    { code: 'VOLTAS', name: 'Voltas Ltd' },
    { code: 'PFC', name: 'Power Finance Corporation Ltd' },
    { code: 'SHREECEM', name: 'Shree Cement Ltd' },
    { code: 'POLYCAB', name: 'Polycab India Ltd' },
    { code: 'MUTHOOTFIN', name: 'Muthoot Finance Ltd' },
    { code: 'MCDOWELL-N', name: 'United Spirits Ltd' },
    { code: 'WHIRLPOOL', 'name': 'Whirlpool of India Ltd' },
    { code: 'TTKPRESTIG', 'name': 'TTK Prestige Ltd' },
    { code: 'SBICARD', 'name': 'SBI Cards & Payment Services Ltd' },
    { code: 'SANOFI', 'name': 'Sanofi India Ltd' },
    { code: 'RBLBANK', 'name': 'RBL Bank Ltd' },
    { code: 'RAMCOCEM', 'name': 'Ramco Cements Ltd' },
    { code: 'QUESS', 'name': 'Quess Corp Ltd' },
    { code: 'PRESTIGE', 'name': 'Prestige Estates Projects Ltd' },
    { code: 'POLYMED', 'name': 'Poly Medicure Ltd' },
    { code: 'PNB', 'name': 'Punjab National Bank' },
    { code: 'PETRONET', 'name': 'Petronet LNG Ltd' },
    { code: 'PAGEIND', 'name': 'Page Industries Ltd' },
    { code: 'OIL', 'name': 'Oil India Ltd' },
    { code: 'OFSS', 'name': 'Oracle Financial Services Software Ltd' },
    { code: 'NLCINDIA', 'name': 'NLC India Ltd' },
    { code: 'NHPC', 'name': 'NHPC Ltd' },
    { code: 'NCC', 'name': 'NCC Ltd' },
    { code: 'NBCC', 'name': 'NBCC (India) Ltd' },
    { code: 'MRF', 'name': 'MRF Ltd' },
    { code: 'MGL', 'name': 'Mahanagar Gas Ltd' },
    { code: 'LUXIND', 'name': 'Lux Industries Ltd' },
    { code: 'LTTS', 'name': 'L&T Technology Services Ltd' },
    { code: 'LINDEINDIA', 'name': 'Linde India Ltd' },
    { code: 'LALPATHLAB', 'name': 'Dr Lal PathLabs Ltd' },
    { code: 'KSCL', 'name': 'Kaveri Seed Company Ltd' },
    { code: 'JUBLFOOD', 'name': 'Jubilant Foodworks Ltd' },
    { code: 'JAICORPLTD', 'name': 'Jai Corp Ltd' },
    { code: 'J&KBANK', 'name': 'Jammu & Kashmir Bank Ltd' }
  ]; // Top 100+ stock list

  // 3) Utility helpers (Unchanged)
  function escapeHtml(str = '') {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
  function norm(s = '') {
    return String(s).toUpperCase().normalize('NFKD').replace(/[̀-ͯ]/g,'');
  }

  // 4) Autocomplete rendering & logic (Unchanged)
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

  // 5) Telegram redirect & footer text (Unmute Logic)
  if (footerAdText) footerAdText.textContent = FOOTER_TEXT;
  
  if (checkNowBtn) checkNowBtn.addEventListener('click', () => {
    // Step 1: UNMUTE the video for the user to hear the audio
    if (window.player && typeof window.player.unMute === 'function') {
        window.player.unMute();
        console.log('Video Unmuted by user interaction.');
    }
    
    // Step 2: Redirect to the Telegram Channel
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

  // Init: Stock list processing
  (async () => {
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
