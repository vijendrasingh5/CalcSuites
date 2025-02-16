function loadInterestCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Interest Calculator');
    const cardBody = card.querySelector('.card-body');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Interest Type</label>
                    <select class="form-select" id="interest-type" onchange="toggleInterestInputs()">
                        <option value="simple">Simple Interest</option>
                        <option value="compound">Compound Interest</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Principal Amount</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="interest-principal" placeholder="Enter principal amount">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Interest Rate (% per annum)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="interest-rate" step="0.1" placeholder="Enter interest rate">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Time Period</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="interest-time" placeholder="Enter time period">
                        <select class="form-select" id="interest-time-unit">
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                            <option value="days">Days</option>
                        </select>
                    </div>
                </div>
                
                <div id="compound-options" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Compounding Frequency</label>
                        <select class="form-select" id="compound-frequency">
                            <option value="1">Annually</option>
                            <option value="2">Semi-Annually</option>
                            <option value="4">Quarterly</option>
                            <option value="12">Monthly</option>
                            <option value="365">Daily</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="include-deposits" onchange="toggleDepositInput()">
                            <label class="form-check-label">Include Regular Deposits</label>
                        </div>
                    </div>
                    
                    <div id="deposit-input" style="display: none;">
                        <div class="mb-3">
                            <label class="form-label">Regular Deposit Amount</label>
                            <div class="input-group">
                                <span class="input-group-text">₹</span>
                                <input type="number" class="form-control" id="deposit-amount">
                                <select class="form-select" id="deposit-frequency">
                                    <option value="12">Monthly</option>
                                    <option value="4">Quarterly</option>
                                    <option value="2">Semi-Annually</option>
                                    <option value="1">Annually</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateInterest()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="results" class="mt-3"></div>
                <canvas id="interest-chart" style="display: none;"></canvas>
            </div>
        </div>
    `;
    
    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);
}

function toggleInterestInputs() {
    const interestType = document.getElementById('interest-type').value;
    const compoundOptions = document.getElementById('compound-options');
    compoundOptions.style.display = interestType === 'compound' ? 'block' : 'none';
}

function toggleDepositInput() {
    const depositInput = document.getElementById('deposit-input');
    const includeDeposits = document.getElementById('include-deposits').checked;
    depositInput.style.display = includeDeposits ? 'block' : 'none';
}

function calculateInterest() {
    const principal = parseFloat(document.getElementById('interest-principal').value);
    const rate = parseFloat(document.getElementById('interest-rate').value);
    const time = parseFloat(document.getElementById('interest-time').value);
    const timeUnit = document.getElementById('interest-time-unit').value;
    const interestType = document.getElementById('interest-type').value;
    
    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        alert('Please enter valid numbers for all fields');
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
    
    let result;
    if (interestType === 'simple') {
        result = calculateSimpleInterest(principal, rate, timeInYears);
    } else {
        result = calculateCompoundInterest(principal, rate, timeInYears);
    }
    
    displayInterestResults(result);
}

function calculateSimpleInterest(principal, rate, time) {
    const interest = (principal * rate * time) / 100;
    const amount = principal + interest;
    
    const yearlyData = [];
    for (let year = 1; year <= Math.ceil(time); year++) {
        const yearTime = Math.min(1, time - (year - 1));
        const yearInterest = (principal * rate * yearTime) / 100;
        
        yearlyData.push({
            year: year,
            openingBalance: principal,
            interest: yearInterest,
            deposits: 0,
            closingBalance: principal + yearInterest
        });
    }
    
    return {
        principal: principal,
        interest: interest,
        amount: amount,
        yearlyData: yearlyData
    };
}

function calculateCompoundInterest(principal, rate, time) {
    const frequency = parseInt(document.getElementById('compound-frequency').value);
    let depositAmount = 0;
    let depositFreq = 0;
    
    if (document.getElementById('include-deposits').checked) {
        depositAmount = parseFloat(document.getElementById('deposit-amount').value) || 0;
        depositFreq = parseInt(document.getElementById('deposit-frequency').value);
    }
    
    const yearlyData = [];
    let totalAmount = principal;
    let totalDeposits = 0;
    
    for (let year = 1; year <= Math.ceil(time); year++) {
        const yearTime = Math.min(1, time - (year - 1));
        const yearStart = totalAmount;
        
        // Calculate compound interest for the year
        const ratePerPeriod = rate / (100 * frequency);
        const periods = frequency * yearTime;
        
        let yearAmount = totalAmount * Math.pow(1 + ratePerPeriod, periods);
        
        // Add deposits if applicable
        let yearDeposits = 0;
        if (depositAmount > 0) {
            const depositsPerYear = depositFreq * yearTime;
            yearDeposits = depositAmount * depositsPerYear;
            yearAmount += yearDeposits;
            totalDeposits += yearDeposits;
        }
        
        yearlyData.push({
            year: year,
            openingBalance: yearStart,
            interest: yearAmount - yearStart - yearDeposits,
            deposits: yearDeposits,
            closingBalance: yearAmount
        });
        
        totalAmount = yearAmount;
    }
    
    return {
        principal: principal,
        interest: totalAmount - principal - totalDeposits,
        amount: totalAmount,
        deposits: totalDeposits,
        yearlyData: yearlyData
    };
}

function displayInterestResults(result) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    // Display final amount
    const finalAmountHTML = `
        <h4>Final Amount: ₹${result.amount.toFixed(2)}</h4>
    `;
    resultsDiv.innerHTML += finalAmountHTML;
    
    // Display calculation details
    let detailsHTML = `
        <h5>Calculation Details:</h5>
        <ul class="list-unstyled">
            <li><strong>Principal Amount:</strong> ₹${result.principal.toFixed(2)}</li>
            <li><strong>Total Interest Earned:</strong> ₹${result.interest.toFixed(2)}</li>
    `;
    
    if (result.deposits) {
        detailsHTML += `<li><strong>Total Deposits:</strong> ₹${result.deposits.toFixed(2)}</li>`;
    }
    
    detailsHTML += `<li><strong>Final Amount:</strong> ₹${result.amount.toFixed(2)}</li>`;
    
    detailsHTML += `</ul>`;
    resultsDiv.innerHTML += detailsHTML;
    
    // Display yearly breakdown
    const breakdownHTML = `
        <h5>Year-wise Breakdown:</h5>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Opening Balance</th>
                        <th>Interest Earned</th>
                        <th>Deposits</th>
                        <th>Closing Balance</th>
                    </tr>
                </thead>
                <tbody id="interest-breakdown"></tbody>
            </table>
        </div>
    `;
    resultsDiv.innerHTML += breakdownHTML;
    
    const tbody = document.getElementById('interest-breakdown');
    tbody.innerHTML = result.yearlyData.map(data => `
        <tr>
            <td>${data.year}</td>
            <td>₹${data.openingBalance.toFixed(2)}</td>
            <td>₹${data.interest.toFixed(2)}</td>
            <td>₹${data.deposits.toFixed(2)}</td>
            <td>₹${data.closingBalance.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Create growth chart
    const ctx = document.getElementById('interest-chart').getContext('2d');
    if (window.interestChart) window.interestChart.destroy();
    
    const labels = result.yearlyData.map(data => `Year ${data.year}`);
    const balances = result.yearlyData.map(data => data.closingBalance);
    
    window.interestChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Balance Growth',
                data: balances,
                borderColor: '#36A2EB',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Balance Growth Over Time'
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
    
    document.getElementById('interest-chart').style.display = 'block';
}
