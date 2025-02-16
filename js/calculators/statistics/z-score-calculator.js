function loadZScoreCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Z-Score Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Single Value Z-Score -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Single Value Z-Score</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Value (x)</label>
                                <input type="number" class="form-control" id="z-score-value" step="any">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Mean (μ)</label>
                                <input type="number" class="form-control" id="z-score-mean" step="any">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Standard Deviation (σ)</label>
                                <input type="number" class="form-control" id="z-score-std" step="any" min="0">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateZScore()">Calculate Z-Score</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="z-score-result" style="display: none;">
                                    Z-Score: <span class="result-value">-</span>
                                    <div class="small mt-2">
                                        Percentile: <span class="percentile-value">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dataset Z-Scores -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Dataset Z-Scores</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">Enter dataset (comma or space separated)</label>
                                <textarea class="form-control" id="dataset-input" rows="4" 
                                    placeholder="Example: 72, 85, 93, 65, 88&#10;or&#10;72 85 93 65 88"></textarea>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateDatasetZScores()">Calculate Z-Scores</button>
                            </div>
                            <div class="col-12">
                                <div id="dataset-results" style="display: none;">
                                    <div class="table-responsive">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Value</th>
                                                    <th>Z-Score</th>
                                                    <th>Percentile</th>
                                                </tr>
                                            </thead>
                                            <tbody id="dataset-results-body">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Z-Score to Value -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Z-Score to Value</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Z-Score</label>
                                <input type="number" class="form-control" id="reverse-z-score" step="any">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Mean (μ)</label>
                                <input type="number" class="form-control" id="reverse-mean" step="any">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Standard Deviation (σ)</label>
                                <input type="number" class="form-control" id="reverse-std" step="any" min="0">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateValueFromZScore()">Calculate Value</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="reverse-result" style="display: none;">
                                    Value: <span class="result-value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Normal Distribution Visualization -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Normal Distribution</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="normal-distribution" height="200"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Standard Normal Distribution with Z-Score regions
                        </div>
                    </div>
                </div>

                <!-- Quick Tools -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Quick Tools</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-secondary" onclick="generateSampleData()">Generate Sample Data</button>
                            <button class="btn btn-outline-secondary" onclick="clearCalculator()">Clear Calculator</button>
                        </div>
                    </div>
                </div>

                <!-- Information -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <h6>Z-Score</h6>
                            <p class="small text-muted">
                                A Z-score indicates how many standard deviations away from the mean a data point is. 
                                A Z-score of 0 means the data point equals the mean, while a Z-score of 1 is one 
                                standard deviation above the mean.
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Percentile</h6>
                            <p class="small text-muted">
                                The percentile indicates the percentage of values that fall below a given Z-score 
                                in a normal distribution.
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Common Z-Scores</h6>
                            <ul class="list-unstyled small text-muted">
                                <li>• ±1.0: ~68% of data</li>
                                <li>• ±1.96: ~95% of data</li>
                                <li>• ±2.58: ~99% of data</li>
                                <li>• ±3.0: ~99.7% of data</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Draw initial normal distribution
    drawNormalDistribution();
}

function calculateZScore() {
    const x = parseFloat(document.getElementById('z-score-value').value);
    const mean = parseFloat(document.getElementById('z-score-mean').value);
    const std = parseFloat(document.getElementById('z-score-std').value);
    
    if (isNaN(x) || isNaN(mean) || isNaN(std)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (std <= 0) {
        alert('Standard deviation must be positive');
        return;
    }
    
    const zScore = (x - mean) / std;
    const percentile = calculatePercentile(zScore);
    
    const resultContainer = document.getElementById('z-score-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.result-value').textContent = zScore.toFixed(4);
    resultContainer.querySelector('.percentile-value').textContent = 
        `${(percentile * 100).toFixed(2)}%`;
    
    // Update visualization
    drawNormalDistribution(zScore);
}

function calculateDatasetZScores() {
    const input = document.getElementById('dataset-input').value;
    const numbers = input.split(/[\s,]+/)
        .map(num => parseFloat(num.trim()))
        .filter(num => !isNaN(num));
    
    if (numbers.length === 0) {
        alert('Please enter valid numbers');
        return;
    }
    
    // Calculate mean and standard deviation
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
    const std = Math.sqrt(variance);
    
    // Calculate Z-scores
    const zScores = numbers.map(num => (num - mean) / std);
    
    // Display results
    const tbody = document.getElementById('dataset-results-body');
    tbody.innerHTML = '';
    
    numbers.forEach((num, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${num.toFixed(2)}</td>
            <td>${zScores[i].toFixed(4)}</td>
            <td>${(calculatePercentile(zScores[i]) * 100).toFixed(2)}%</td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('dataset-results').style.display = 'block';
}

function calculateValueFromZScore() {
    const z = parseFloat(document.getElementById('reverse-z-score').value);
    const mean = parseFloat(document.getElementById('reverse-mean').value);
    const std = parseFloat(document.getElementById('reverse-std').value);
    
    if (isNaN(z) || isNaN(mean) || isNaN(std)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (std <= 0) {
        alert('Standard deviation must be positive');
        return;
    }
    
    const value = z * std + mean;
    
    const resultContainer = document.getElementById('reverse-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.result-value').textContent = value.toFixed(4);
    
    // Update visualization
    drawNormalDistribution(z);
}

function calculatePercentile(zScore) {
    // Using error function approximation for normal distribution CDF
    return 0.5 * (1 + erf(zScore / Math.sqrt(2)));
}

function erf(x) {
    // Error function approximation
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
}

function drawNormalDistribution(highlightZ = null) {
    const ctx = document.getElementById('normal-distribution').getContext('2d');
    
    // Generate points for normal distribution
    const points = [];
    for (let x = -4; x <= 4; x += 0.1) {
        points.push({
            x: x,
            y: Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
        });
    }
    
    // Clear previous chart if it exists
    if (window.normalDistChart) {
        window.normalDistChart.destroy();
    }
    
    // Create new chart
    window.normalDistChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: points.map(p => p.x.toFixed(1)),
            datasets: [{
                label: 'Normal Distribution',
                data: points.map(p => p.y),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Probability Density'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Z-Score'
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: highlightZ ? {
                        line: {
                            type: 'line',
                            xMin: highlightZ,
                            xMax: highlightZ,
                            borderColor: 'red',
                            borderWidth: 2
                        }
                    } : {}
                }
            }
        }
    });
}

function generateSampleData() {
    // Generate random normal distribution data
    const mean = 75;
    const std = 10;
    const count = 10;
    
    const numbers = Array.from({length: count}, () => {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return Math.round(mean + std * z);
    });
    
    document.getElementById('dataset-input').value = numbers.join(', ');
    calculateDatasetZScores();
}

function clearCalculator() {
    // Clear single value inputs
    document.getElementById('z-score-value').value = '';
    document.getElementById('z-score-mean').value = '';
    document.getElementById('z-score-std').value = '';
    document.getElementById('z-score-result').style.display = 'none';
    
    // Clear dataset input
    document.getElementById('dataset-input').value = '';
    document.getElementById('dataset-results').style.display = 'none';
    
    // Clear reverse calculation inputs
    document.getElementById('reverse-z-score').value = '';
    document.getElementById('reverse-mean').value = '';
    document.getElementById('reverse-std').value = '';
    document.getElementById('reverse-result').style.display = 'none';
    
    // Reset normal distribution visualization
    drawNormalDistribution();
}
