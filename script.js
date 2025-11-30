// script.js — Optimized and Cleaned
document.addEventListener('DOMContentLoaded', () => {
  // --------- CONFIG (Using const and clear naming) ----------
  const CONFIG = {
    TELEGRAM_URL: 'YOUR_TELEGRAM_CHANNEL_INVITE_LINK', // <-- replace
    FOOTER_TEXT: 'Ad and Funnel made by Modern Work And Solutions',
    JSON_FILE: 'merged_stocks.json', // preferred (fetch). Place in same folder.
    MAX_RESULTS: 12,
    REFRESH_LIMIT: 3,
    DEBOUNCE_WAIT: 160 // Debounce time for stock search
  };
  // ---------------------------

  // Elements (Cached for performance)
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

  // Global state
  let topStocks = [];
  let highlightedIndex = -1;
  const ERROR_KEY = 'refresh_count';

  // 1) Refresh counter -> show 404 after X refreshes
  function initRefreshCounter() {
    try {
      let count = parseInt(sessionStorage.getItem(ERROR_KEY), 10) || 0;
      count++;
      sessionStorage.setItem(ERROR_KEY, count);

      if (mainContent && errorSection) {
        if (count > CONFIG.REFRESH_LIMIT) {
          mainContent.style.display = 'none';
          errorSection.style.display = 'flex';
        } else {
          mainContent.style.display = 'block';
          errorSection.style.display = 'none';
        }
      }
    } catch (e) {
      console.warn('Refresh counter error', e);
    }
  }
  
  // 2) Stocks loader: try JSON, fallback to window.topStocks
  async function loadStocks() {
    // Priority 1: Check if window.topStocks is already available
    if (Array.isArray(window.topStocks) && window.topStocks.length) {
      topStocks = window.topStocks;
      return;
    }

    // Priority 2: Try fetching merged_stocks.json
    try {
      const res = await fetch(CONFIG.JSON_FILE, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${CONFIG.JSON_FILE}`);
      const arr = await res.json();
      if (Array.isArray(arr) && arr.length) {
        topStocks = arr.map(s => ({
          code: (s.code || s.symbol || '').toString().toUpperCase().trim().replace(/\s+/g, ''),
          name: (s.name || s.company || '').toString().trim()
        }));
        return;
      }
    } catch (err) {
      console.warn('Could not fetch', CONFIG.JSON_FILE, err);
    }

    // Final Fallback: Tiny sample data
    if (!topStocks.length) {
      topStocks = [
        { code: 'RELIANCE', name: 'Reliance Industries Ltd' },
        { code: 'TCS', name: 'Tata Consultancy Services Ltd' },
        { code: 'HDFCBANK', name: 'HDFC Bank Ltd' }
      ];
    }
  }

  // 3) Utility helpers (Moved to top level for cleaner scope)
  const escapeHtml = (str = '') => String(str).replace(/[&<>"']/g, match => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[match]);

  const normalizeString = (s = '') => String(s).toUpperCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

  // debounce helper (Modern implementation)
  const debounce = (fn, wait = 150) => {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  // 4) Autocomplete rendering & logic
  function renderDropdown(results) {
    if (!stockDropdown) return;
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
      div.setAttribute('data-code', escapeHtml(st.code)); // Store code as data attribute
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
    const qn = normalizeString(q.trim());
    if (!qn) { 
      if (stockDropdown) stockDropdown.style.display = 'none'; 
      return; 
    }
    
    const results = [];
    
    // Efficient Search: Prioritize Code matches, then Name matches
    let codeMatches = [];
    let nameMatches = [];
    
    for (const s of topStocks) {
        if (codeMatches.length + nameMatches.length >= CONFIG.MAX_RESULTS) break;

        const codeNorm = normalizeString(s.code);
        const nameNorm = normalizeString(s.name);
        
        if (codeNorm.includes(qn) && codeMatches.length < CONFIG.MAX_RESULTS) {
            codeMatches.push(s);
        } else if (nameNorm.includes(qn) && nameMatches.length < CONFIG.MAX_RESULTS) {
            nameMatches.push(s);
        }
    }

    // Combine results (Codes first) and slice to max results
    results.push(...codeMatches, ...nameMatches);
    renderDropdown(results.slice(0, CONFIG.MAX_RESULTS));
  }

  const doSearch = debounce((e) => searchStocks(e.target.value), CONFIG.DEBOUNCE_WAIT);

  function updateHighlight(items) {
    items.forEach((it, idx) => it.classList.toggle('highlight', idx === highlightedIndex));
    if (highlightedIndex >= 0 && items[highlightedIndex]) {
      items[highlightedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  // 5) Initialization and Event Listeners
  function initEventListeners() {
    if (stockInput) {
        stockInput.addEventListener('input', doSearch);

        // Keyboard navigation
        stockInput.addEventListener('keydown', (e) => {
            const items = stockDropdown.querySelectorAll('.stock-item');
            if (!stockDropdown || stockDropdown.style.display === 'none' || items.length === 0) return;
            
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
                else searchStocks(stockInput.value); // If no item is highlighted, run search again/hide
            } else if (e.key === 'Escape') {
                stockDropdown.style.display = 'none';
            }
        });
    }

    // Hide dropdown on outside click
    document.addEventListener('click', (e) => {
      if (stockInput && stockDropdown && !stockInput.contains(e.target) && !stockDropdown.contains(e.target)) {
        stockDropdown.style.display = 'none';
      }
    });

    // Footer text and Telegram redirect
    if (footerAdText) footerAdText.textContent = CONFIG.FOOTER_TEXT;
    
    if (checkNowBtn) checkNowBtn.addEventListener('click', () => {
      try {
        // Use a more robust opening method
        const win = window.open(CONFIG.TELEGRAM_URL, '_blank', 'noopener,noreferrer');
        if (win) win.focus();
      } catch (e) {
        window.location.href = CONFIG.TELEGRAM_URL;
      }
    });
  }

  // 6) Countdown (Sample time maintained)
  function initCountdown() {
    const countdownTargetDate = new Date();
    // Use the initial values from HTML (9h 19m 35s) for the first run, 
    // then set a new target if needed, but for simplicity, we keep the original logic:
    countdownTargetDate.setHours(countdownTargetDate.getHours() + 9);
    countdownTargetDate.setMinutes(countdownTargetDate.getMinutes() + 19);
    countdownTargetDate.setSeconds(countdownTargetDate.getSeconds() + 35);

    const formatTime = (t) => String(t).padStart(2, '0');

    function updateCountdown() {
        const distance = countdownTargetDate.getTime() - Date.now();
        
        if (distance <= 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            return;
        }

        const msPerDay = 1000 * 60 * 60 * 24;
        const msPerHour = 1000 * 60 * 60;
        const msPerMinute = 1000 * 60;
        const msPerSecond = 1000;

        const days = Math.floor(distance / msPerDay);
        const hours = Math.floor((distance % msPerDay) / msPerHour);
        const minutes = Math.floor((distance % msPerHour) / msPerMinute);
        const seconds = Math.floor((distance % msPerMinute) / msPerSecond);

        if (daysEl) daysEl.textContent = formatTime(days);
        if (hoursEl) hoursEl.textContent = formatTime(hours);
        if (minutesEl) minutesEl.textContent = formatTime(minutes);
        if (secondsEl) secondsEl.textContent = formatTime(seconds);
    }

    // Run immediately and then set interval
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Main init sequence
  async function initializeApp() {
    initRefreshCounter();
    await loadStocks();
    
    // Final deduplication and cleaning of stock list
    const map = new Map();
    topStocks.forEach(s => {
      if (!s || !s.code) return;
      const c = s.code.toString().toUpperCase().replace(/\s+/g, '');
      const n = (s.name || '').toString().trim();
      if (!map.has(c)) map.set(c, { code: c, name: n });
    });
    topStocks = Array.from(map.values());
    
    initEventListeners();
    initCountdown();
  }

  initializeApp();
});
