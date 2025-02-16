function loadFinanceCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Finance Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="finance-type" onchange="toggleFinanceInputs()">
                        <option value="pv">Present Value (PV)</option>
                        <option value="fv">Future Value (FV)</option>
                        <option value="pmt">Payment (PMT)</option>
                        <option value="nper">Number of Periods (NPER)</option>
                        <option value="rate">Interest Rate (RATE)</option>
                    </select>
                </div>
                
                <div id="finance-inputs">
                    <div class="mb-3 pv-input fv-input pmt-input nper-input">
                        <label class="form-label">Interest Rate (% per period)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="finance-rate" step="0.1" placeholder="Enter interest rate">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                    
                    <div class="mb-3 pv-input fv-input pmt-input rate-input">
                        <label class="form-label">Number of Periods</label>
                        <input type="number" class="form-control" id="finance-nper" placeholder="Enter number of periods">
                    </div>
                    
                    <div class="mb-3 nper-input rate-input">
                        <label class="form-label">Payment Amount</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control" id="finance-pmt" placeholder="Enter payment amount">
                        </div>
                    </div>
                    
                    <div class="mb-3 pmt-input nper-input rate-input">
                        <label class="form-label">Present Value</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control" id="finance-pv" placeholder="Enter present value">
                        </div>
                    </div>
                    
                    <div class="mb-3 pmt-input nper-input rate-input">
                        <label class="form-label">Future Value</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control" id="finance-fv" placeholder="Enter future value">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Payment Timing</label>
                        <select class="form-select" id="finance-timing">
                            <option value="end">End of Period</option>
                            <option value="beginning">Beginning of Period</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Compounding Frequency</label>
                        <select class="form-select" id="finance-frequency">
                            <option value="12">Monthly</option>
                            <option value="4">Quarterly</option>
                            <option value="2">Semi-Annually</option>
                            <option value="1">Annually</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateFinance()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="finance-result" class="result-box mt-3" style="display: none;">
                    <h4>Financial Calculation Results</h4>
                    
                    <div class="mb-3">
                        <h5>Result</h5>
                        <p id="finance-final-result" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Calculation Details</h5>
                        <ul class="list-unstyled" id="finance-details"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Amortization Schedule</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Payment</th>
                                        <th>Interest</th>
                                        <th>Principal</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody id="finance-schedule"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="finance-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    toggleFinanceInputs();
}

function toggleFinanceInputs() {
    const type = document.getElementById('finance-type').value;
    const inputs = ['pv', 'fv', 'pmt', 'nper', 'rate'];
    
    inputs.forEach(input => {
        const elements = document.querySelectorAll(`.${input}-input`);
        elements.forEach(element => {
            element.style.display = type === input ? 'none' : 'block';
        });
    });
}

function calculateFinance() {
    const type = document.getElementById('finance-type').value;
    const rate = parseFloat(document.getElementById('finance-rate').value) || 0;
    const nper = parseFloat(document.getElementById('finance-nper').value) || 0;
    const pmt = parseFloat(document.getElementById('finance-pmt').value) || 0;
    const pv = parseFloat(document.getElementById('finance-pv').value) || 0;
    const fv = parseFloat(document.getElementById('finance-fv').value) || 0;
    const timing = document.getElementById('finance-timing').value;
    const frequency = parseInt(document.getElementById('finance-frequency').value);
    
    const pmtType = timing === 'beginning' ? 1 : 0;
    const ratePerPeriod = rate / (100 * frequency);
    
    let result;
    let schedule = [];
    
    switch (type) {
        case 'pv':
            result = calculatePV(ratePerPeriod, nper * frequency, pmt, fv, pmtType);
            schedule = generateSchedule(result, ratePerPeriod, nper * frequency, pmt, pmtType);
            break;
        case 'fv':
            result = calculateFV(ratePerPeriod, nper * frequency, pmt, pv, pmtType);
            schedule = generateSchedule(pv, ratePerPeriod, nper * frequency, pmt, pmtType);
            break;
        case 'pmt':
            result = calculatePMT(ratePerPeriod, nper * frequency, pv, fv, pmtType);
            schedule = generateSchedule(pv, ratePerPeriod, nper * frequency, result, pmtType);
            break;
        case 'nper':
            result = calculateNPER(ratePerPeriod, pmt, pv, fv, pmtType) / frequency;
            schedule = generateSchedule(pv, ratePerPeriod, Math.ceil(result * frequency), pmt, pmtType);
            break;
        case 'rate':
            result = calculateRATE(nper * frequency, pmt, pv, fv, pmtType) * 100 * frequency;
            schedule = generateSchedule(pv, result/(100 * frequency), nper * frequency, pmt, pmtType);
            break;
    }
    
    displayFinanceResults(type, result, schedule);
}

function calculatePV(rate, nper, pmt, fv, type) {
    if (rate === 0) {
        return -(fv + pmt * nper);
    }
    
    const pvifa = (1 - Math.pow(1 + rate, -nper)) / rate;
    const pv = -(fv * Math.pow(1 + rate, -nper) + pmt * (type ? (1 + rate) : 1) * pvifa);
    return pv;
}

function calculateFV(rate, nper, pmt, pv, type) {
    if (rate === 0) {
        return -(pv + pmt * nper);
    }
    
    const fvifa = (Math.pow(1 + rate, nper) - 1) / rate;
    const fv = -(pv * Math.pow(1 + rate, nper) + pmt * (type ? (1 + rate) : 1) * fvifa);
    return fv;
}

function calculatePMT(rate, nper, pv, fv, type) {
    if (rate === 0) {
        return -(pv + fv) / nper;
    }
    
    const pvifa = (1 - Math.pow(1 + rate, -nper)) / rate;
    const pmt = -(fv * Math.pow(1 + rate, -nper) + pv) / ((type ? (1 + rate) : 1) * pvifa);
    return pmt;
}

function calculateNPER(rate, pmt, pv, fv, type) {
    if (rate === 0) {
        return -(pv + fv) / pmt;
    }
    
    const t1 = pmt * (type ? (1 + rate) : 1) / rate;
    const t2 = Math.log((t1 - fv) / (t1 + pv));
    const t3 = Math.log(1 + rate);
    return t2 / t3;
}

function calculateRATE(nper, pmt, pv, fv, type) {
    let rate = 0.1;
    let iteration = 0;
    const maxIterations = 100;
    const tolerance = 0.000001;
    
    do {
        const pvifa = (1 - Math.pow(1 + rate, -nper)) / rate;
        const f = fv + pv * Math.pow(1 + rate, nper) + pmt * (type ? (1 + rate) : 1) * pvifa;
        
        if (Math.abs(f) < tolerance) {
            return rate;
        }
        
        const slope = nper * pv * Math.pow(1 + rate, nper - 1) + 
                     pmt * type * pvifa + 
                     pmt * (type ? (1 + rate) : 1) * (-nper * Math.pow(1 + rate, -nper - 1)) / (rate * rate) +
                     pmt * (type ? (1 + rate) : 1) * pvifa / rate;
        
        rate = rate - f / slope;
        iteration++;
        
    } while (iteration < maxIterations);
    
    return rate;
}

function generateSchedule(pv, rate, nper, pmt, type) {
    const schedule = [];
    let balance = Math.abs(pv);
    
    for (let period = 1; period <= nper; period++) {
        const interest = balance * rate;
        const principal = Math.abs(pmt) - interest;
        balance = Math.max(0, balance - principal);
        
        schedule.push({
            period,
            payment: Math.abs(pmt),
            interest,
            principal,
            balance
        });
        
        if (balance === 0) break;
    }
    
    return schedule;
}

function displayFinanceResults(type, result, schedule) {
    document.getElementById('finance-result').style.display = 'block';
    
    // Display result
    let resultLabel;
    let resultValue;
    
    switch (type) {
        case 'pv':
            resultLabel = 'Present Value';
            resultValue = `₹${Math.abs(result).toFixed(2)}`;
            break;
        case 'fv':
            resultLabel = 'Future Value';
            resultValue = `₹${Math.abs(result).toFixed(2)}`;
            break;
        case 'pmt':
            resultLabel = 'Payment Amount';
            resultValue = `₹${Math.abs(result).toFixed(2)}`;
            break;
        case 'nper':
            resultLabel = 'Number of Periods';
            resultValue = `${result.toFixed(2)} periods`;
            break;
        case 'rate':
            resultLabel = 'Interest Rate';
            resultValue = `${result.toFixed(2)}%`;
            break;
    }
    
    document.getElementById('finance-final-result').innerHTML = `
        <span class="text-muted">${resultLabel}:</span> ${resultValue}
    `;
    
    // Display schedule
    const tbody = document.getElementById('finance-schedule');
    tbody.innerHTML = schedule.map(data => `
        <tr>
            <td>${data.period}</td>
            <td>₹${data.payment.toFixed(2)}</td>
            <td>₹${data.interest.toFixed(2)}</td>
            <td>₹${data.principal.toFixed(2)}</td>
            <td>₹${data.balance.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Create chart
    const ctx = document.getElementById('finance-chart').getContext('2d');
    if (window.financeChart) window.financeChart.destroy();
    
    const labels = schedule.map(data => `Period ${data.period}`);
    const balances = schedule.map(data => data.balance);
    const interests = schedule.map(data => data.interest);
    const principals = schedule.map(data => data.principal);
    
    window.financeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Balance',
                    data: balances,
                    borderColor: '#36A2EB',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Interest',
                    data: interests,
                    borderColor: '#FF6384',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Principal',
                    data: principals,
                    borderColor: '#FFCE56',
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Payment Breakdown Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '₹' + value.toFixed(0)
                    }
                }
            }
        }
    });
}
