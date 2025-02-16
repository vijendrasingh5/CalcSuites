function loadInterestRateCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Interest Rate Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="rate-type" onchange="toggleRateInputs()">
                        <option value="effective">Effective Annual Rate (EAR)</option>
                        <option value="nominal">Nominal Rate to EAR</option>
                        <option value="loan">Loan Interest Rate</option>
                        <option value="investment">Required Rate of Return</option>
                    </select>
                </div>
                
                <div id="rate-inputs">
                    <!-- Effective Annual Rate Inputs -->
                    <div class="effective-input">
                        <div class="mb-3">
                            <label class="form-label">Present Value</label>
                            <div class="input-group">
                                <span class="input-group-text">₹</span>
                                <input type="number" class="form-control" id="ear-pv" placeholder="Enter present value">
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Future Value</label>
                            <div class="input-group">
                                <span class="input-group-text">₹</span>
                                <input type="number" class="form-control" id="ear-fv" placeholder="Enter future value">
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Time Period</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="ear-time" placeholder="Enter time period">
                                <select class="form-select" id="ear-time-unit">
                                    <option value="years">Years</option>
                                    <option value="months">Months</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Nominal Rate Inputs -->
                    <div class="nominal-input" style="display: none;">
                        <div class="mb-3">
                            <label class="form-label">Nominal Annual Rate (%)</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="nominal-rate" step="0.1" placeholder="Enter nominal rate">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Compounding Frequency</label>
                            <select class="form-select" id="nominal-frequency">
                                <option value="365">Daily</option>
                                <option value="52">Weekly</option>
                                <option value="12">Monthly</option>
                                <option value="4">Quarterly</option>
                                <option value="2">Semi-Annually</option>
                                <option value="1">Annually</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Loan Rate Inputs -->
                    <div class="loan-input" style="display: none;">
                        <div class="mb-3">
                            <label class="form-label">Loan Amount</label>
                            <div class="input-group">
                                <span class="input-group-text">₹</span>
                                <input type="number" class="form-control" id="loan-amount" placeholder="Enter loan amount">
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Monthly Payment</label>
                            <div class="input-group">
                                <span class="input-group-text">₹</span>
                                <input type="number" class="form-control" id="loan-payment" placeholder="Enter monthly payment">
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Loan Term</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="loan-term" placeholder="Enter loan term">
                                <select class="form-select" id="loan-term-unit">
                                    <option value="years">Years</option>
                                    <option value="months">Months</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Investment Rate Inputs -->
                    <div class="investment-input" style="display: none;">
                        <div class="mb-3">
                            <label class="form-label">Risk-free Rate (%)</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="risk-free-rate" step="0.1" placeholder="Enter risk-free rate">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Market Return (%)</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="market-return" step="0.1" placeholder="Enter market return">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Beta (Market Sensitivity)</label>
                            <input type="number" class="form-control" id="beta" step="0.1" placeholder="Enter beta value">
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateRate()">Calculate Rate</button>
            </div>
            
            <div class="col-md-6">
                <div id="rate-result" class="result-box mt-3" style="display: none;">
                    <h4>Interest Rate Results</h4>
                    
                    <div class="mb-3">
                        <h5>Calculated Rate</h5>
                        <p id="rate-final-result" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Calculation Details</h5>
                        <ul class="list-unstyled" id="rate-details"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Comparative Analysis</h5>
                        <div class="table-responsive">
                            <table class="table table-sm" id="rate-comparison">
                                <thead>
                                    <tr>
                                        <th>Rate Type</th>
                                        <th>Value</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="rate-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    toggleRateInputs();
}

function toggleRateInputs() {
    const type = document.getElementById('rate-type').value;
    const inputTypes = ['effective', 'nominal', 'loan', 'investment'];
    
    inputTypes.forEach(inputType => {
        const elements = document.querySelectorAll(`.${inputType}-input`);
        elements.forEach(element => {
            element.style.display = type === inputType ? 'block' : 'none';
        });
    });
}

function calculateRate() {
    const type = document.getElementById('rate-type').value;
    let rate;
    let details = [];
    let comparisons = [];
    
    switch (type) {
        case 'effective':
            rate = calculateEffectiveRate();
            break;
        case 'nominal':
            rate = calculateNominalToEAR();
            break;
        case 'loan':
            rate = calculateLoanRate();
            break;
        case 'investment':
            rate = calculateRequiredReturn();
            break;
    }
    
    displayRateResults(type, rate, details, comparisons);
}

function calculateEffectiveRate() {
    const pv = parseFloat(document.getElementById('ear-pv').value);
    const fv = parseFloat(document.getElementById('ear-fv').value);
    const time = parseFloat(document.getElementById('ear-time').value);
    const timeUnit = document.getElementById('ear-time-unit').value;
    
    if (isNaN(pv) || isNaN(fv) || isNaN(time)) {
        alert('Please enter valid numbers for all fields');
        return null;
    }
    
    // Convert time to years if needed
    const years = timeUnit === 'months' ? time / 12 : time;
    
    // Calculate effective annual rate
    const ear = Math.pow(fv / pv, 1 / years) - 1;
    
    return {
        rate: ear * 100,
        details: [
            { label: 'Present Value', value: `₹${pv.toFixed(2)}` },
            { label: 'Future Value', value: `₹${fv.toFixed(2)}` },
            { label: 'Time Period', value: `${time} ${timeUnit}` },
            { label: 'Effective Annual Rate', value: `${(ear * 100).toFixed(2)}%` }
        ],
        comparisons: [
            { type: 'Monthly Rate', value: (Math.pow(1 + ear, 1/12) - 1) * 100, description: 'Equivalent monthly rate' },
            { type: 'Quarterly Rate', value: (Math.pow(1 + ear, 1/4) - 1) * 100, description: 'Equivalent quarterly rate' },
            { type: 'Semi-Annual Rate', value: (Math.pow(1 + ear, 1/2) - 1) * 100, description: 'Equivalent semi-annual rate' }
        ]
    };
}

function calculateNominalToEAR() {
    const nominal = parseFloat(document.getElementById('nominal-rate').value);
    const frequency = parseInt(document.getElementById('nominal-frequency').value);
    
    if (isNaN(nominal)) {
        alert('Please enter a valid nominal rate');
        return null;
    }
    
    // Calculate EAR
    const ear = Math.pow(1 + nominal / (100 * frequency), frequency) - 1;
    
    return {
        rate: ear * 100,
        details: [
            { label: 'Nominal Rate', value: `${nominal.toFixed(2)}%` },
            { label: 'Compounding Frequency', value: frequency + ' times per year' },
            { label: 'Effective Annual Rate', value: `${(ear * 100).toFixed(2)}%` }
        ],
        comparisons: [
            { type: 'Daily EAR', value: (Math.pow(1 + nominal/(100 * 365), 365) - 1) * 100, description: 'Daily compounding' },
            { type: 'Monthly EAR', value: (Math.pow(1 + nominal/(100 * 12), 12) - 1) * 100, description: 'Monthly compounding' },
            { type: 'Quarterly EAR', value: (Math.pow(1 + nominal/(100 * 4), 4) - 1) * 100, description: 'Quarterly compounding' }
        ]
    };
}

function calculateLoanRate() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const payment = parseFloat(document.getElementById('loan-payment').value);
    const term = parseFloat(document.getElementById('loan-term').value);
    const termUnit = document.getElementById('loan-term-unit').value;
    
    if (isNaN(amount) || isNaN(payment) || isNaN(term)) {
        alert('Please enter valid numbers for all fields');
        return null;
    }
    
    // Convert term to months if needed
    const months = termUnit === 'years' ? term * 12 : term;
    
    // Use Newton's method to find the monthly interest rate
    let rate = 0.1;
    const tolerance = 0.0000001;
    let iteration = 0;
    const maxIterations = 100;
    
    do {
        const oldRate = rate;
        const monthlyRate = rate / 12;
        const pvif = Math.pow(1 + monthlyRate, months);
        const pv = payment * ((pvif - 1) / (monthlyRate * pvif));
        const diff = amount - pv;
        rate = rate + diff / (pv / rate);
        iteration++;
        
        if (Math.abs(rate - oldRate) < tolerance) break;
    } while (iteration < maxIterations);
    
    return {
        rate: rate * 100,
        details: [
            { label: 'Loan Amount', value: `₹${amount.toFixed(2)}` },
            { label: 'Monthly Payment', value: `₹${payment.toFixed(2)}` },
            { label: 'Loan Term', value: `${term} ${termUnit}` },
            { label: 'Annual Interest Rate', value: `${(rate * 100).toFixed(2)}%` }
        ],
        comparisons: [
            { type: 'Monthly Rate', value: (rate / 12) * 100, description: 'Monthly interest rate' },
            { type: 'APR', value: rate * 100, description: 'Annual Percentage Rate' },
            { type: 'EAR', value: (Math.pow(1 + rate/12, 12) - 1) * 100, description: 'Effective Annual Rate' }
        ]
    };
}

function calculateRequiredReturn() {
    const riskFree = parseFloat(document.getElementById('risk-free-rate').value);
    const marketReturn = parseFloat(document.getElementById('market-return').value);
    const beta = parseFloat(document.getElementById('beta').value);
    
    if (isNaN(riskFree) || isNaN(marketReturn) || isNaN(beta)) {
        alert('Please enter valid numbers for all fields');
        return null;
    }
    
    // Calculate required return using CAPM
    const requiredReturn = riskFree + beta * (marketReturn - riskFree);
    
    return {
        rate: requiredReturn,
        details: [
            { label: 'Risk-free Rate', value: `${riskFree.toFixed(2)}%` },
            { label: 'Market Return', value: `${marketReturn.toFixed(2)}%` },
            { label: 'Beta', value: beta.toFixed(2) },
            { label: 'Required Return', value: `${requiredReturn.toFixed(2)}%` }
        ],
        comparisons: [
            { type: 'Risk Premium', value: (marketReturn - riskFree), description: 'Market risk premium' },
            { type: 'Beta-adjusted Premium', value: beta * (marketReturn - riskFree), description: 'Asset-specific risk premium' },
            { type: 'Total Required Return', value: requiredReturn, description: 'CAPM required return' }
        ]
    };
}

function displayRateResults(type, results, details, comparisons) {
    if (!results) return;
    
    document.getElementById('rate-result').style.display = 'block';
    
    // Display final rate
    document.getElementById('rate-final-result').textContent = 
        `${results.rate.toFixed(2)}%`;
    
    // Display details
    document.getElementById('rate-details').innerHTML = 
        results.details.map(detail => 
            `<li><strong>${detail.label}:</strong> ${detail.value}</li>`
        ).join('');
    
    // Display comparisons
    const tbody = document.getElementById('rate-comparison').querySelector('tbody');
    tbody.innerHTML = results.comparisons.map(comp => `
        <tr>
            <td>${comp.type}</td>
            <td>${comp.value.toFixed(2)}%</td>
            <td>${comp.description}</td>
        </tr>
    `).join('');
    
    // Create comparison chart
    const ctx = document.getElementById('rate-chart').getContext('2d');
    if (window.rateChart) window.rateChart.destroy();
    
    const chartData = {
        labels: results.comparisons.map(comp => comp.type),
        datasets: [{
            label: 'Interest Rates',
            data: results.comparisons.map(comp => comp.value),
            backgroundColor: [
                '#36A2EB',
                '#FF6384',
                '#FFCE56'
            ]
        }]
    };
    
    window.rateChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Rate Comparison'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => value + '%'
                    }
                }
            }
        }
    });
}
