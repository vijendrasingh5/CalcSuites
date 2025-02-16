function loadFutureValueCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Future Value Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="fv-calc-type">
                        <option value="single">Single Amount</option>
                        <option value="regular">Regular Deposits</option>
                        <option value="growing">Growing Deposits</option>
                    </select>
                </div>
                
                <div id="single-amount-inputs">
                    <div class="mb-3">
                        <label class="form-label">Initial Principal</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control" id="fv-principal" placeholder="Enter initial amount">
                        </div>
                    </div>
                </div>
                
                <div id="regular-deposits-inputs" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Regular Deposit Amount</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control" id="fv-deposit" placeholder="Enter deposit amount">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Deposit Frequency</label>
                        <select class="form-select" id="fv-deposit-freq">
                            <option value="12">Monthly</option>
                            <option value="4">Quarterly</option>
                            <option value="2">Semi-annually</option>
                            <option value="1">Annually</option>
                            <option value="26">Bi-weekly</option>
                            <option value="52">Weekly</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Deposit Timing</label>
                        <select class="form-select" id="fv-deposit-timing">
                            <option value="end">End of Period</option>
                            <option value="start">Start of Period</option>
                        </select>
                    </div>
                </div>
                
                <div id="growing-deposits-inputs" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Growth Rate (% per year)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="fv-growth-rate" step="0.1" placeholder="Enter growth rate">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Time Period</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="fv-time" placeholder="Enter time period">
                        <select class="form-select" id="fv-time-unit">
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                            <option value="quarters">Quarters</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Interest Rate (% per annum)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="fv-interest-rate" step="0.1" placeholder="Enter interest rate">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Compounding Frequency</label>
                    <select class="form-select" id="fv-compound-freq">
                        <option value="1">Annually</option>
                        <option value="2">Semi-annually</option>
                        <option value="4">Quarterly</option>
                        <option value="12">Monthly</option>
                        <option value="365">Daily</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="fv-tax">
                        <label class="form-check-label">Include Tax Impact</label>
                    </div>
                    <div id="tax-input" class="mt-2" style="display: none;">
                        <label class="form-label">Tax Rate (%)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="tax-rate" value="20" step="0.1">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="fv-inflation">
                        <label class="form-check-label">Account for Inflation</label>
                    </div>
                    <div id="inflation-input" class="mt-2" style="display: none;">
                        <label class="form-label">Expected Inflation Rate (% per annum)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="inflation-rate" value="3" step="0.1">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateFutureValue()">Calculate Future Value</button>
            </div>
            
            <div class="col-md-6">
                <div id="fv-result" class="result-box mt-3" style="display: none;">
                    <h4>Future Value Analysis</h4>
                    
                    <div class="mb-3">
                        <h5>Future Value</h5>
                        <p id="future-value" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Calculation Summary</h5>
                        <ul class="list-unstyled" id="fv-summary"></ul>
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
                                <tbody id="fv-breakdown"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="fv-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add event listeners
    document.getElementById('fv-calc-type').addEventListener('change', function() {
        document.getElementById('single-amount-inputs').style.display = 
            this.value === 'single' ? 'block' : 'none';
        document.getElementById('regular-deposits-inputs').style.display = 
            (this.value === 'regular' || this.value === 'growing') ? 'block' : 'none';
        document.getElementById('growing-deposits-inputs').style.display = 
            this.value === 'growing' ? 'block' : 'none';
    });
    
    document.getElementById('fv-tax').addEventListener('change', function() {
        document.getElementById('tax-input').style.display = 
            this.checked ? 'block' : 'none';
    });
    
    document.getElementById('fv-inflation').addEventListener('change', function() {
        document.getElementById('inflation-input').style.display = 
            this.checked ? 'block' : 'none';
    });
}

function calculateFutureValue() {
    const calcType = document.getElementById('fv-calc-type').value;
    const principal = parseFloat(document.getElementById('fv-principal').value) || 0;
    const time = parseFloat(document.getElementById('fv-time').value);
    const timeUnit = document.getElementById('fv-time-unit').value;
    const interestRate = parseFloat(document.getElementById('fv-interest-rate').value);
    const compoundFreq = parseInt(document.getElementById('fv-compound-freq').value);
    const includeTax = document.getElementById('fv-tax').checked;
    const taxRate = includeTax ? parseFloat(document.getElementById('tax-rate').value) : 0;
    const includeInflation = document.getElementById('fv-inflation').checked;
    const inflationRate = includeInflation ? 
        parseFloat(document.getElementById('inflation-rate').value) : 0;
    
    if (isNaN(time) || isNaN(interestRate)) {
        alert('Please enter valid numbers for time and interest rate');
        return;
    }
    
    // Convert time to years
    let years;
    switch (timeUnit) {
        case 'months':
            years = time / 12;
            break;
        case 'quarters':
            years = time / 4;
            break;
        default:
            years = time;
    }
    
    let deposit = 0;
    let depositFreq = 1;
    let depositTiming = 'end';
    let growthRate = 0;
    
    if (calcType !== 'single') {
        deposit = parseFloat(document.getElementById('fv-deposit').value);
        depositFreq = parseInt(document.getElementById('fv-deposit-freq').value);
        depositTiming = document.getElementById('fv-deposit-timing').value;
        
        if (isNaN(deposit)) {
            alert('Please enter a valid deposit amount');
            return;
        }
        
        if (calcType === 'growing') {
            growthRate = parseFloat(document.getElementById('fv-growth-rate').value) / 100;
            if (isNaN(growthRate)) {
                alert('Please enter a valid growth rate');
                return;
            }
        }
    }
    
    // Calculate effective rates
    const ratePerPeriod = interestRate / (100 * compoundFreq);
    const periodsPerYear = compoundFreq;
    const totalPeriods = years * periodsPerYear;
    
    // Generate year-by-year data
    const yearlyData = [];
    let balance = principal;
    let totalDeposits = principal;
    let totalInterest = 0;
    
    for (let year = 1; year <= Math.ceil(years); year++) {
        const yearFraction = year === Math.ceil(years) ? 
            years - Math.floor(years) : 1;
        
        const yearStart = balance;
        let yearlyDeposit = 0;
        
        // Calculate deposits for the year
        if (calcType !== 'single') {
            const depositsThisYear = depositFreq * yearFraction;
            const depositAmount = deposit * Math.pow(1 + growthRate, year - 1);
            yearlyDeposit = depositAmount * depositsThisYear;
            totalDeposits += yearlyDeposit;
        }
        
        // Calculate interest for each compounding period
        for (let period = 0; period < periodsPerYear * yearFraction; period++) {
            const periodDeposit = yearlyDeposit / (periodsPerYear * yearFraction);
            
            if (depositTiming === 'start') {
                balance += periodDeposit;
            }
            
            const interest = balance * ratePerPeriod;
            balance += interest;
            totalInterest += interest;
            
            if (depositTiming === 'end') {
                balance += periodDeposit;
            }
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
    
    // Calculate tax if applicable
    const taxAmount = includeTax ? totalInterest * (taxRate/100) : 0;
    const afterTaxBalance = balance - taxAmount;
    
    displayFutureValueResults({
        futureValue: balance,
        afterTaxValue: afterTaxBalance,
        totalDeposits,
        totalInterest,
        taxAmount,
        realValue: includeInflation ? 
            balance / Math.pow(1 + inflationRate/100, years) : balance,
        yearlyData,
        calcType,
        years,
        interestRate,
        compoundFreq,
        inflationRate,
        includeInflation
    });
}

function displayFutureValueResults(results) {
    document.getElementById('fv-result').style.display = 'block';
    
    // Display future value
    document.getElementById('future-value').textContent = 
        `₹${results.futureValue.toFixed(2)}`;
    
    // Display summary
    let summaryHTML = `
        <li><strong>Future Value:</strong> ₹${results.futureValue.toFixed(2)}</li>
        <li><strong>Total Deposits:</strong> ₹${results.totalDeposits.toFixed(2)}</li>
        <li><strong>Total Interest Earned:</strong> ₹${results.totalInterest.toFixed(2)}</li>
        <li><strong>Time Period:</strong> ${results.years.toFixed(2)} years</li>
        <li><strong>Interest Rate:</strong> ${results.interestRate}% per annum</li>
        <li><strong>Compounding Frequency:</strong> ${results.compoundFreq === 1 ? 'Annual' :
            results.compoundFreq === 2 ? 'Semi-annual' :
            results.compoundFreq === 4 ? 'Quarterly' :
            results.compoundFreq === 12 ? 'Monthly' : 'Daily'}</li>
    `;
    
    if (results.taxAmount > 0) {
        summaryHTML += `
            <li><strong>Tax Amount:</strong> ₹${results.taxAmount.toFixed(2)}</li>
            <li><strong>After-Tax Future Value:</strong> ₹${results.afterTaxValue.toFixed(2)}</li>
        `;
    }
    
    if (results.includeInflation) {
        summaryHTML += `
            <li><strong>Inflation Rate:</strong> ${results.inflationRate}% per annum</li>
            <li><strong>Real Future Value:</strong> ₹${results.realValue.toFixed(2)}</li>
        `;
    }
    
    document.getElementById('fv-summary').innerHTML = summaryHTML;
    
    // Display breakdown
    const tbody = document.getElementById('fv-breakdown');
    tbody.innerHTML = results.yearlyData.map(data => `
        <tr>
            <td>${data.year}</td>
            <td>₹${data.deposits.toFixed(2)}</td>
            <td>₹${data.interest.toFixed(2)}</td>
            <td>₹${data.balance.toFixed(2)}</td>
            <td>₹${data.realValue.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Create chart
    const ctx = document.getElementById('fv-chart').getContext('2d');
    if (window.fvChart) window.fvChart.destroy();
    
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
    
    if (results.includeInflation) {
        datasets.push({
            label: 'Real Value',
            data: results.yearlyData.map(data => data.realValue),
            borderColor: '#FF6384',
            tension: 0.1,
            fill: false
        });
    }
    
    window.fvChart = new Chart(ctx, {
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
                    text: 'Value Growth Over Time'
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
