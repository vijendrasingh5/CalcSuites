const currencies = {
    USD: { name: 'US Dollar', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
    GBP: { name: 'British Pound', symbol: '£' },
    JPY: { name: 'Japanese Yen', symbol: '¥' }
};

const exchangeRates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 148.63
};

function initCurrencyConverter() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Currency Converter');
    
    const calculatorHTML = `
        <div class="alert alert-info">
            Note: Using sample exchange rates for demonstration. In production, rates should be fetched from a currency API.
        </div>
        <div class="row">
            <div class="col-md-5">
                <div class="mb-3">
                    <label for="amount" class="form-label">Amount</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="amount" oninput="convertCurrency()">
                        <select class="form-select" id="from-currency" onchange="convertCurrency();">
                            ${Object.keys(exchangeRates).map(currency => 
                                `<option value="${currency}">${currency}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-md-2 d-flex align-items-center justify-content-center">
                <i class="fas fa-arrow-right"></i>
            </div>
            <div class="col-md-5">
                <div class="mb-3">
                    <label for="result" class="form-label">Converted Amount</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="result" readonly>
                        <select class="form-select" id="to-currency" onchange="convertCurrency();">
                            ${Object.keys(exchangeRates).map(currency => 
                                `<option value="${currency}">${currency}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="result-box mt-3">
            <div id="exchange-rate-display"></div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    convertCurrency();
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    
    if (!amount) {
        document.getElementById('result').value = 'Please enter a valid amount';
        return;
    }

    const rate = exchangeRates[to] / exchangeRates[from];
    const result = amount * rate;
    
    document.getElementById('result').value = result.toFixed(2);
}
