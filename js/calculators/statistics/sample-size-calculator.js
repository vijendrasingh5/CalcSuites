function loadSampleSizeCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Sample Size Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Sample Size for Proportion -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Sample Size for Proportion</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Confidence Level</label>
                                <select class="form-select" id="confidence-level">
                                    <option value="0.90">90%</option>
                                    <option value="0.95" selected>95%</option>
                                    <option value="0.99">99%</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Margin of Error</label>
                                <div class="input-group">
                                    <input type="number" class="form-control" id="margin-of-error" 
                                        value="5" min="0.1" max="50" step="0.1">
                                    <span class="input-group-text">%</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Population Size (optional)</label>
                                <input type="number" class="form-control" id="population-size" 
                                    placeholder="Leave blank for infinite">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Expected Proportion</label>
                                <div class="input-group">
                                    <input type="number" class="form-control" id="expected-proportion" 
                                        value="50" min="0" max="100" step="1">
                                    <span class="input-group-text">%</span>
                                </div>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateSampleSize()">Calculate Sample Size</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="proportion-result" style="display: none;">
                                    Required Sample Size: <span class="result-value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sample Size for Mean -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Sample Size for Mean</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Confidence Level</label>
                                <select class="form-select" id="mean-confidence-level">
                                    <option value="0.90">90%</option>
                                    <option value="0.95" selected>95%</option>
                                    <option value="0.99">99%</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Margin of Error</label>
                                <input type="number" class="form-control" id="mean-margin-of-error" 
                                    value="1" min="0.01" step="0.01">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Standard Deviation (σ)</label>
                                <input type="number" class="form-control" id="standard-deviation" 
                                    value="5" min="0.01" step="0.01">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Population Size (optional)</label>
                                <input type="number" class="form-control" id="mean-population-size" 
                                    placeholder="Leave blank for infinite">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateMeanSampleSize()">Calculate Sample Size</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="mean-result" style="display: none;">
                                    Required Sample Size: <span class="result-value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Power Analysis -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Power Analysis</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Effect Size</label>
                                <select class="form-select" id="effect-size">
                                    <option value="0.2">Small (0.2)</option>
                                    <option value="0.5" selected>Medium (0.5)</option>
                                    <option value="0.8">Large (0.8)</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Statistical Power</label>
                                <select class="form-select" id="statistical-power">
                                    <option value="0.8" selected>80%</option>
                                    <option value="0.9">90%</option>
                                    <option value="0.95">95%</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Significance Level (α)</label>
                                <select class="form-select" id="significance-level">
                                    <option value="0.01">1%</option>
                                    <option value="0.05" selected>5%</option>
                                    <option value="0.1">10%</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Test Type</label>
                                <select class="form-select" id="test-type">
                                    <option value="one-tailed">One-tailed</option>
                                    <option value="two-tailed" selected>Two-tailed</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculatePowerAnalysis()">Calculate Sample Size</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="power-result" style="display: none;">
                                    Required Sample Size: <span class="result-value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Sample Size Chart -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Sample Size Chart</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="sample-size-chart" height="200"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Sample size vs. Margin of Error
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
                            <button class="btn btn-outline-secondary" onclick="showRecommendations()">Show Recommendations</button>
                            <button class="btn btn-outline-secondary" onclick="clearCalculator()">Clear Calculator</button>
                            <button class="btn btn-outline-secondary" onclick="showFormulas()">Show Formulas</button>
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
                            <h6>Confidence Level</h6>
                            <p class="small text-muted">
                                The probability that the true population parameter falls within the 
                                confidence interval. Common values are 90%, 95%, and 99%.
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Margin of Error</h6>
                            <p class="small text-muted">
                                The maximum expected difference between the true population parameter 
                                and the sample estimate.
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Effect Size</h6>
                            <p class="small text-muted">
                                A measure of the magnitude of the difference between groups or the 
                                strength of a relationship.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Draw initial chart
    drawSampleSizeChart();
}

function calculateSampleSize() {
    const confidenceLevel = parseFloat(document.getElementById('confidence-level').value);
    const marginOfError = parseFloat(document.getElementById('margin-of-error').value) / 100;
    const populationSize = document.getElementById('population-size').value 
        ? parseInt(document.getElementById('population-size').value) 
        : Infinity;
    const expectedProportion = parseFloat(document.getElementById('expected-proportion').value) / 100;
    
    if (isNaN(marginOfError) || marginOfError <= 0 || marginOfError >= 1) {
        alert('Please enter a valid margin of error (between 0 and 100)');
        return;
    }
    
    if (isNaN(expectedProportion) || expectedProportion < 0 || expectedProportion > 1) {
        alert('Please enter a valid expected proportion (between 0 and 100)');
        return;
    }
    
    // Z-score for confidence level
    const zScore = getZScore(confidenceLevel);
    
    // Calculate sample size
    const p = expectedProportion;
    const q = 1 - p;
    
    // Initial sample size (assuming infinite population)
    let sampleSize = Math.ceil((zScore * zScore * p * q) / (marginOfError * marginOfError));
    
    // Adjust for finite population if provided
    if (isFinite(populationSize)) {
        sampleSize = Math.ceil(
            (sampleSize * populationSize) / (sampleSize + populationSize - 1)
        );
    }
    
    document.getElementById('proportion-result').style.display = 'block';
    document.getElementById('proportion-result').querySelector('.result-value').textContent = 
        sampleSize.toLocaleString();
    
    // Update chart
    drawSampleSizeChart(sampleSize, marginOfError);
}

function calculateMeanSampleSize() {
    const confidenceLevel = parseFloat(document.getElementById('mean-confidence-level').value);
    const marginOfError = parseFloat(document.getElementById('mean-margin-of-error').value);
    const standardDeviation = parseFloat(document.getElementById('standard-deviation').value);
    const populationSize = document.getElementById('mean-population-size').value 
        ? parseInt(document.getElementById('mean-population-size').value) 
        : Infinity;
    
    if (isNaN(marginOfError) || marginOfError <= 0) {
        alert('Please enter a valid margin of error');
        return;
    }
    
    if (isNaN(standardDeviation) || standardDeviation <= 0) {
        alert('Please enter a valid standard deviation');
        return;
    }
    
    // Z-score for confidence level
    const zScore = getZScore(confidenceLevel);
    
    // Calculate sample size
    let sampleSize = Math.ceil(
        (zScore * zScore * standardDeviation * standardDeviation) / 
        (marginOfError * marginOfError)
    );
    
    // Adjust for finite population if provided
    if (isFinite(populationSize)) {
        sampleSize = Math.ceil(
            (sampleSize * populationSize) / (sampleSize + populationSize - 1)
        );
    }
    
    document.getElementById('mean-result').style.display = 'block';
    document.getElementById('mean-result').querySelector('.result-value').textContent = 
        sampleSize.toLocaleString();
}

function calculatePowerAnalysis() {
    const effectSize = parseFloat(document.getElementById('effect-size').value);
    const power = parseFloat(document.getElementById('statistical-power').value);
    const alpha = parseFloat(document.getElementById('significance-level').value);
    const twoTailed = document.getElementById('test-type').value === 'two-tailed';
    
    // Z-scores for power analysis
    const zAlpha = twoTailed ? getZScore(1 - alpha/2) : getZScore(1 - alpha);
    const zBeta = getZScore(power);
    
    // Calculate sample size
    const sampleSize = Math.ceil(
        2 * Math.pow((zAlpha + zBeta) / effectSize, 2)
    );
    
    document.getElementById('power-result').style.display = 'block';
    document.getElementById('power-result').querySelector('.result-value').textContent = 
        sampleSize.toLocaleString();
}

function getZScore(confidenceLevel) {
    // Common z-scores for confidence levels
    const zScores = {
        0.90: 1.645,
        0.95: 1.96,
        0.99: 2.576
    };
    return zScores[confidenceLevel] || 1.96;
}

function drawSampleSizeChart(currentSize = null, currentError = null) {
    const ctx = document.getElementById('sample-size-chart').getContext('2d');
    
    // Generate data points
    const errors = [];
    const sizes = [];
    for (let error = 1; error <= 10; error += 0.5) {
        errors.push(error);
        const size = Math.ceil(
            (1.96 * 1.96 * 0.5 * 0.5) / (error/100 * error/100)
        );
        sizes.push(size);
    }
    
    // Clear previous chart if it exists
    if (window.sampleSizeChart) {
        window.sampleSizeChart.destroy();
    }
    
    // Create new chart
    window.sampleSizeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: errors.map(e => e + '%'),
            datasets: [{
                label: 'Sample Size',
                data: sizes,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true
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
                        text: 'Sample Size'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Margin of Error'
                    }
                }
            }
        }
    });
}

function showRecommendations() {
    alert(`Sample Size Recommendations:

1. General Survey Research:
   • 95% confidence level
   • 5% margin of error
   • 50% response distribution
   Recommended: 385 participants

2. Academic Research:
   • 95% confidence level
   • 3% margin of error
   • Known response distribution
   Recommended: 1,067 participants

3. Medical Studies:
   • 99% confidence level
   • 1% margin of error
   • Known response distribution
   Recommended: 16,641 participants

4. Pilot Studies:
   • 90% confidence level
   • 10% margin of error
   • 50% response distribution
   Recommended: 68 participants`);
}

function showFormulas() {
    alert(`Sample Size Formulas:

1. For Proportion (infinite population):
   n = (z²pq)/E²
   where:
   n = sample size
   z = z-score
   p = expected proportion
   q = 1-p
   E = margin of error

2. For Mean:
   n = (z²σ²)/E²
   where:
   σ = standard deviation
   E = margin of error

3. Finite Population Correction:
   n' = (nN)/(n + N - 1)
   where:
   N = population size
   n = calculated sample size

4. Power Analysis:
   n = 2((zα + zβ)/d)²
   where:
   d = effect size
   zα = z-score for significance level
   zβ = z-score for power`);
}

function clearCalculator() {
    // Clear proportion inputs
    document.getElementById('margin-of-error').value = '5';
    document.getElementById('population-size').value = '';
    document.getElementById('expected-proportion').value = '50';
    document.getElementById('proportion-result').style.display = 'none';
    
    // Clear mean inputs
    document.getElementById('mean-margin-of-error').value = '1';
    document.getElementById('standard-deviation').value = '5';
    document.getElementById('mean-population-size').value = '';
    document.getElementById('mean-result').style.display = 'none';
    
    // Clear power analysis results
    document.getElementById('power-result').style.display = 'none';
    
    // Reset chart
    drawSampleSizeChart();
}
