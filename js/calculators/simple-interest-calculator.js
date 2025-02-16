function loadSimpleInterestCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Simple Interest Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Principal Amount</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="si-principal" placeholder="Enter principal amount">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Interest Rate (% per annum)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="si-rate" step="0.1" placeholder="Enter interest rate">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Time Period</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="si-time" placeholder="Enter time period">
                        <select class="form-select" id="si-time-unit">
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                            <option value="days">Days</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="tax-deduction">
                        <label class="form-check-label">Include Tax Deduction</label>
                    </div>
                    <div id="tax-rate-input" class="mt-2" style="display: none;">
                        <label class="form-label">Tax Rate (%)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="tax-rate" value="10" step="0.1">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateSimpleInterest()">Calculate Interest</button>
            </div>
            
            <div class="col-md-6">
                <div id="si-result" class="result-box mt-3" style="display: none;">
                    <h4>Simple Interest Results</h4>
                    
                    <div class="mb-3">
                        <h5>Final Amount</h5>
                        <p id="si-final-amount" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Calculation Summary</h5>
                        <ul class="list-unstyled" id="si-summary"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Period Breakdown</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Interest</th>
                                        <th>Tax</th>
                                        <th>Net Interest</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody id="si-breakdown"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="si-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add event listener for tax checkbox
    document.getElementById('tax-deduction').addEventListener('change', function() {
        document.getElementById('tax-rate-input').style.display = 
            this.checked ? 'block' : 'none';
    });
}

function calculateSimpleInterest() {
    const principal = parseFloat(document.getElementById('si-principal').value);
    const rate = parseFloat(document.getElementById('si-rate').value);
    const time = parseFloat(document.getElementById('si-time').value);
    const timeUnit = document.getElementById('si-time-unit').value;
    const includeTax = document.getElementById('tax-deduction').checked;
    const taxRate = includeTax ? 
        parseFloat(document.getElementById('tax-rate').value) : 0;
    
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
    
    // Calculate simple interest
    const periodData = [];
    const periodsPerYear = timeUnit === 'days' ? 365 : 12;
    const totalPeriods = Math.ceil(time);
    
    let totalInterest = 0;
    let totalTax = 0;
    
    for (let period = 1; period <= totalPeriods; period++) {
        const periodFraction = period === totalPeriods ? 
            (timeUnit === 'years' ? timeInYears - Math.floor(timeInYears) : 
             timeUnit === 'months' ? time/12 - Math.floor(time/12) : 
             time/365 - Math.floor(time/365)) : 1;
        
        const periodInterest = principal * (rate/100) * (1/periodsPerYear) * periodFraction;
        const periodTax = includeTax ? periodInterest * (taxRate/100) : 0;
        const netInterest = periodInterest - periodTax;
        
        totalInterest += periodInterest;
        totalTax += periodTax;
        
        periodData.push({
            period,
            interest: periodInterest,
            tax: periodTax,
            netInterest: netInterest,
            balance: principal + totalInterest - totalTax
        });
    }
    
    const finalAmount = principal + totalInterest - totalTax;
    
    displaySimpleInterestResults({
        principal,
        rate,
        time,
        timeUnit,
        totalInterest,
        totalTax,
        finalAmount,
        periodData
    });
}

function displaySimpleInterestResults(results) {
    document.getElementById('si-result').style.display = 'block';
    
    // Display final amount
    document.getElementById('si-final-amount').textContent = 
        `₹${results.finalAmount.toFixed(2)}`;
    
    // Display summary
    let summaryHTML = `
        <li><strong>Principal Amount:</strong> ₹${results.principal.toFixed(2)}</li>
        <li><strong>Interest Rate:</strong> ${results.rate}% per annum</li>
        <li><strong>Time Period:</strong> ${results.time} ${results.timeUnit}</li>
        <li><strong>Total Interest:</strong> ₹${results.totalInterest.toFixed(2)}</li>
    `;
    
    if (results.totalTax > 0) {
        summaryHTML += `
            <li><strong>Tax Deducted:</strong> ₹${results.totalTax.toFixed(2)}</li>
            <li><strong>Net Interest:</strong> ₹${(results.totalInterest - results.totalTax).toFixed(2)}</li>
        `;
    }
    
    summaryHTML += `<li><strong>Final Amount:</strong> ₹${results.finalAmount.toFixed(2)}</li>`;
    
    document.getElementById('si-summary').innerHTML = summaryHTML;
    
    // Display period breakdown
    const tbody = document.getElementById('si-breakdown');
    tbody.innerHTML = results.periodData.map(data => `
        <tr>
            <td>${data.period}</td>
            <td>₹${data.interest.toFixed(2)}</td>
            <td>₹${data.tax.toFixed(2)}</td>
            <td>₹${data.netInterest.toFixed(2)}</td>
            <td>₹${data.balance.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Create chart
    const ctx = document.getElementById('si-chart').getContext('2d');
    if (window.siChart) window.siChart.destroy();
    
    const labels = results.periodData.map(data => 
        `Period ${data.period}`);
    
    window.siChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Interest',
                    data: results.periodData.map(data => data.interest),
                    backgroundColor: '#36A2EB'
                },
                {
                    label: 'Tax',
                    data: results.periodData.map(data => data.tax),
                    backgroundColor: '#FF6384'
                },
                {
                    label: 'Net Interest',
                    data: results.periodData.map(data => data.netInterest),
                    backgroundColor: '#FFCE56'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Interest Breakdown by Period'
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
