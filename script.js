document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Refresh Counter and Error 404 Logic
    // ----------------------------------------------------
    const REFRESH_LIMIT = 3; // The website will show Error 404 after this many refreshes
    const ERROR_KEY = 'refresh_count';

    let count = parseInt(sessionStorage.getItem(ERROR_KEY)) || 0;
    count++;
    sessionStorage.setItem(ERROR_KEY, count);

    const mainContent = document.getElementById('main-content');
    const errorSection = document.getElementById('error-section');

    if (count > REFRESH_LIMIT) {
        // Show 404 Error
        mainContent.style.display = 'none';
        errorSection.style.display = 'flex'; // Use flex to center content
        // Optionally, reset the counter if you want the page to work again later
        // sessionStorage.removeItem(ERROR_KEY); 
    } else {
        // Show Main Content
        mainContent.style.display = 'block';
        errorSection.style.display = 'none';
    }


    // ----------------------------------------------------
    // 2. Stock Data and Autocomplete
    // ----------------------------------------------------
    const stockInput = document.getElementById('stock-input');
    const stockDropdown = document.getElementById('stock-dropdown');

    // **Top 100 Stock List (Simplified for example)**
    // Replace with a more comprehensive list if needed.
    const topStocks = [
        { code: 'RELIANCE', name: 'Reliance Industries Ltd' },
        { code: 'HDFCBANK', name: 'HDFC Bank Ltd' },
        { code: 'TCS', name: 'Tata Consultancy Services Ltd' },
        { code: 'TITAN', name: 'Titan Company Ltd' },
        { code: 'TATAMOTORS', name: 'Tata Motors Ltd' },
        { code: 'TATASTEEL', name: 'Tata Steel Ltd' },
        { code: 'TECHM', name: 'Tech Mahindra Ltd' },
        { code: 'INFY', name: 'Infosys Ltd' },
        { code: 'MARUTI', name: 'Maruti Suzuki India Ltd' },
        { code: 'AXISBANK', name: 'Axis Bank Ltd' },
        { code: 'ICICIBANK', name: 'ICICI Bank Ltd' },
        { code: 'SBIN', name: 'State Bank of India' },
        { code: 'M&M', name: 'Mahindra & Mahindra Ltd' },
        { code: 'HINDUNILVR', name: 'Hindustan Unilever Ltd' },
        { code: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd' },
        { code: 'NTPC', name: 'NTPC Ltd' },
        { code: 'ONGC', name: 'Oil & Natural Gas Corpn Ltd' },
        { code: 'POWERGRID', name: 'Power Grid Corp. of India Ltd' },
        { code: 'BAJFINANCE', name: 'Bajaj Finance Ltd' },
        { code: 'LT', name: 'Larsen & Toubro Ltd' },
        { code: 'HCLTECH', name: 'HCL Technologies Ltd' },
        { code: 'WIPRO', name: 'Wipro Ltd' },
        { code: 'ASIANPAINT', name: 'Asian Paints Ltd' },
        { code: 'BHARTIARTL', name: 'Bharti Airtel Ltd' },
        { code: 'SUNPHARMA', name: 'Sun Pharmaceutical Inds. Ltd' },
        { code: 'ULTRACEMCO', name: 'UltraTech Cement Ltd' },
        { code: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd' },
        { code: 'ADANIENT', name: 'Adani Enterprises Ltd' },
        { code: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd' },
        { code: 'ITC', name: 'ITC Ltd' },
        { code: 'TATACONSUM', name: 'Tata Consumer Products Ltd' },
        { code: 'GAIL', name: 'GAIL (India) Ltd' },
        { code: 'COALINDIA', name: 'Coal India Ltd' },
        { code: 'DMART', name: 'Avenue Supermarts Ltd' },
        { code: 'PIDILITIND', name: 'Pidilite Industries Ltd' },
        { code: 'IRCTC', name: 'Indian Railway Catering & Tourism Corp. Ltd' },
        { code: 'DABUR', name: 'Dabur India Ltd' },
        { code: 'SRF', name: 'SRF Ltd' },
        { code: 'GODREJCP', name: 'Godrej Consumer Products Ltd' },
        { code: 'LICI', name: 'Life Insurance Corp. of India' },
        { code: 'BPCL', name: 'Bharat Petroleum Corp. Ltd' },
        { code: 'IOC', name: 'Indian Oil Corp. Ltd' },
        { code: 'HINDPETRO', name: 'Hindustan Petroleum Corp. Ltd' },
        { code: 'GRASIM', name: 'Grasim Industries Ltd' },
        { code: 'HDFCLIFE', name: 'HDFC Life Insurance Co. Ltd' },
        { code: 'INDUSINDBK', name: 'IndusInd Bank Ltd' },
        { code: 'JSWSTEEL', name: 'JSW Steel Ltd' },
        { code: 'NESTLEIND', name: 'Nestle India Ltd' },
        { code: 'WIPRO', name: 'Wipro Ltd' },
        { code: 'ZEEL', name: 'Zee Entertainment Ent. Ltd' },
        { code: 'BERGEPAINT', name: 'Berger Paints India Ltd' },
        // Add more stocks to complete the Top 100 list...
    ];

    stockInput.addEventListener('input', (e) => {
        const query = e.target.value.toUpperCase();
        stockDropdown.innerHTML = '';
        
        if (query.length === 0) {
            stockDropdown.style.display = 'none';
            return;
        }

        const filteredStocks = topStocks.filter(stock => 
            stock.code.includes(query) || stock.name.toUpperCase().includes(query)
        ).slice(0, 10); // Show only top 10 matches

        if (filteredStocks.length > 0) {
            filteredStocks.forEach(stock => {
                const item = document.createElement('div');
                item.classList.add('stock-item');
                item.innerHTML = `<span class="stock-code">${stock.code}</span><span class="stock-name">${stock.name}</span>`;
                
                item.addEventListener('click', () => {
                    stockInput.value = stock.name; // Fill input with stock name
                    stockDropdown.style.display = 'none';
                });

                stockDropdown.appendChild(item);
            });
            stockDropdown.style.display = 'block';
        } else {
            stockDropdown.style.display = 'none';
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!stockInput.contains(e.target) && !stockDropdown.contains(e.target)) {
            stockDropdown.style.display = 'none';
        }
    });


    // ----------------------------------------------------
    // 3. Telegram Redirect on Button Click
    // ----------------------------------------------------
    const checkNowBtn = document.getElementById('check-now-btn');
    const TELEGRAM_URL = 'YOUR_TELEGRAM_CHANNEL_INVITE_LINK'; // Replace this with your actual Telegram link (e.g., https://t.me/yourchannelname)

    checkNowBtn.addEventListener('click', () => {
        // Optional: Perform any validation or logging before redirect
        const stockValue = stockInput.value.trim();
        console.log('Checking stock:', stockValue);

        // Redirect to the Telegram Channel
        window.location.href = TELEGRAM_URL;
    });


    // ----------------------------------------------------
    // 4. Simple Countdown Timer Logic
    // ----------------------------------------------------
    const countdownTargetDate = new Date();
    // Set a random time 9 hours, 19 minutes and 35 seconds from now (for the look)
    countdownTargetDate.setHours(countdownTargetDate.getHours() + 9);
    countdownTargetDate.setMinutes(countdownTargetDate.getMinutes() + 19);
    countdownTargetDate.setSeconds(countdownTargetDate.getSeconds() + 35);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownTargetDate.getTime() - now;

        if (distance < 0) {
            // Timer expired, set to all zeros
            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            return;
        }

        // Calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result, ensuring two digits (e.g., "09")
        document.getElementById("days").textContent = String(days).padStart(2, '0');
        document.getElementById("hours").textContent = String(hours).padStart(2, '0');
        document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
        document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
    }

    // Initial call
    updateCountdown(); 
    // Update the count down every 1 second
    setInterval(updateCountdown, 1000); 
});
