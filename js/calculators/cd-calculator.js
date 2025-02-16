function loadCDCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('CD Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Initial Deposit</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="cd-principal" placeholder="Enter initial deposit">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Annual Percentage Yield (APY)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="cd-apy" step="0.01" placeholder="Enter APY">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Term Length</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="cd-term" placeholder="Enter term length">
                        <select class="form-select" id="cd-term-unit">
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Compounding Frequency</label>
                    <select class="form-select" id="cd-compound-freq">
                        <option value="12">Monthly</option>
                        <option value="4">Quarterly</option>
                        <option value="2">Semi-annually</option>
                        <option value="1">Annually</option>
                        <option value="365">Daily</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="cd-tax-withholding">
                        <label class="form-check-label">Include Tax Withholding</label>
                    </div>
                    <div id="cd-tax-input" class="mt-2" style="display: none;">
                        <label class="form-label">Tax Rate (%)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="cd-tax-rate" value="10" step="0.1">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="cd-early-withdrawal">
                        <label class="form-check-label">Calculate Early Withdrawal</label>
                    </div>
                    <div id="cd-withdrawal-input" class="mt-2" style="display: none;">
                        <label class="form-label">Withdrawal After</label>
                        <div class="input-group mb-2">
                            <input type="number" class="form-control" id="cd-withdrawal-time" placeholder="Enter time">
                            <select class="form-select" id="cd-withdrawal-unit">
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </select>
                        </div>
                        <label class="form-label">Early Withdrawal Penalty</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="cd-penalty" value="3">
                            <select class="form-select" id="cd-penalty-type">
                                <option value="months">Months Interest</option>
                                <option value="percent">Percent of Principal</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateCD()">Calculate CD</button>
            </div>
            
            <div class="col-md-6">
                <div id="cd-result" class="result-box mt-3" style="display: none;">
                    <h4>CD Calculation Results</h4>
                    
                    <div class="mb-3">
                        <h5>Final Value at Maturity</h5>
                        <p id="cd-final-value" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Calculation Summary</h5>
                        <ul class="list-unstyled" id="cd-summary"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Interest Earnings Schedule</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Interest Earned</th>
                                        <th>Tax Withheld</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody id="cd-schedule"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="cd-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add event listeners
    document.getElementById('cd-tax-withholding').addEventListener('change', function() {
        document.getElementById('cd-tax-input').style.display = 
            this.checked ? 'block' : 'none';
    });
    
    document.getElementById('cd-early-withdrawal').addEventListener('change', function() {
        document.getElementById('cd-withdrawal-input').style.display = 
            this.checked ? 'block' : 'none';
    });
}

function calculateCD() {
    const principal = parseFloat(document.getElementById('cd-principal').value);
    const apy = parseFloat(document.getElementById('cd-apy').value);
    const term = parseFloat(document.getElementById('cd-term').value);
    const termUnit = document.getElementById('cd-term-unit').value;
    const compoundFreq = parseInt(document.getElementById('cd-compound-freq').value);
    const includeTax = document.getElementById('cd-tax-withholding').checked;
    const taxRate = includeTax ? parseFloat(document.getElementById('cd-tax-rate').value) : 0;
    const calculateEarly = document.getElementById('cd-early-withdrawal').checked;
    
    if (isNaN(principal) || isNaN(apy) || isNaN(term)) {
        alert('Please enter valid numbers for all required fields');
        return;
    }
    
    // Convert term to years
    const years = termUnit === 'months' ? term / 12 : term;
    
    // Calculate CD growth
    const periodsPerYear = compoundFreq;
    const totalPeriods = Math.ceil(years * periodsPerYear);
    const ratePerPeriod = apy / (100 * periodsPerYear);
    
    const periodData = [];
    let balance = principal;
    let totalInterest = 0;
    let totalTax = 0;
    
    for (let period = 1; period <= totalPeriods; period++) {
        const startBalance = balance;
        const interest = balance * ratePerPeriod;
        const tax = includeTax ? interest * (taxRate / 100) : 0;
        
        balance += interest - tax;
        totalInterest += interest;
        totalTax += tax;
        
        periodData.push({
            period,
            interest,
            tax,
            balance
        });
    }
    
    // Calculate early withdrawal if requested
    let earlyWithdrawalResults = null;
    if (calculateEarly) {
        const withdrawalTime = parseFloat(document.getElementById('cd-withdrawal-time').value);
        const withdrawalUnit = document.getElementById('cd-withdrawal-unit').value;
        const penaltyAmount = parseFloat(document.getElementById('cd-penalty').value);
        const penaltyType = document.getElementById('cd-penalty-type').value;
        
        const withdrawalYears = withdrawalUnit === 'months' ? withdrawalTime / 12 : withdrawalTime;
        const withdrawalPeriods = Math.ceil(withdrawalYears * periodsPerYear);
        
        let penalty = 0;
        if (penaltyType === 'months') {
            // Calculate months of interest as penalty
            const monthlyInterest = (balance - principal) / (years * 12);
            penalty = monthlyInterest * penaltyAmount;
        } else {
            // Calculate percentage of principal as penalty
            penalty = principal * (penaltyAmount / 100);
        }
        
        const earlyBalance = periodData[withdrawalPeriods - 1].balance - penalty;
        
        earlyWithdrawalResults = {
            withdrawalTime,
            withdrawalUnit,
            originalBalance: periodData[withdrawalPeriods - 1].balance,
            penalty,
            finalBalance: earlyBalance
        };
    }
    
    displayCDResults({
        principal,
        apy,
        years,
        compoundFreq,
        finalBalance: balance,
        totalInterest,
        totalTax,
        periodData,
        earlyWithdrawal: earlyWithdrawalResults
    });
}

function displayCDResults(results) {
    document.getElementById('cd-result').style.display = 'block';
    
    // Display final value
    document.getElementById('cd-final-value').textContent = 
        `₹${results.finalBalance.toFixed(2)}`;
    
    // Display summary
    let summaryHTML = `
        <li><strong>Initial Deposit:</strong> ₹${results.principal.toFixed(2)}</li>
        <li><strong>APY:</strong> ${results.apy}%</li>
        <li><strong>Term:</strong> ${results.years.toFixed(2)} years</li>
        <li><strong>Total Interest Earned:</strong> ₹${results.totalInterest.toFixed(2)}</li>
        <li><strong>Total Tax Withheld:</strong> ₹${results.totalTax.toFixed(2)}</li>
        <li><strong>Net Interest:</strong> ₹${(results.totalInterest - results.totalTax).toFixed(2)}</li>
        <li><strong>Final Balance:</strong> ₹${results.finalBalance.toFixed(2)}</li>
    `;
    
    if (results.earlyWithdrawal) {
        summaryHTML += `
            <li class="mt-3"><strong>Early Withdrawal Summary:</strong></li>
            <li><strong>Withdrawal Time:</strong> ${results.earlyWithdrawal.withdrawalTime} ${results.earlyWithdrawal.withdrawalUnit}</li>
            <li><strong>Balance at Withdrawal:</strong> ₹${results.earlyWithdrawal.originalBalance.toFixed(2)}</li>
            <li><strong>Early Withdrawal Penalty:</strong> ₹${results.earlyWithdrawal.penalty.toFixed(2)}</li>
            <li><strong>Final Balance After Penalty:</strong> ₹${results.earlyWithdrawal.finalBalance.toFixed(2)}</li>
        `;
    }
    
    document.getElementById('cd-summary').innerHTML = summaryHTML;
    
    // Display schedule
    const tbody = document.getElementById('cd-schedule');
    tbody.innerHTML = results.periodData.map(data => `
        <tr>
            <td>${data.period}</td>
            <td>₹${data.interest.toFixed(2)}</td>
            <td>₹${data.tax.toFixed(2)}</td>
            <td>₹${data.balance.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Create growth chart
    const ctx = document.getElementById('cd-chart').getContext('2d');
    if (window.cdChart) window.cdChart.destroy();
    
    const labels = results.periodData.map(data => `Period ${data.period}`);
    const balances = results.periodData.map(data => data.balance);
    const interests = results.periodData.map(data => data.interest);
    const taxes = results.periodData.map(data => data.tax);
    
    window.cdChart = new Chart(ctx, {
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
                    label: 'Interest per Period',
                    data: interests,
                    borderColor: '#FF6384',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Tax per Period',
                    data: taxes,
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
                    text: 'CD Growth Over Time'
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
