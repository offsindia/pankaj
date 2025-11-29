document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Refresh Counter and Error 404 Logic
    // ----------------------------------------------------
    const REFRESH_LIMIT = 3; // 4th refresh will show 404
    const ERROR_KEY = 'refresh_count';

    let count = parseInt(sessionStorage.getItem(ERROR_KEY)) || 0;
    count++;
    sessionStorage.setItem(ERROR_KEY, count);

    const mainContent = document.getElementById('main-content');
    const errorSection = document.getElementById('error-section');

    if (count > REFRESH_LIMIT) {
        // Show 404 Error
        mainContent.style.display = 'none';
        errorSection.style.display = 'flex'; 
    } else {
        // Show Main Content
        mainContent.style.display = 'block';
        errorSection.style.display = 'none';
    }


    // ----------------------------------------------------
    // 2. Stock Data and Autocomplete (Top 100 Stoks)
    // ----------------------------------------------------
    const stockInput = document.getElementById('stock-input');
    const stockDropdown = document.getElementById('stock-dropdown');

    const topStocks = [
        { code: 'RELIANCE', name: 'Reliance Industries Ltd' },
        { code: 'HDFCBANK', name: 'HDFC Bank Ltd' },
        { code: 'BHARTIARTL', name: 'Bharti Airtel Ltd' },
        { code: 'TCS', name: 'Tata Consultancy Services Ltd' },
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
        { code: 'DABUR', name: 'Dabur India Ltd' },
        { code: 'PIDILITIND', name: 'Pidilite Industries Ltd' },
        { code: 'SRF', name: 'SRF Ltd' },
        { code: 'GODREJCP', name: 'Godrej Consumer Products Ltd' },
        { code: 'BERGEPAINT', name: 'Berger Paints India Ltd' },
        { code: 'IRCTC', name: 'Indian Railway Catering & Tourism Corp. Ltd' },
        { code: 'ZEEL', name: 'Zee Entertainment Ent. Ltd' },
        { code: 'TATAMOTORS', name: 'Tata Motors Ltd' },
        { code: 'TATACONSUM', name: 'Tata Consumer Products Ltd' },
        { code: 'TATASTEEL', name: 'Tata Steel Ltd' },
        { code: 'GAIL', name: 'GAIL (India) Ltd' },
        { code: 'COALINDIA', name: 'Coal India Ltd' },
        { code: 'BPCL', name: 'Bharat Petroleum Corp. Ltd' },
        { code: 'IOC', name: 'Indian Oil Corp. Ltd' },
        { code: 'HINDPETRO', name: 'Hindustan Petroleum Corp. Ltd' },
        { code: 'GRASIM', name: 'Grasim Industries Ltd' },
        { code: 'LICI', name: 'Life Insurance Corp. of India' },
        { code: 'VEDANTA', name: 'Vedanta Ltd' },
        { code: 'HINDALCO', name: 'Hindalco Industries Ltd' },
        { code: 'MINDTREE', name: 'LTI Mindtree Ltd' },
        { code: 'BIOCON', name: 'Biocon Ltd' },
        { code: 'SAIL', name: 'Steel Authority of India Ltd' },
        { code: 'TVSMOTOR', name: 'TVS Motor Company Ltd' },
        { code: 'BEL', name: 'Bharat Electronics Ltd' },
        { code: 'HAL', name: 'Hindustan Aeronautics Ltd' },
        { code: 'DELHIVERY', name: 'Delhivery Ltd' },
        { code: 'ZOMATO', name: 'Zomato Ltd' },
        { code: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd' },
        { code: 'PAYTM', name: 'One 97 Communications Ltd' },
        { code: 'SUZLON', name: 'Suzlon Energy Ltd' },
        { code: 'TITAGARH', name: 'Titagarh Rail Systems Ltd' }, // Added Titagarh as seen in video list
        { code: 'EICHERMOT', name: 'Eicher Motors Ltd' },
        { code: 'GODREJIND', name: 'Godrej Industries Ltd' },
        { code: 'DLF', name: 'DLF Ltd' },
        { code: 'CIPLA', name: 'Cipla Ltd' },
        { code: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Ltd' },
        { code: 'APOLLOHOS', name: 'Apollo Hospitals Enterprise Ltd' },
        { code: 'HDFC', name: 'Housing Development Finance Corp. Ltd' },
        { code: 'TRENT', name: 'Trent Ltd' },
        { code: 'VOLTAS', name: 'Voltas Ltd' },
        { code: 'CUMMINSIND', name: 'Cummins India Ltd' },
        { code: 'AARTIIND', name: 'Aarti Industries Ltd' },
        { code: 'BAJAJHLDNG', name: 'Bajaj Holdings & Investment Ltd' },
        { code: 'BHARATFORG', name: 'Bharat Forge Ltd' },
        { code: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd' },
        { code: 'RECLTD', name: 'REC Ltd' },
        { code: 'PFC', name: 'Power Finance Corporation Ltd' },
        { code: 'SHREECEM', name: 'Shree Cement Ltd' },
        { code: 'ATGL', name: 'Adani Total Gas Ltd' },
        { code: 'ADANIENS', name: 'Adani Energy Solutions Ltd' },
        { code: 'POLYCAB', name: 'Polycab India Ltd' },
        { code: 'CHOLAFIN', name: 'Cholamandalam Investment and Finance Company Ltd' },
        { code: 'MUTHOOTFIN', name: 'Muthoot Finance Ltd' },
        { code: 'MCDOWELL-N', name: 'United Spirits Ltd' },
        { code: 'HDFCAMC', name: 'HDFC Asset Management Company Ltd' },
        { code: 'ZFCVINDIA', name: 'ZF Commercial Vehicle Control Systems India Ltd' }
        // 100 stocks completed.
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
        ).slice(0, 10); 

        if (filteredStocks.length > 0) {
            filteredStocks.forEach(stock => {
                const item = document.createElement('div');
                item.classList.add('stock-item');
                item.innerHTML = `<span class="stock-code">${stock.code}</span><span class="stock-name">${stock.name}</span>`;
                
                item.addEventListener('click', () => {
                    stockInput.value = stock.name; 
                    stockDropdown.style.display = 'none';
                });

                stockDropdown.appendChild(item);
            });
            stockDropdown.style.display = 'block';
        } else {
            stockDropdown.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!stockInput.contains(e.target) && !stockDropdown.contains(e.target)) {
            stockDropdown.style.display = 'none';
        }
    });


    // ----------------------------------------------------
    // 3. Telegram Redirect on Button Click
    // ----------------------------------------------------
    const checkNowBtn = document.getElementById('check-now-btn');
    // **IMPORTANT: Replace this with your actual Telegram link**
    const TELEGRAM_URL = 'YOUR_TELEGRAM_CHANNEL_INVITE_LINK'; 

    checkNowBtn.addEventListener('click', () => {
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
            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(days).padStart(2, '0');
        document.getElementById("hours").textContent = String(hours).padStart(2, '0');
        document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
        document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown(); 
    setInterval(updateCountdown, 1000); 
});
