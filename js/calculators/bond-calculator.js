function loadBondCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Bond Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Face Value (Par Value)</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="bond-face-value" placeholder="Enter face value">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Coupon Rate (Annual)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="bond-coupon-rate" step="0.01" placeholder="Enter coupon rate">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Market Price</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="bond-market-price" placeholder="Enter market price">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Years to Maturity</label>
                    <input type="number" class="form-control" id="bond-years" step="0.5" placeholder="Enter years to maturity">
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Payment Frequency</label>
                    <select class="form-select" id="bond-payment-freq">
                        <option value="1">Annual</option>
                        <option value="2">Semi-annual</option>
                        <option value="4">Quarterly</option>
                        <option value="12">Monthly</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="bond-tax">
                        <label class="form-check-label">Include Tax Calculations</label>
                    </div>
                    <div id="bond-tax-input" class="mt-2" style="display: none;">
                        <label class="form-label">Tax Rate (%)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="bond-tax-rate" value="10" step="0.1">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateBond()">Calculate Bond</button>
            </div>
            
            <div class="col-md-6">
                <div id="bond-result" class="result-box mt-3" style="display: none;">
                    <h4>Bond Analysis Results</h4>
                    
                    <div class="mb-3">
                        <h5>Yield to Maturity (YTM)</h5>
                        <p id="bond-ytm" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Key Metrics</h5>
                        <ul class="list-unstyled" id="bond-metrics"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Payment Schedule</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Payment</th>
                                        <th>Interest</th>
                                        <th>Principal</th>
                                        <th>Remaining</th>
                                    </tr>
                                </thead>
                                <tbody id="bond-schedule"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="bond-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add event listener for tax checkbox
    document.getElementById('bond-tax').addEventListener('change', function() {
        document.getElementById('bond-tax-input').style.display = 
            this.checked ? 'block' : 'none';
    });
}

function calculateBond() {
    const faceValue = parseFloat(document.getElementById('bond-face-value').value);
    const couponRate = parseFloat(document.getElementById('bond-coupon-rate').value);
    const marketPrice = parseFloat(document.getElementById('bond-market-price').value);
    const years = parseFloat(document.getElementById('bond-years').value);
    const paymentFreq = parseInt(document.getElementById('bond-payment-freq').value);
    const includeTax = document.getElementById('bond-tax').checked;
    const taxRate = includeTax ? parseFloat(document.getElementById('bond-tax-rate').value) : 0;
    
    if ([faceValue, couponRate, marketPrice, years].some(isNaN)) {
        alert('Please enter valid numbers for all required fields');
        return;
    }
    
    // Calculate basic bond metrics
    const periodsPerYear = paymentFreq;
    const totalPeriods = years * periodsPerYear;
    const couponPayment = (faceValue * (couponRate/100)) / periodsPerYear;
    
    // Calculate Yield to Maturity (YTM) using Newton-Raphson method
    const ytm = calculateYTM(faceValue, marketPrice, couponPayment, totalPeriods, periodsPerYear);
    
    // Calculate current yield
    const currentYield = (couponPayment * periodsPerYear / marketPrice) * 100;
    
    // Calculate duration and other metrics
    const duration = calculateDuration(faceValue, marketPrice, couponPayment, totalPeriods, ytm/100, periodsPerYear);
    const modifiedDuration = duration / (1 + ytm/100/periodsPerYear);
    
    // Generate payment schedule
    const schedule = [];
    let remainingPrincipal = faceValue;
    let totalInterest = 0;
    
    for (let period = 1; period <= totalPeriods; period++) {
        const interest = couponPayment;
        const principalPayment = period === totalPeriods ? remainingPrincipal : 0;
        const totalPayment = interest + principalPayment;
        const tax = includeTax ? interest * (taxRate/100) : 0;
        
        remainingPrincipal -= principalPayment;
        totalInterest += interest;
        
        schedule.push({
            period,
            payment: totalPayment,
            interest,
            principal: principalPayment,
            remaining: remainingPrincipal,
            tax
        });
    }
    
    displayBondResults({
        faceValue,
        marketPrice,
        couponRate,
        years,
        paymentFreq,
        ytm,
        currentYield,
        duration,
        modifiedDuration,
        totalInterest,
        schedule
    });
}

function calculateYTM(faceValue, price, couponPayment, periods, frequency) {
    // Newton-Raphson method to find YTM
    let ytm = 0.1; // Initial guess
    const tolerance = 0.0001;
    const maxIterations = 100;
    let iteration = 0;
    
    while (iteration < maxIterations) {
        let pv = 0;
        const r = ytm / frequency;
        
        // Calculate present value of all payments
        for (let t = 1; t <= periods; t++) {
            if (t === periods) {
                pv += (couponPayment + faceValue) / Math.pow(1 + r, t);
            } else {
                pv += couponPayment / Math.pow(1 + r, t);
            }
        }
        
        const diff = pv - price;
        if (Math.abs(diff) < tolerance) {
            break;
        }
        
        // Calculate derivative
        let derivative = 0;
        for (let t = 1; t <= periods; t++) {
            if (t === periods) {
                derivative -= t * (couponPayment + faceValue) / Math.pow(1 + r, t + 1);
            } else {
                derivative -= t * couponPayment / Math.pow(1 + r, t + 1);
            }
        }
        
        // Update YTM
        ytm = ytm - diff / derivative;
        iteration++;
    }
    
    return ytm * frequency * 100;
}

function calculateDuration(faceValue, price, couponPayment, periods, ytm, frequency) {
    let weightedTime = 0;
    let totalPV = 0;
    const r = ytm / frequency;
    
    for (let t = 1; t <= periods; t++) {
        const payment = t === periods ? couponPayment + faceValue : couponPayment;
        const pv = payment / Math.pow(1 + r, t);
        weightedTime += t * pv;
        totalPV += pv;
    }
    
    return weightedTime / totalPV / frequency;
}

function displayBondResults(results) {
    document.getElementById('bond-result').style.display = 'block';
    
    // Display YTM
    document.getElementById('bond-ytm').textContent = 
        `${results.ytm.toFixed(2)}%`;
    
    // Display metrics
    const metricsHTML = `
        <li><strong>Face Value:</strong> ₹${results.faceValue.toFixed(2)}</li>
        <li><strong>Market Price:</strong> ₹${results.marketPrice.toFixed(2)}</li>
        <li><strong>Coupon Rate:</strong> ${results.couponRate}%</li>
        <li><strong>Current Yield:</strong> ${results.currentYield.toFixed(2)}%</li>
        <li><strong>Yield to Maturity:</strong> ${results.ytm.toFixed(2)}%</li>
        <li><strong>Duration:</strong> ${results.duration.toFixed(2)} years</li>
        <li><strong>Modified Duration:</strong> ${results.modifiedDuration.toFixed(2)}</li>
        <li><strong>Total Interest:</strong> ₹${results.totalInterest.toFixed(2)}</li>
    `;
    
    document.getElementById('bond-metrics').innerHTML = metricsHTML;
    
    // Display schedule
    const tbody = document.getElementById('bond-schedule');
    tbody.innerHTML = results.schedule.map(data => `
        <tr>
            <td>${data.period}</td>
            <td>₹${data.payment.toFixed(2)}</td>
            <td>₹${data.interest.toFixed(2)}</td>
            <td>₹${data.principal.toFixed(2)}</td>
            <td>₹${data.remaining.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Create chart
    const ctx = document.getElementById('bond-chart').getContext('2d');
    if (window.bondChart) window.bondChart.destroy();
    
    const labels = results.schedule.map(data => `Period ${data.period}`);
    
    window.bondChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Interest Payment',
                    data: results.schedule.map(data => data.interest),
                    borderColor: '#36A2EB',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Principal Payment',
                    data: results.schedule.map(data => data.principal),
                    borderColor: '#FF6384',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Remaining Principal',
                    data: results.schedule.map(data => data.remaining),
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
                    text: 'Bond Payment Schedule'
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
