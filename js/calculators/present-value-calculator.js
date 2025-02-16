function loadPresentValueCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Present Value Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="pv-calc-type">
                        <option value="single">Single Amount</option>
                        <option value="annuity">Annuity Payments</option>
                        <option value="growing">Growing Annuity</option>
                        <option value="perpetuity">Perpetuity</option>
                    </select>
                </div>
                
                <div id="single-amount-inputs">
                    <div class="mb-3">
                        <label class="form-label">Future Amount</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control" id="pv-future-amount" placeholder="Enter future amount">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Time Period</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="pv-time" placeholder="Enter time period">
                            <select class="form-select" id="pv-time-unit">
                                <option value="years">Years</option>
                                <option value="months">Months</option>
                                <option value="quarters">Quarters</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div id="annuity-inputs" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Payment Amount</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control" id="pv-payment" placeholder="Enter payment amount">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Number of Payments</label>
                        <input type="number" class="form-control" id="pv-num-payments" placeholder="Enter number of payments">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Payment Timing</label>
                        <select class="form-select" id="pv-payment-timing">
                            <option value="end">End of Period (Ordinary Annuity)</option>
                            <option value="start">Start of Period (Annuity Due)</option>
                        </select>
                    </div>
                </div>
                
                <div id="growing-inputs" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Growth Rate (% per period)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="pv-growth-rate" step="0.1" placeholder="Enter growth rate">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Discount Rate (% per annum)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="pv-discount-rate" step="0.1" placeholder="Enter discount rate">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Compounding Frequency</label>
                    <select class="form-select" id="pv-compound-freq">
                        <option value="1">Annually</option>
                        <option value="2">Semi-annually</option>
                        <option value="4">Quarterly</option>
                        <option value="12">Monthly</option>
                        <option value="365">Daily</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="pv-inflation">
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
                
                <button class="btn btn-primary" onclick="calculatePresentValue()">Calculate Present Value</button>
            </div>
            
            <div class="col-md-6">
                <div id="pv-result" class="result-box mt-3" style="display: none;">
                    <h4>Present Value Analysis</h4>
                    
                    <div class="mb-3">
                        <h5>Present Value</h5>
                        <p id="present-value" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Calculation Summary</h5>
                        <ul class="list-unstyled" id="pv-summary"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Period Breakdown</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Cash Flow</th>
                                        <th>Present Value</th>
                                        <th>Discount Factor</th>
                                    </tr>
                                </thead>
                                <tbody id="pv-breakdown"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="pv-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add event listeners
    document.getElementById('pv-calc-type').addEventListener('change', function() {
        document.getElementById('single-amount-inputs').style.display = 
            this.value === 'single' ? 'block' : 'none';
        document.getElementById('annuity-inputs').style.display = 
            (this.value === 'annuity' || this.value === 'growing') ? 'block' : 'none';
        document.getElementById('growing-inputs').style.display = 
            this.value === 'growing' ? 'block' : 'none';
    });
    
    document.getElementById('pv-inflation').addEventListener('change', function() {
        document.getElementById('inflation-input').style.display = 
            this.checked ? 'block' : 'none';
    });
}

function calculatePresentValue() {
    const calcType = document.getElementById('pv-calc-type').value;
    const discountRate = parseFloat(document.getElementById('pv-discount-rate').value);
    const compoundFreq = parseInt(document.getElementById('pv-compound-freq').value);
    const includeInflation = document.getElementById('pv-inflation').checked;
    const inflationRate = includeInflation ? 
        parseFloat(document.getElementById('inflation-rate').value) : 0;
    
    if (isNaN(discountRate)) {
        alert('Please enter a valid discount rate');
        return;
    }
    
    let presentValue = 0;
    let cashFlows = [];
    let periods = 0;
    
    // Adjust rates for compounding frequency
    const effectiveRate = (1 + discountRate/100/compoundFreq) ** compoundFreq - 1;
    const effectiveInflation = includeInflation ? 
        (1 + inflationRate/100/compoundFreq) ** compoundFreq - 1 : 0;
    const realRate = (1 + effectiveRate) / (1 + effectiveInflation) - 1;
    
    switch (calcType) {
        case 'single': {
            const futureAmount = parseFloat(document.getElementById('pv-future-amount').value);
            const time = parseFloat(document.getElementById('pv-time').value);
            const timeUnit = document.getElementById('pv-time-unit').value;
            
            if (isNaN(futureAmount) || isNaN(time)) {
                alert('Please enter valid numbers for amount and time');
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
            
            periods = years * compoundFreq;
            presentValue = futureAmount / Math.pow(1 + realRate, periods);
            
            // Generate cash flows for visualization
            cashFlows = [{
                period: periods,
                amount: futureAmount,
                presentValue: presentValue,
                discountFactor: 1 / Math.pow(1 + realRate, periods)
            }];
            break;
        }
        
        case 'annuity':
        case 'growing': {
            const payment = parseFloat(document.getElementById('pv-payment').value);
            const numPayments = parseInt(document.getElementById('pv-num-payments').value);
            const paymentTiming = document.getElementById('pv-payment-timing').value;
            const growthRate = calcType === 'growing' ? 
                parseFloat(document.getElementById('pv-growth-rate').value) / 100 : 0;
            
            if (isNaN(payment) || isNaN(numPayments)) {
                alert('Please enter valid numbers for payment and number of payments');
                return;
            }
            
            periods = numPayments;
            let pvFactor = 0;
            
            if (calcType === 'growing' && growthRate >= realRate) {
                alert('Growth rate must be less than discount rate for growing annuity');
                return;
            }
            
            // Calculate present value and generate cash flows
            for (let t = 1; t <= periods; t++) {
                const growthFactor = calcType === 'growing' ? Math.pow(1 + growthRate, t - 1) : 1;
                const timeAdjustment = paymentTiming === 'start' ? t - 1 : t;
                const periodPayment = payment * growthFactor;
                const periodPV = periodPayment / Math.pow(1 + realRate, timeAdjustment);
                
                presentValue += periodPV;
                
                cashFlows.push({
                    period: t,
                    amount: periodPayment,
                    presentValue: periodPV,
                    discountFactor: 1 / Math.pow(1 + realRate, timeAdjustment)
                });
            }
            break;
        }
        
        case 'perpetuity': {
            const payment = parseFloat(document.getElementById('pv-payment').value);
            
            if (isNaN(payment)) {
                alert('Please enter a valid payment amount');
                return;
            }
            
            presentValue = payment / realRate;
            periods = 20; // Show first 20 periods for visualization
            
            // Generate cash flows for visualization
            for (let t = 1; t <= periods; t++) {
                cashFlows.push({
                    period: t,
                    amount: payment,
                    presentValue: payment / Math.pow(1 + realRate, t),
                    discountFactor: 1 / Math.pow(1 + realRate, t)
                });
            }
            break;
        }
    }
    
    displayPresentValueResults({
        presentValue,
        cashFlows,
        calcType,
        discountRate,
        inflationRate,
        realRate,
        compoundFreq,
        includeInflation
    });
}

function displayPresentValueResults(results) {
    document.getElementById('pv-result').style.display = 'block';
    
    // Display present value
    document.getElementById('present-value').textContent = 
        `₹${results.presentValue.toFixed(2)}`;
    
    // Display summary
    let summaryHTML = `
        <li><strong>Present Value:</strong> ₹${results.presentValue.toFixed(2)}</li>
        <li><strong>Calculation Type:</strong> ${results.calcType.charAt(0).toUpperCase() + results.calcType.slice(1)}</li>
        <li><strong>Nominal Discount Rate:</strong> ${results.discountRate}% per annum</li>
        <li><strong>Compounding Frequency:</strong> ${results.compoundFreq === 1 ? 'Annual' :
            results.compoundFreq === 2 ? 'Semi-annual' :
            results.compoundFreq === 4 ? 'Quarterly' :
            results.compoundFreq === 12 ? 'Monthly' : 'Daily'}</li>
    `;
    
    if (results.includeInflation) {
        summaryHTML += `
            <li><strong>Inflation Rate:</strong> ${results.inflationRate}% per annum</li>
            <li><strong>Real Discount Rate:</strong> ${(results.realRate * 100).toFixed(2)}% per annum</li>
        `;
    }
    
    document.getElementById('pv-summary').innerHTML = summaryHTML;
    
    // Display breakdown
    const tbody = document.getElementById('pv-breakdown');
    tbody.innerHTML = results.cashFlows.map(flow => `
        <tr>
            <td>${flow.period}</td>
            <td>₹${flow.amount.toFixed(2)}</td>
            <td>₹${flow.presentValue.toFixed(2)}</td>
            <td>${flow.discountFactor.toFixed(4)}</td>
        </tr>
    `).join('');
    
    // Create chart
    const ctx = document.getElementById('pv-chart').getContext('2d');
    if (window.pvChart) window.pvChart.destroy();
    
    const labels = results.cashFlows.map(flow => `Period ${flow.period}`);
    
    window.pvChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cash Flow',
                    data: results.cashFlows.map(flow => flow.amount),
                    backgroundColor: '#36A2EB',
                    type: 'bar'
                },
                {
                    label: 'Present Value',
                    data: results.cashFlows.map(flow => flow.presentValue),
                    backgroundColor: '#FF6384',
                    type: 'bar'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Cash Flows and Present Values'
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
