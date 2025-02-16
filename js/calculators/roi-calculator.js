function loadROICalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('ROI Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Initial Investment</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="roi-investment" placeholder="Enter initial investment">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Final Value</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="roi-final-value" placeholder="Enter final value">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Time Period</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="roi-time" placeholder="Enter time period">
                        <select class="form-select" id="roi-time-unit">
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                            <option value="days">Days</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Additional Costs</label>
                    <div id="costs-container">
                        <div class="input-group mb-2">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control cost-input" placeholder="Enter cost amount">
                            <input type="text" class="form-control" placeholder="Cost description">
                            <button class="btn btn-outline-danger" onclick="removeCost(this)">×</button>
                        </div>
                    </div>
                    <button class="btn btn-outline-secondary btn-sm" onclick="addCost()">+ Add Cost</button>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Additional Benefits</label>
                    <div id="benefits-container">
                        <div class="input-group mb-2">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control benefit-input" placeholder="Enter benefit amount">
                            <input type="text" class="form-control" placeholder="Benefit description">
                            <button class="btn btn-outline-danger" onclick="removeBenefit(this)">×</button>
                        </div>
                    </div>
                    <button class="btn btn-outline-secondary btn-sm" onclick="addBenefit()">+ Add Benefit</button>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="roi-tax">
                        <label class="form-check-label">Include Tax Impact</label>
                    </div>
                    <div id="roi-tax-input" class="mt-2" style="display: none;">
                        <label class="form-label">Tax Rate (%)</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="roi-tax-rate" value="20" step="0.1">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateROI()">Calculate ROI</button>
            </div>
            
            <div class="col-md-6">
                <div id="roi-result" class="result-box mt-3" style="display: none;">
                    <h4>ROI Analysis Results</h4>
                    
                    <div class="mb-3">
                        <h5>Return on Investment</h5>
                        <p id="roi-value" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Investment Summary</h5>
                        <ul class="list-unstyled" id="roi-summary"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Detailed Breakdown</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody id="roi-breakdown"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="roi-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add event listener for tax checkbox
    document.getElementById('roi-tax').addEventListener('change', function() {
        document.getElementById('roi-tax-input').style.display = 
            this.checked ? 'block' : 'none';
    });
}

function addCost() {
    const container = document.getElementById('costs-container');
    const div = document.createElement('div');
    div.className = 'input-group mb-2';
    div.innerHTML = `
        <span class="input-group-text">₹</span>
        <input type="number" class="form-control cost-input" placeholder="Enter cost amount">
        <input type="text" class="form-control" placeholder="Cost description">
        <button class="btn btn-outline-danger" onclick="removeCost(this)">×</button>
    `;
    container.appendChild(div);
}

function removeCost(button) {
    button.parentElement.remove();
}

function addBenefit() {
    const container = document.getElementById('benefits-container');
    const div = document.createElement('div');
    div.className = 'input-group mb-2';
    div.innerHTML = `
        <span class="input-group-text">₹</span>
        <input type="number" class="form-control benefit-input" placeholder="Enter benefit amount">
        <input type="text" class="form-control" placeholder="Benefit description">
        <button class="btn btn-outline-danger" onclick="removeBenefit(this)">×</button>
    `;
    container.appendChild(div);
}

function removeBenefit(button) {
    button.parentElement.remove();
}

function calculateROI() {
    const investment = parseFloat(document.getElementById('roi-investment').value);
    const finalValue = parseFloat(document.getElementById('roi-final-value').value);
    const time = parseFloat(document.getElementById('roi-time').value);
    const timeUnit = document.getElementById('roi-time-unit').value;
    const includeTax = document.getElementById('roi-tax').checked;
    const taxRate = includeTax ? parseFloat(document.getElementById('roi-tax-rate').value) : 0;
    
    if (isNaN(investment) || isNaN(finalValue) || isNaN(time)) {
        alert('Please enter valid numbers for investment, final value, and time period');
        return;
    }
    
    // Collect additional costs
    const costs = Array.from(document.getElementsByClassName('cost-input'))
        .map(input => {
            const amount = parseFloat(input.value) || 0;
            const description = input.nextElementSibling.value || 'Additional Cost';
            return { amount, description };
        })
        .filter(cost => cost.amount > 0);
    
    // Collect additional benefits
    const benefits = Array.from(document.getElementsByClassName('benefit-input'))
        .map(input => {
            const amount = parseFloat(input.value) || 0;
            const description = input.nextElementSibling.value || 'Additional Benefit';
            return { amount, description };
        })
        .filter(benefit => benefit.amount > 0);
    
    // Calculate total costs and benefits
    const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, investment);
    const totalBenefits = benefits.reduce((sum, benefit) => sum + benefit.amount, finalValue);
    
    // Calculate ROI
    const netProfit = totalBenefits - totalCosts;
    const roi = (netProfit / totalCosts) * 100;
    
    // Calculate annualized ROI
    let years;
    switch (timeUnit) {
        case 'months':
            years = time / 12;
            break;
        case 'days':
            years = time / 365;
            break;
        default:
            years = time;
    }
    
    const annualizedROI = (Math.pow(1 + roi/100, 1/years) - 1) * 100;
    
    // Calculate tax impact if requested
    const taxAmount = includeTax ? netProfit * (taxRate/100) : 0;
    const afterTaxProfit = netProfit - taxAmount;
    const afterTaxROI = (afterTaxProfit / totalCosts) * 100;
    
    displayROIResults({
        investment,
        finalValue,
        costs,
        benefits,
        roi,
        annualizedROI,
        time,
        timeUnit,
        taxRate,
        taxAmount,
        afterTaxROI,
        netProfit,
        afterTaxProfit
    });
}

function displayROIResults(results) {
    document.getElementById('roi-result').style.display = 'block';
    
    // Display ROI
    document.getElementById('roi-value').textContent = 
        `${results.roi.toFixed(2)}%`;
    
    // Display summary
    let summaryHTML = `
        <li><strong>Initial Investment:</strong> ₹${results.investment.toFixed(2)}</li>
        <li><strong>Final Value:</strong> ₹${results.finalValue.toFixed(2)}</li>
        <li><strong>Net Profit:</strong> ₹${results.netProfit.toFixed(2)}</li>
        <li><strong>ROI:</strong> ${results.roi.toFixed(2)}%</li>
        <li><strong>Annualized ROI:</strong> ${results.annualizedROI.toFixed(2)}%</li>
    `;
    
    if (results.taxAmount > 0) {
        summaryHTML += `
            <li><strong>Tax Amount:</strong> ₹${results.taxAmount.toFixed(2)}</li>
            <li><strong>After-Tax Profit:</strong> ₹${results.afterTaxProfit.toFixed(2)}</li>
            <li><strong>After-Tax ROI:</strong> ${results.afterTaxROI.toFixed(2)}%</li>
        `;
    }
    
    document.getElementById('roi-summary').innerHTML = summaryHTML;
    
    // Display breakdown
    const tbody = document.getElementById('roi-breakdown');
    let breakdownHTML = `
        <tr class="table-primary">
            <td>Initial Investment</td>
            <td>₹${results.investment.toFixed(2)}</td>
            <td>Starting investment amount</td>
        </tr>
    `;
    
    results.costs.forEach(cost => {
        breakdownHTML += `
            <tr class="table-danger">
                <td>Additional Cost</td>
                <td>₹${cost.amount.toFixed(2)}</td>
                <td>${cost.description}</td>
            </tr>
        `;
    });
    
    results.benefits.forEach(benefit => {
        breakdownHTML += `
            <tr class="table-success">
                <td>Additional Benefit</td>
                <td>₹${benefit.amount.toFixed(2)}</td>
                <td>${benefit.description}</td>
            </tr>
        `;
    });
    
    breakdownHTML += `
        <tr class="table-info">
            <td>Final Value</td>
            <td>₹${results.finalValue.toFixed(2)}</td>
            <td>Final investment value</td>
        </tr>
    `;
    
    if (results.taxAmount > 0) {
        breakdownHTML += `
            <tr class="table-warning">
                <td>Tax Impact</td>
                <td>₹${results.taxAmount.toFixed(2)}</td>
                <td>Tax at ${results.taxRate}% rate</td>
            </tr>
        `;
    }
    
    tbody.innerHTML = breakdownHTML;
    
    // Create chart
    const ctx = document.getElementById('roi-chart').getContext('2d');
    if (window.roiChart) window.roiChart.destroy();
    
    const chartData = {
        investment: -results.investment,
        costs: -results.costs.reduce((sum, cost) => sum + cost.amount, 0),
        benefits: results.benefits.reduce((sum, benefit) => sum + benefit.amount, 0),
        finalValue: results.finalValue,
        tax: -results.taxAmount
    };
    
    window.roiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Investment Components'],
            datasets: [
                {
                    label: 'Initial Investment',
                    data: [chartData.investment],
                    backgroundColor: '#36A2EB'
                },
                {
                    label: 'Additional Costs',
                    data: [chartData.costs],
                    backgroundColor: '#FF6384'
                },
                {
                    label: 'Additional Benefits',
                    data: [chartData.benefits],
                    backgroundColor: '#4BC0C0'
                },
                {
                    label: 'Final Value',
                    data: [chartData.finalValue],
                    backgroundColor: '#FFCE56'
                },
                {
                    label: 'Tax Impact',
                    data: [chartData.tax],
                    backgroundColor: '#FF9F40'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Investment Components Breakdown'
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: value => '₹' + value.toFixed(0)
                    }
                }
            }
        }
    });
}
