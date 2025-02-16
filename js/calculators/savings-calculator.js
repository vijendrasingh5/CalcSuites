function loadSavingsCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Savings Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Initial Deposit</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="savings-initial" placeholder="Enter initial deposit">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Regular Deposit</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="savings-deposit" placeholder="Enter regular deposit amount">
                        <select class="form-select" id="deposit-frequency">
                            <option value="12">Monthly</option>
                            <option value="26">Bi-weekly</option>
                            <option value="52">Weekly</option>
                            <option value="365">Daily</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Annual Interest Rate (%)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="savings-rate" step="0.1" placeholder="Enter interest rate">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Time Period</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="savings-time" placeholder="Enter time period">
                        <select class="form-select" id="savings-time-unit">
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Compounding Frequency</label>
                    <select class="form-select" id="savings-compound-freq">
                        <option value="1">Annually</option>
                        <option value="2">Semi-annually</option>
                        <option value="4">Quarterly</option>
                        <option value="12">Monthly</option>
                        <option value="365">Daily</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="inflation-adjust">
                        <label class="form-check-label">Account for Inflation</label>
                    </div>
                    <div id="inflation-rate-input" class="mt-2" style="display: none;">
                        <label class="form-label">Expected Inflation Rate (%)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="inflation-rate" value="3" step="0.1">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateSavings()">Calculate Savings</button>
            </div>
            
            <div class="col-md-6">
                <div id="savings-result" class="result-box mt-3" style="display: none;">
                    <h4>Savings Projection</h4>
                    
                    <div class="mb-3">
                        <h5>Final Balance</h5>
                        <p id="savings-final-balance" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Savings Summary</h5>
                        <ul class="list-unstyled" id="savings-summary"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Year-by-Year Breakdown</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Year</th>
                                        <th>Deposits</th>
                                        <th>Interest</th>
                                        <th>Balance</th>
                                        <th>Real Value</th>
                                    </tr>
                                </thead>
                                <tbody id="savings-breakdown"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="savings-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add event listener for inflation checkbox
    document.getElementById('inflation-adjust').addEventListener('change', function() {
        document.getElementById('inflation-rate-input').style.display = 
            this.checked ? 'block' : 'none';
    });
}

function calculateSavings() {
    const initialDeposit = parseFloat(document.getElementById('savings-initial').value) || 0;
    const regularDeposit = parseFloat(document.getElementById('savings-deposit').value) || 0;
    const depositFreq = parseInt(document.getElementById('deposit-frequency').value);
    const rate = parseFloat(document.getElementById('savings-rate').value);
    const time = parseFloat(document.getElementById('savings-time').value);
    const timeUnit = document.getElementById('savings-time-unit').value;
    const compoundFreq = parseInt(document.getElementById('savings-compound-freq').value);
    const includeInflation = document.getElementById('inflation-adjust').checked;
    const inflationRate = includeInflation ? 
        parseFloat(document.getElementById('inflation-rate').value) : 0;
    
    if (isNaN(rate) || isNaN(time)) {
        alert('Please enter valid numbers for all required fields');
        return;
    }
    
    // Convert time to years if needed
    const years = timeUnit === 'months' ? time / 12 : time;
    
    // Calculate savings growth
    const yearlyData = [];
    let balance = initialDeposit;
    let totalDeposits = initialDeposit;
    let totalInterest = 0;
    
    for (let year = 1; year <= Math.ceil(years); year++) {
        const yearFraction = year === Math.ceil(years) ? 
            years - Math.floor(years) : 1;
        
        const yearStart = balance;
        const yearlyDeposit = regularDeposit * depositFreq * yearFraction;
        totalDeposits += yearlyDeposit;
        
        // Calculate compound interest
        const ratePerPeriod = rate / (100 * compoundFreq);
        const periods = compoundFreq * yearFraction;
        
        for (let period = 0; period < periods; period++) {
            const periodDeposit = yearlyDeposit / periods;
            const interest = balance * ratePerPeriod;
            balance += interest + periodDeposit;
            totalInterest += interest;
        }
        
        // Calculate real value accounting for inflation
        const realValue = includeInflation ? 
            balance / Math.pow(1 + inflationRate/100, year) : balance;
        
        yearlyData.push({
            year,
            deposits: yearlyDeposit,
            interest: balance - yearStart - yearlyDeposit,
            balance,
            realValue
        });
    }
    
    displaySavingsResults({
        finalBalance: balance,
        totalDeposits,
        totalInterest,
        realValue: includeInflation ? 
            balance / Math.pow(1 + inflationRate/100, years) : balance,
        yearlyData,
        inflationRate
    });
}

function displaySavingsResults(results) {
    document.getElementById('savings-result').style.display = 'block';
    
    // Display final balance
    document.getElementById('savings-final-balance').textContent = 
        `₹${results.finalBalance.toFixed(2)}`;
    
    // Display summary
    let summaryHTML = `
        <li><strong>Total Deposits:</strong> ₹${results.totalDeposits.toFixed(2)}</li>
        <li><strong>Total Interest Earned:</strong> ₹${results.totalInterest.toFixed(2)}</li>
        <li><strong>Final Balance:</strong> ₹${results.finalBalance.toFixed(2)}</li>
    `;
    
    if (results.inflationRate > 0) {
        summaryHTML += `
            <li><strong>Real Value (Inflation Adjusted):</strong> ₹${results.realValue.toFixed(2)}</li>
            <li><strong>Effective Real Return:</strong> ${((results.finalBalance/results.totalDeposits - 1) * 100).toFixed(2)}%</li>
        `;
    }
    
    document.getElementById('savings-summary').innerHTML = summaryHTML;
    
    // Display yearly breakdown
    const tbody = document.getElementById('savings-breakdown');
    tbody.innerHTML = results.yearlyData.map(data => `
        <tr>
            <td>${data.year}</td>
            <td>₹${data.deposits.toFixed(2)}</td>
            <td>₹${data.interest.toFixed(2)}</td>
            <td>₹${data.balance.toFixed(2)}</td>
            <td>₹${data.realValue.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Create savings growth chart
    const ctx = document.getElementById('savings-chart').getContext('2d');
    if (window.savingsChart) window.savingsChart.destroy();
    
    const labels = results.yearlyData.map(data => `Year ${data.year}`);
    const datasets = [
        {
            label: 'Balance',
            data: results.yearlyData.map(data => data.balance),
            borderColor: '#36A2EB',
            tension: 0.1,
            fill: false
        }
    ];
    
    if (results.inflationRate > 0) {
        datasets.push({
            label: 'Real Value',
            data: results.yearlyData.map(data => data.realValue),
            borderColor: '#FF6384',
            tension: 0.1,
            fill: false
        });
    }
    
    window.savingsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Savings Growth Over Time'
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
