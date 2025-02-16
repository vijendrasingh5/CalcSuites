function loadAverageReturnCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Average Return Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Return Data Input Method</label>
                    <select class="form-select" id="return-input-method">
                        <option value="periodic">Periodic Returns</option>
                        <option value="value">Investment Values</option>
                    </select>
                </div>
                
                <div id="periodic-returns-input">
                    <div class="mb-3">
                        <label class="form-label">Enter Returns (one per line, in %)</label>
                        <textarea class="form-control" id="returns-input" rows="5" 
                            placeholder="Enter returns (e.g.):&#10;10.5&#10;-5.2&#10;15.7&#10;8.3"></textarea>
                    </div>
                </div>
                
                <div id="investment-values-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Enter Investment Values (one per line)</label>
                        <textarea class="form-control" id="values-input" rows="5" 
                            placeholder="Enter values (e.g.):&#10;10000&#10;11500&#10;10800&#10;12400"></textarea>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Return Type</label>
                    <select class="form-select" id="return-type">
                        <option value="arithmetic">Arithmetic Mean (Simple Average)</option>
                        <option value="geometric">Geometric Mean (CAGR)</option>
                        <option value="dollar">Dollar-Weighted Return (IRR)</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Time Period</label>
                    <select class="form-select" id="time-period">
                        <option value="annual">Annual</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="include-risk-metrics">
                        <label class="form-check-label">Include Risk Metrics</label>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateAverageReturn()">Calculate Returns</button>
            </div>
            
            <div class="col-md-6">
                <div id="return-result" class="result-box mt-3" style="display: none;">
                    <h4>Return Analysis Results</h4>
                    
                    <div class="mb-3">
                        <h5>Average Return</h5>
                        <p id="avg-return" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Return Metrics</h5>
                        <ul class="list-unstyled" id="return-metrics"></ul>
                    </div>
                    
                    <div id="risk-metrics" class="mb-3" style="display: none;">
                        <h5>Risk Metrics</h5>
                        <ul class="list-unstyled" id="risk-metrics-list"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Return Distribution</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Return</th>
                                        <th>Cumulative</th>
                                    </tr>
                                </thead>
                                <tbody id="return-distribution"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="return-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add event listeners
    document.getElementById('return-input-method').addEventListener('change', function() {
        document.getElementById('periodic-returns-input').style.display = 
            this.value === 'periodic' ? 'block' : 'none';
        document.getElementById('investment-values-input').style.display = 
            this.value === 'value' ? 'block' : 'none';
    });
}

function calculateAverageReturn() {
    const inputMethod = document.getElementById('return-input-method').value;
    const returnType = document.getElementById('return-type').value;
    const timePeriod = document.getElementById('time-period').value;
    const includeRisk = document.getElementById('include-risk-metrics').checked;
    
    let returns = [];
    let values = [];
    
    if (inputMethod === 'periodic') {
        const returnsText = document.getElementById('returns-input').value;
        returns = returnsText.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '')
            .map(line => parseFloat(line));
            
        if (returns.some(isNaN)) {
            alert('Please enter valid numbers for returns');
            return;
        }
    } else {
        const valuesText = document.getElementById('values-input').value;
        values = valuesText.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '')
            .map(line => parseFloat(line));
            
        if (values.some(isNaN)) {
            alert('Please enter valid numbers for values');
            return;
        }
        
        // Calculate periodic returns from values
        returns = [];
        for (let i = 1; i < values.length; i++) {
            const periodicReturn = ((values[i] - values[i-1]) / values[i-1]) * 100;
            returns.push(periodicReturn);
        }
    }
    
    if (returns.length === 0) {
        alert('Please enter at least one return value');
        return;
    }
    
    // Calculate average return based on selected method
    let averageReturn;
    switch (returnType) {
        case 'arithmetic':
            averageReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
            break;
            
        case 'geometric':
            averageReturn = (Math.pow(returns.reduce((prod, r) => prod * (1 + r/100), 1), 
                1/returns.length) - 1) * 100;
            break;
            
        case 'dollar':
            if (values.length === 0) {
                alert('Dollar-weighted return requires investment values');
                return;
            }
            averageReturn = calculateIRR(values);
            break;
    }
    
    // Calculate risk metrics
    const riskMetrics = calculateRiskMetrics(returns);
    
    // Calculate cumulative returns
    const cumulativeReturns = returns.reduce((acc, r) => {
        const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : 100;
        const cumulative = prev * (1 + r/100);
        acc.push({
            return: r,
            cumulative
        });
        return acc;
    }, []);
    
    displayReturnResults({
        returns,
        averageReturn,
        returnType,
        timePeriod,
        riskMetrics,
        cumulativeReturns,
        includeRisk
    });
}

function calculateRiskMetrics(returns) {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    
    // Standard deviation
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / 
        (returns.length - 1);
    const stdDev = Math.sqrt(variance);
    
    // Sharpe ratio (assuming risk-free rate of 3%)
    const riskFreeRate = 3;
    const sharpeRatio = (mean - riskFreeRate) / stdDev;
    
    // Maximum drawdown
    let maxDrawdown = 0;
    let peak = 100;
    let cumulative = 100;
    
    for (const r of returns) {
        cumulative *= (1 + r/100);
        if (cumulative > peak) {
            peak = cumulative;
        }
        const drawdown = (peak - cumulative) / peak * 100;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    }
    
    return {
        standardDeviation: stdDev,
        sharpeRatio,
        maxDrawdown,
        positiveReturns: returns.filter(r => r > 0).length,
        negativeReturns: returns.filter(r => r < 0).length
    };
}

function calculateIRR(values, guess = 0.1) {
    const maxIterations = 100;
    const tolerance = 0.0001;
    let irr = guess;
    
    for (let i = 0; i < maxIterations; i++) {
        let npv = values[0];
        let derivativeNpv = 0;
        
        for (let t = 1; t < values.length; t++) {
            npv += values[t] / Math.pow(1 + irr, t);
            derivativeNpv -= t * values[t] / Math.pow(1 + irr, t + 1);
        }
        
        if (Math.abs(npv) < tolerance) {
            return irr * 100;
        }
        
        irr = irr - npv / derivativeNpv;
    }
    
    return null;
}

function displayReturnResults(results) {
    document.getElementById('return-result').style.display = 'block';
    
    // Display average return
    document.getElementById('avg-return').textContent = 
        `${results.averageReturn.toFixed(2)}%`;
    
    // Display return metrics
    let metricsHTML = `
        <li><strong>Number of Periods:</strong> ${results.returns.length}</li>
        <li><strong>Time Period:</strong> ${results.timePeriod}</li>
        <li><strong>Return Type:</strong> ${results.returnType}</li>
        <li><strong>Average Return:</strong> ${results.averageReturn.toFixed(2)}%</li>
        <li><strong>Total Return:</strong> ${(results.cumulativeReturns[results.cumulativeReturns.length-1].cumulative - 100).toFixed(2)}%</li>
    `;
    
    document.getElementById('return-metrics').innerHTML = metricsHTML;
    
    // Display risk metrics if requested
    if (results.includeRisk) {
        document.getElementById('risk-metrics').style.display = 'block';
        const riskHTML = `
            <li><strong>Standard Deviation:</strong> ${results.riskMetrics.standardDeviation.toFixed(2)}%</li>
            <li><strong>Sharpe Ratio:</strong> ${results.riskMetrics.sharpeRatio.toFixed(2)}</li>
            <li><strong>Maximum Drawdown:</strong> ${results.riskMetrics.maxDrawdown.toFixed(2)}%</li>
            <li><strong>Positive Periods:</strong> ${results.riskMetrics.positiveReturns}</li>
            <li><strong>Negative Periods:</strong> ${results.riskMetrics.negativeReturns}</li>
        `;
        document.getElementById('risk-metrics-list').innerHTML = riskHTML;
    } else {
        document.getElementById('risk-metrics').style.display = 'none';
    }
    
    // Display return distribution
    const tbody = document.getElementById('return-distribution');
    tbody.innerHTML = results.cumulativeReturns.map((data, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${data.return.toFixed(2)}%</td>
            <td>${(data.cumulative - 100).toFixed(2)}%</td>
        </tr>
    `).join('');
    
    // Create chart
    const ctx = document.getElementById('return-chart').getContext('2d');
    if (window.returnChart) window.returnChart.destroy();
    
    const labels = results.returns.map((_, index) => `Period ${index + 1}`);
    
    window.returnChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Periodic Returns',
                    data: results.returns,
                    backgroundColor: results.returns.map(r => 
                        r >= 0 ? '#36A2EB' : '#FF6384'),
                    type: 'bar'
                },
                {
                    label: 'Cumulative Return',
                    data: results.cumulativeReturns.map(d => d.cumulative - 100),
                    borderColor: '#FFCE56',
                    type: 'line',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Return Distribution and Cumulative Performance'
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: value => value + '%'
                    }
                }
            }
        }
    });
}
