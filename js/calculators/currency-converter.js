const currencies = {
    USD: { name: 'US Dollar', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
    GBP: { name: 'British Pound', symbol: '£' },
    JPY: { name: 'Japanese Yen', symbol: '¥' },
    AUD: { name: 'Australian Dollar', symbol: 'A$' },
    CAD: { name: 'Canadian Dollar', symbol: 'C$' },
    CHF: { name: 'Swiss Franc', symbol: 'Fr' },
    CNY: { name: 'Chinese Yuan', symbol: '¥' },
    INR: { name: 'Indian Rupee', symbol: '₹' },
    NZD: { name: 'New Zealand Dollar', symbol: 'NZ$' }
};

// Sample exchange rates (these should be updated from an API in production)
const exchangeRates = {
    USD: 1.00,
    EUR: 0.83,
    GBP: 0.72,
    JPY: 110.25,
    AUD: 1.35,
    CAD: 1.25,
    CHF: 0.91,
    CNY: 6.45,
    INR: 74.50,
    NZD: 1.42
};

function loadCurrencyConverter() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Currency Converter');
    
    const calculatorHTML = `
        <div class="alert alert-info">
            Note: Using sample exchange rates for demonstration. In production, rates should be fetched from a currency API.
        </div>
        <div class="row">
            <div class="col-md-5">
                <div class="mb-3">
                    <label for="from-amount" class="form-label">Amount</label>
                    <div class="input-group">
                        <span class="input-group-text" id="from-symbol">$</span>
                        <input type="number" class="form-control" id="from-amount" oninput="convertCurrency()">
                    </div>
                </div>
                <select class="form-select" id="from-currency" onchange="updateCurrencySymbols(); convertCurrency();">
                    ${Object.entries(currencies).map(([code, {name}]) => 
                        `<option value="${code}">${code} - ${name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="col-md-2 d-flex align-items-center justify-content-center">
                <button class="btn btn-outline-primary" onclick="swapCurrencies()">
                    ⇄
                </button>
            </div>
            <div class="col-md-5">
                <div class="mb-3">
                    <label for="to-amount" class="form-label">Converted Amount</label>
                    <div class="input-group">
                        <span class="input-group-text" id="to-symbol">€</span>
                        <input type="number" class="form-control" id="to-amount" readonly>
                    </div>
                </div>
                <select class="form-select" id="to-currency" onchange="updateCurrencySymbols(); convertCurrency();">
                    ${Object.entries(currencies).map(([code, {name}]) => 
                        `<option value="${code}" ${code === 'EUR' ? 'selected' : ''}>${code} - ${name}</option>`
                    ).join('')}
                </select>
            </div>
        </div>
        <div class="result-box mt-3">
            <div id="exchange-rate-display"></div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    updateCurrencySymbols();
    convertCurrency();
}

function updateCurrencySymbols() {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    
    document.getElementById('from-symbol').textContent = currencies[fromCurrency].symbol;
    document.getElementById('to-symbol').textContent = currencies[toCurrency].symbol;
}

function convertCurrency() {
    const fromAmount = parseFloat(document.getElementById('from-amount').value) || 0;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    
    const result = (fromAmount * toRate) / fromRate;
    document.getElementById('to-amount').value = formatNumber(result, 2);
    
    // Update exchange rate display
    const rate = (toRate / fromRate);
    document.getElementById('exchange-rate-display').innerHTML = `
        <strong>Exchange Rate:</strong><br>
        1 ${fromCurrency} = ${formatNumber(rate, 4)} ${toCurrency}<br>
        1 ${toCurrency} = ${formatNumber(1/rate, 4)} ${fromCurrency}
    `;
}

function swapCurrencies() {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const fromAmount = document.getElementById('from-amount');
    const toAmount = document.getElementById('to-amount');
    
    [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
    [fromAmount.value, toAmount.value] = [toAmount.value, fromAmount.value];
    
    updateCurrencySymbols();
    convertCurrency();
}
