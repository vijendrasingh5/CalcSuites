function loadInvestmentCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Investment Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Initial Investment</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="investment-initial" placeholder="Enter initial investment">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Regular Investment</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="investment-regular" placeholder="Enter regular investment amount">
                        <select class="form-select" id="investment-frequency">
                            <option value="12">Monthly</option>
                            <option value="4">Quarterly</option>
                            <option value="2">Semi-Annually</option>
                            <option value="1">Annually</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Expected Annual Return (%)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="investment-return" step="0.1" placeholder="Enter expected return rate">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Investment Period</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="investment-period" placeholder="Enter investment period">
                        <select class="form-select" id="investment-period-unit">
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Investment Type</label>
                    <select class="form-select" id="investment-type">
                        <option value="growth">Growth (Reinvest Returns)</option>
                        <option value="income">Income (Withdraw Returns)</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Risk Level</label>
                    <select class="form-select" id="risk-level" onchange="updateRiskProfile()">
                        <option value="conservative">Conservative (Lower Risk)</option>
                        <option value="moderate">Moderate (Balanced)</option>
                        <option value="aggressive">Aggressive (Higher Risk)</option>
                    </select>
                </div>
                
                <button class="btn btn-primary" onclick="calculateInvestment()">Calculate Investment</button>
            </div>
            
            <div class="col-md-6">
                <div id="investment-result" class="result-box mt-3" style="display: none;">
                    <h4>Investment Projection</h4>
                    
                    <div class="mb-3">
                        <h5>Final Investment Value</h5>
                        <p id="final-value" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Investment Summary</h5>
                        <ul class="list-unstyled" id="investment-summary"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Risk Profile</h5>
                        <div id="risk-profile" class="alert alert-info"></div>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Year-by-Year Breakdown</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Year</th>
                                        <th>Starting Balance</th>
                                        <th>Contributions</th>
                                        <th>Returns</th>
                                        <th>Ending Balance</th>
                                    </tr>
                                </thead>
                                <tbody id="investment-breakdown"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="investment-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    updateRiskProfile();
}

function updateRiskProfile() {
    const riskLevel = document.getElementById('risk-level').value;
    const riskProfiles = {
        conservative: {
            description: 'Conservative portfolio focused on capital preservation. Suggested asset allocation: 70-80% bonds, 20-30% stocks.',
            returnRange: '4-6%',
            volatility: 'Low'
        },
        moderate: {
            description: 'Balanced portfolio seeking growth and income. Suggested asset allocation: 40-60% bonds, 40-60% stocks.',
            returnRange: '6-8%',
            volatility: 'Medium'
        },
        aggressive: {
            description: 'Growth-oriented portfolio accepting higher risk. Suggested asset allocation: 10-30% bonds, 70-90% stocks.',
            returnRange: '8-10%',
            volatility: 'High'
        }
    };
    
    const profile = riskProfiles[riskLevel];
    const profileHTML = `
        <p><strong>Strategy:</strong> ${profile.description}</p>
        <p><strong>Expected Return Range:</strong> ${profile.returnRange}</p>
        <p><strong>Volatility:</strong> ${profile.volatility}</p>
    `;
    
    const riskProfileDiv = document.getElementById('risk-profile');
    if (riskProfileDiv) {
        riskProfileDiv.innerHTML = profileHTML;
    }
}

function calculateInvestment() {
    const initialInvestment = parseFloat(document.getElementById('investment-initial').value) || 0;
    const regularInvestment = parseFloat(document.getElementById('investment-regular').value) || 0;
    const returnRate = parseFloat(document.getElementById('investment-return').value);
    const period = parseFloat(document.getElementById('investment-period').value);
    const periodUnit = document.getElementById('investment-period-unit').value;
    const frequency = parseInt(document.getElementById('investment-frequency').value);
    const investmentType = document.getElementById('investment-type').value;
    
    if (isNaN(returnRate) || isNaN(period)) {
        alert('Please enter valid numbers for all required fields');
        return;
    }
    
    // Convert period to years if needed
    const yearsToInvest = periodUnit === 'months' ? period / 12 : period;
    
    // Calculate investment growth
    const yearlyData = [];
    let balance = initialInvestment;
    let totalContributions = initialInvestment;
    let totalReturns = 0;
    
    for (let year = 1; year <= Math.ceil(yearsToInvest); year++) {
        const yearFraction = year === Math.ceil(yearsToInvest) ? 
            yearsToInvest - Math.floor(yearsToInvest) : 1;
        
        const startBalance = balance;
        const yearlyContribution = regularInvestment * frequency * yearFraction;
        totalContributions += yearlyContribution;
        
        // Calculate returns
        const yearlyReturn = ((startBalance + yearlyContribution / 2) * returnRate / 100) * yearFraction;
        totalReturns += yearlyReturn;
        
        // Update balance based on investment type
        if (investmentType === 'growth') {
            balance += yearlyContribution + yearlyReturn;
        } else { // income
            balance += yearlyContribution;
        }
        
        yearlyData.push({
            year,
            startBalance,
            contributions: yearlyContribution,
            returns: yearlyReturn,
            endBalance: balance
        });
    }
    
    displayInvestmentResults({
        finalValue: balance,
        totalContributions,
        totalReturns,
        yearlyData
    });
}

function displayInvestmentResults(results) {
    document.getElementById('investment-result').style.display = 'block';
    
    // Display final value
    document.getElementById('final-value').textContent = 
        `₹${results.finalValue.toFixed(2)}`;
    
    // Display investment summary
    document.getElementById('investment-summary').innerHTML = `
        <li><strong>Total Contributions:</strong> ₹${results.totalContributions.toFixed(2)}</li>
        <li><strong>Total Returns:</strong> ₹${results.totalReturns.toFixed(2)}</li>
        <li><strong>Return on Investment:</strong> ${((results.totalReturns / results.totalContributions) * 100).toFixed(2)}%</li>
    `;
    
    // Display yearly breakdown
    const tbody = document.getElementById('investment-breakdown');
    tbody.innerHTML = results.yearlyData.map(data => `
        <tr>
            <td>${data.year}</td>
            <td>₹${data.startBalance.toFixed(2)}</td>
            <td>₹${data.contributions.toFixed(2)}</td>
            <td>₹${data.returns.toFixed(2)}</td>
            <td>₹${data.endBalance.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Create investment growth chart
    const ctx = document.getElementById('investment-chart').getContext('2d');
    if (window.investmentChart) window.investmentChart.destroy();
    
    const labels = results.yearlyData.map(data => `Year ${data.year}`);
    const contributions = results.yearlyData.map(data => 
        data.year === 1 ? results.totalContributions : data.contributions);
    const returns = results.yearlyData.map(data => data.returns);
    
    window.investmentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Contributions',
                    data: contributions,
                    backgroundColor: '#36A2EB'
                },
                {
                    label: 'Returns',
                    data: returns,
                    backgroundColor: '#FF6384'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Investment Growth Breakdown'
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
