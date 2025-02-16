function loadPaybackPeriodCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Payback Period Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Initial Investment</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="pp-investment" placeholder="Enter initial investment">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Cash Flow Input Method</label>
                    <select class="form-select" id="cashflow-input-method">
                        <option value="constant">Constant Cash Flow</option>
                        <option value="variable">Variable Cash Flows</option>
                    </select>
                </div>
                
                <div id="constant-cashflow-input">
                    <div class="mb-3">
                        <label class="form-label">Annual Cash Flow</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control" id="pp-constant-cashflow" placeholder="Enter annual cash flow">
                        </div>
                    </div>
                </div>
                
                <div id="variable-cashflow-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Enter Cash Flows (one per line)</label>
                        <textarea class="form-control" id="pp-cashflows" rows="5" 
                            placeholder="Enter cash flows (e.g.):&#10;5000&#10;7500&#10;10000&#10;12500"></textarea>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Cash Flow Frequency</label>
                    <select class="form-select" id="cashflow-frequency">
                        <option value="12">Monthly</option>
                        <option value="4">Quarterly</option>
                        <option value="2">Semi-annually</option>
                        <option value="1">Annually</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="include-discounting">
                        <label class="form-check-label">Include Time Value of Money</label>
                    </div>
                    <div id="discount-rate-input" class="mt-2" style="display: none;">
                        <label class="form-label">Discount Rate (% per annum)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="discount-rate" value="10" step="0.1">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculatePaybackPeriod()">Calculate Payback Period</button>
            </div>
            
            <div class="col-md-6">
                <div id="pp-result" class="result-box mt-3" style="display: none;">
                    <h4>Payback Period Analysis</h4>
                    
                    <div class="mb-3">
                        <h5>Payback Period</h5>
                        <p id="payback-period" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Analysis Summary</h5>
                        <ul class="list-unstyled" id="pp-summary"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Cash Flow Schedule</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Cash Flow</th>
                                        <th>Present Value</th>
                                        <th>Cumulative</th>
                                        <th>Recovery %</th>
                                    </tr>
                                </thead>
                                <tbody id="pp-schedule"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="pp-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add event listeners
    document.getElementById('cashflow-input-method').addEventListener('change', function() {
        document.getElementById('constant-cashflow-input').style.display = 
            this.value === 'constant' ? 'block' : 'none';
        document.getElementById('variable-cashflow-input').style.display = 
            this.value === 'variable' ? 'block' : 'none';
    });
    
    document.getElementById('include-discounting').addEventListener('change', function() {
        document.getElementById('discount-rate-input').style.display = 
            this.checked ? 'block' : 'none';
    });
}

function calculatePaybackPeriod() {
    const investment = parseFloat(document.getElementById('pp-investment').value);
    const inputMethod = document.getElementById('cashflow-input-method').value;
    const frequency = parseInt(document.getElementById('cashflow-frequency').value);
    const includeDiscounting = document.getElementById('include-discounting').checked;
    const discountRate = includeDiscounting ? 
        parseFloat(document.getElementById('discount-rate').value) : 0;
    
    if (isNaN(investment)) {
        alert('Please enter a valid initial investment amount');
        return;
    }
    
    let cashFlows = [];
    if (inputMethod === 'constant') {
        const annualCashFlow = parseFloat(document.getElementById('pp-constant-cashflow').value);
        if (isNaN(annualCashFlow)) {
            alert('Please enter a valid cash flow amount');
            return;
        }
        
        // Generate cash flows for 10 years or until payback is achieved
        const periodsPerYear = frequency;
        const cashFlowPerPeriod = annualCashFlow / periodsPerYear;
        for (let i = 0; i < 10 * periodsPerYear; i++) {
            cashFlows.push(cashFlowPerPeriod);
        }
    } else {
        const cashFlowsText = document.getElementById('pp-cashflows').value;
        cashFlows = cashFlowsText.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '')
            .map(line => parseFloat(line));
            
        if (cashFlows.some(isNaN)) {
            alert('Please enter valid numbers for cash flows');
            return;
        }
    }
    
    // Calculate present values if discounting is enabled
    const periodsPerYear = frequency;
    const ratePerPeriod = discountRate / (100 * periodsPerYear);
    
    const schedule = [];
    let remainingInvestment = investment;
    let cumulativeRecovery = 0;
    let paybackPeriod = null;
    let discountedPaybackPeriod = null;
    
    for (let period = 0; period < cashFlows.length; period++) {
        const cashFlow = cashFlows[period];
        const presentValue = includeDiscounting ? 
            cashFlow / Math.pow(1 + ratePerPeriod, period + 1) : cashFlow;
        
        cumulativeRecovery += presentValue;
        const recoveryPercentage = (cumulativeRecovery / investment) * 100;
        
        schedule.push({
            period: period + 1,
            cashFlow,
            presentValue,
            cumulative: cumulativeRecovery,
            recoveryPercentage
        });
        
        // Check for payback period
        if (paybackPeriod === null && cumulativeRecovery >= investment) {
            const excess = cumulativeRecovery - investment;
            const fraction = 1 - (excess / presentValue);
            paybackPeriod = period + fraction;
        }
        
        if (cumulativeRecovery >= investment) {
            break;
        }
    }
    
    displayPaybackResults({
        investment,
        paybackPeriod,
        frequency,
        discountRate,
        schedule,
        includeDiscounting
    });
}

function displayPaybackResults(results) {
    document.getElementById('pp-result').style.display = 'block';
    
    // Display payback period
    const periodsPerYear = results.frequency;
    const years = results.paybackPeriod / periodsPerYear;
    const months = years * 12;
    
    let paybackText;
    if (results.paybackPeriod === null) {
        paybackText = 'Investment not recovered within analyzed period';
    } else {
        paybackText = `${years.toFixed(2)} years (${months.toFixed(1)} months)`;
    }
    
    document.getElementById('payback-period').textContent = paybackText;
    
    // Display summary
    let summaryHTML = `
        <li><strong>Initial Investment:</strong> ₹${results.investment.toFixed(2)}</li>
        <li><strong>Cash Flow Frequency:</strong> ${results.frequency === 12 ? 'Monthly' : 
            results.frequency === 4 ? 'Quarterly' : 
            results.frequency === 2 ? 'Semi-annually' : 'Annually'}</li>
    `;
    
    if (results.includeDiscounting) {
        summaryHTML += `<li><strong>Discount Rate:</strong> ${results.discountRate}% per annum</li>`;
    }
    
    if (results.paybackPeriod !== null) {
        summaryHTML += `
            <li><strong>Payback Period:</strong> ${paybackText}</li>
            <li><strong>Average Annual Return:</strong> ${((results.investment / years) / results.investment * 100).toFixed(2)}%</li>
        `;
    }
    
    document.getElementById('pp-summary').innerHTML = summaryHTML;
    
    // Display schedule
    const tbody = document.getElementById('pp-schedule');
    tbody.innerHTML = results.schedule.map(data => `
        <tr>
            <td>${data.period}</td>
            <td>₹${data.cashFlow.toFixed(2)}</td>
            <td>₹${data.presentValue.toFixed(2)}</td>
            <td>₹${data.cumulative.toFixed(2)}</td>
            <td>${data.recoveryPercentage.toFixed(1)}%</td>
        </tr>
    `).join('');
    
    // Create chart
    const ctx = document.getElementById('pp-chart').getContext('2d');
    if (window.ppChart) window.ppChart.destroy();
    
    const labels = results.schedule.map(data => `Period ${data.period}`);
    
    window.ppChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cash Flow',
                    data: results.schedule.map(data => data.cashFlow),
                    borderColor: '#36A2EB',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Present Value',
                    data: results.schedule.map(data => data.presentValue),
                    borderColor: '#FF6384',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Cumulative Recovery',
                    data: results.schedule.map(data => data.cumulative),
                    borderColor: '#FFCE56',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Investment',
                    data: results.schedule.map(() => results.investment),
                    borderColor: '#4BC0C0',
                    borderDash: [5, 5],
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
                    text: 'Investment Recovery Analysis'
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
