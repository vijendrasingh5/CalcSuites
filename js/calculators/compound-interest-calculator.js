function loadCompoundInterestCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Compound Interest Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Principal Amount</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="ci-principal" placeholder="Enter principal amount">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Annual Interest Rate (%)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="ci-rate" step="0.1" placeholder="Enter interest rate">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Time Period</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="ci-time" placeholder="Enter time period">
                        <select class="form-select" id="ci-time-unit">
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                            <option value="days">Days</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Compounding Frequency</label>
                    <select class="form-select" id="ci-frequency">
                        <option value="1">Annually</option>
                        <option value="2">Semi-Annually</option>
                        <option value="4">Quarterly</option>
                        <option value="12">Monthly</option>
                        <option value="365">Daily</option>
                        <option value="continuous">Continuous</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="ci-additional" onchange="toggleAdditionalDeposits()">
                        <label class="form-check-label">Include Additional Deposits</label>
                    </div>
                </div>
                
                <div id="additional-deposits" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Regular Deposit Amount</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control" id="ci-deposit" placeholder="Enter deposit amount">
                            <select class="form-select" id="ci-deposit-frequency">
                                <option value="12">Monthly</option>
                                <option value="4">Quarterly</option>
                                <option value="2">Semi-Annually</option>
                                <option value="1">Annually</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateCompoundInterest()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="ci-result" class="result-box mt-3" style="display: none;">
                    <h4>Compound Interest Results</h4>
                    
                    <div class="mb-3">
                        <h5>Final Amount</h5>
                        <p id="ci-final-amount" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Calculation Summary</h5>
                        <ul class="list-unstyled" id="ci-summary"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Growth Schedule</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Starting Balance</th>
                                        <th>Interest</th>
                                        <th>Deposits</th>
                                        <th>Ending Balance</th>
                                    </tr>
                                </thead>
                                <tbody id="ci-schedule"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="ci-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function toggleAdditionalDeposits() {
    const additionalDeposits = document.getElementById('additional-deposits');
    const includeDeposits = document.getElementById('ci-additional').checked;
    additionalDeposits.style.display = includeDeposits ? 'block' : 'none';
}

function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('ci-principal').value);
    const rate = parseFloat(document.getElementById('ci-rate').value);
    const time = parseFloat(document.getElementById('ci-time').value);
    const timeUnit = document.getElementById('ci-time-unit').value;
    const frequency = document.getElementById('ci-frequency').value;
    
    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        alert('Please enter valid numbers for all required fields');
        return;
    }
    
    // Convert time to years
    let timeInYears;
    switch (timeUnit) {
        case 'months':
            timeInYears = time / 12;
            break;
        case 'days':
            timeInYears = time / 365;
            break;
        default:
            timeInYears = time;
    }
    
    // Get additional deposit information
    let depositAmount = 0;
    let depositFrequency = 12;
    if (document.getElementById('ci-additional').checked) {
        depositAmount = parseFloat(document.getElementById('ci-deposit').value) || 0;
        depositFrequency = parseInt(document.getElementById('ci-deposit-frequency').value);
    }
    
    // Calculate compound interest
    const periods = Math.ceil(timeInYears * (frequency === 'continuous' ? 12 : parseInt(frequency)));
    const periodData = [];
    let balance = principal;
    let totalInterest = 0;
    let totalDeposits = principal;
    
    for (let period = 1; period <= periods; period++) {
        const startBalance = balance;
        let periodInterest;
        
        if (frequency === 'continuous') {
            // Use continuous compounding formula
            periodInterest = balance * (Math.exp(rate/100 * (1/12)) - 1);
        } else {
            // Use discrete compounding formula
            periodInterest = balance * (rate/100) / parseInt(frequency);
        }
        
        // Calculate deposits for this period
        const periodDeposits = depositAmount * (depositFrequency / parseInt(frequency === 'continuous' ? 12 : frequency));
        totalDeposits += periodDeposits;
        
        balance += periodInterest + periodDeposits;
        totalInterest += periodInterest;
        
        if (period % parseInt(frequency === 'continuous' ? 12 : frequency) === 0 || 
            period === periods) {
            periodData.push({
                period: Math.ceil(period / (frequency === 'continuous' ? 12 : parseInt(frequency))),
                startBalance,
                interest: periodInterest,
                deposits: periodDeposits,
                endBalance: balance
            });
        }
    }
    
    displayCompoundInterestResults({
        finalAmount: balance,
        totalInterest,
        totalDeposits,
        periodData
    });
}

function displayCompoundInterestResults(results) {
    document.getElementById('ci-result').style.display = 'block';
    
    // Display final amount
    document.getElementById('ci-final-amount').textContent = 
        `₹${results.finalAmount.toFixed(2)}`;
    
    // Display summary
    document.getElementById('ci-summary').innerHTML = `
        <li><strong>Total Principal + Deposits:</strong> ₹${results.totalDeposits.toFixed(2)}</li>
        <li><strong>Total Interest Earned:</strong> ₹${results.totalInterest.toFixed(2)}</li>
        <li><strong>Final Balance:</strong> ₹${results.finalAmount.toFixed(2)}</li>
        <li><strong>Interest to Principal Ratio:</strong> ${(results.totalInterest / results.totalDeposits * 100).toFixed(2)}%</li>
    `;
    
    // Display schedule
    const tbody = document.getElementById('ci-schedule');
    tbody.innerHTML = results.periodData.map(data => `
        <tr>
            <td>${data.period}</td>
            <td>₹${data.startBalance.toFixed(2)}</td>
            <td>₹${data.interest.toFixed(2)}</td>
            <td>₹${data.deposits.toFixed(2)}</td>
            <td>₹${data.endBalance.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Create growth chart
    const ctx = document.getElementById('ci-chart').getContext('2d');
    if (window.ciChart) window.ciChart.destroy();
    
    const labels = results.periodData.map(data => `Year ${data.period}`);
    const balances = results.periodData.map(data => data.endBalance);
    const deposits = results.periodData.map(data => data.deposits);
    const interests = results.periodData.map(data => data.interest);
    
    window.ciChart = new Chart(ctx, {
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
                    label: 'Periodic Interest',
                    data: interests,
                    borderColor: '#FF6384',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Periodic Deposits',
                    data: deposits,
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
                    text: 'Growth Over Time'
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
