function loadConfidenceIntervalCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Confidence Interval Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Mean Confidence Interval -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Confidence Interval for Mean</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Sample Mean</label>
                                <input type="number" class="form-control" id="sample-mean" step="0.01">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Sample Size</label>
                                <input type="number" class="form-control" id="sample-size" min="1">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Standard Deviation</label>
                                <input type="number" class="form-control" id="standard-deviation" min="0" step="0.01">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Confidence Level</label>
                                <select class="form-select" id="confidence-level">
                                    <option value="0.90">90%</option>
                                    <option value="0.95" selected>95%</option>
                                    <option value="0.99">99%</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateMeanInterval()">Calculate Interval</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="mean-result" style="display: none;">
                                    <div class="mb-2">Confidence Interval:</div>
                                    <div class="mb-2">Lower Bound: <span id="mean-lower">-</span></div>
                                    <div class="mb-2">Upper Bound: <span id="mean-upper">-</span></div>
                                    <div>Margin of Error: ±<span id="mean-margin">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Proportion Confidence Interval -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Confidence Interval for Proportion</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Sample Proportion</label>
                                <div class="input-group">
                                    <input type="number" class="form-control" id="sample-proportion" 
                                        min="0" max="1" step="0.01">
                                    <span class="input-group-text">or</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Success/Total</label>
                                <div class="input-group">
                                    <input type="number" class="form-control" id="successes" min="0">
                                    <span class="input-group-text">/</span>
                                    <input type="number" class="form-control" id="total" min="1">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Confidence Level</label>
                                <select class="form-select" id="proportion-confidence-level">
                                    <option value="0.90">90%</option>
                                    <option value="0.95" selected>95%</option>
                                    <option value="0.99">99%</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateProportionInterval()">Calculate Interval</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="proportion-result" style="display: none;">
                                    <div class="mb-2">Confidence Interval:</div>
                                    <div class="mb-2">Lower Bound: <span id="proportion-lower">-</span></div>
                                    <div class="mb-2">Upper Bound: <span id="proportion-upper">-</span></div>
                                    <div>Margin of Error: ±<span id="proportion-margin">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sample Size Calculator -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Required Sample Size</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Desired Margin of Error</label>
                                <div class="input-group">
                                    <input type="number" class="form-control" id="desired-margin" 
                                        value="5" min="0.1" max="50" step="0.1">
                                    <span class="input-group-text">%</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Confidence Level</label>
                                <select class="form-select" id="size-confidence-level">
                                    <option value="0.90">90%</option>
                                    <option value="0.95" selected>95%</option>
                                    <option value="0.99">99%</option>
                                </select>
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
                                <button class="btn btn-primary" onclick="calculateRequiredSampleSize()">Calculate Sample Size</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="size-result" style="display: none;">
                                    Required Sample Size: <span id="required-size">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Interval Visualization -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Interval Visualization</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="interval-chart" height="200"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Visual representation of the confidence interval
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
                            <button class="btn btn-outline-secondary" onclick="showExamples()">Show Examples</button>
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
                                The probability that the true population parameter falls within 
                                the confidence interval. Common values: 90%, 95%, 99%.
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Margin of Error</h6>
                            <p class="small text-muted">
                                The maximum expected difference between the sample statistic 
                                and the population parameter. Smaller values require larger samples.
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Sample Size</h6>
                            <p class="small text-muted">
                                Larger sample sizes provide more precise estimates (narrower intervals). 
                                The relationship is not linear - quadrupling the sample size halves the margin of error.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Initialize event listeners
    document.getElementById('sample-proportion').addEventListener('input', updateSuccessTotal);
    document.getElementById('successes').addEventListener('input', updateProportion);
    document.getElementById('total').addEventListener('input', updateProportion);
    
    // Draw initial chart
    drawIntervalChart();
}

function calculateMeanInterval() {
    const mean = parseFloat(document.getElementById('sample-mean').value);
    const n = parseInt(document.getElementById('sample-size').value);
    const sd = parseFloat(document.getElementById('standard-deviation').value);
    const confidence = parseFloat(document.getElementById('confidence-level').value);
    
    if (isNaN(mean) || isNaN(n) || isNaN(sd)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (n < 1) {
        alert('Sample size must be positive');
        return;
    }
    
    if (sd < 0) {
        alert('Standard deviation must be non-negative');
        return;
    }
    
    // Get z-score for confidence level
    const zScore = getZScore(confidence);
    
    // Calculate margin of error
    const marginOfError = zScore * (sd / Math.sqrt(n));
    
    // Calculate interval bounds
    const lowerBound = mean - marginOfError;
    const upperBound = mean + marginOfError;
    
    // Update results
    document.getElementById('mean-result').style.display = 'block';
    document.getElementById('mean-lower').textContent = lowerBound.toFixed(4);
    document.getElementById('mean-upper').textContent = upperBound.toFixed(4);
    document.getElementById('mean-margin').textContent = marginOfError.toFixed(4);
    
    // Update chart
    drawIntervalChart(mean, lowerBound, upperBound);
}

function calculateProportionInterval() {
    let p, n;
    
    // Get values either from proportion or success/total
    if (document.getElementById('sample-proportion').value) {
        p = parseFloat(document.getElementById('sample-proportion').value);
        n = parseInt(document.getElementById('total').value);
    } else {
        const successes = parseInt(document.getElementById('successes').value);
        n = parseInt(document.getElementById('total').value);
        p = successes / n;
    }
    
    const confidence = parseFloat(document.getElementById('proportion-confidence-level').value);
    
    if (isNaN(p) || isNaN(n)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (p < 0 || p > 1) {
        alert('Proportion must be between 0 and 1');
        return;
    }
    
    if (n < 1) {
        alert('Sample size must be positive');
        return;
    }
    
    // Check if sample size is large enough
    if (n * p < 5 || n * (1 - p) < 5) {
        alert('Warning: Sample size might be too small for normal approximation');
    }
    
    // Get z-score for confidence level
    const zScore = getZScore(confidence);
    
    // Calculate margin of error
    const marginOfError = zScore * Math.sqrt((p * (1 - p)) / n);
    
    // Calculate interval bounds
    const lowerBound = Math.max(0, p - marginOfError);
    const upperBound = Math.min(1, p + marginOfError);
    
    // Update results
    document.getElementById('proportion-result').style.display = 'block';
    document.getElementById('proportion-lower').textContent = lowerBound.toFixed(4);
    document.getElementById('proportion-upper').textContent = upperBound.toFixed(4);
    document.getElementById('proportion-margin').textContent = marginOfError.toFixed(4);
    
    // Update chart
    drawIntervalChart(p, lowerBound, upperBound);
}

function calculateRequiredSampleSize() {
    const marginOfError = parseFloat(document.getElementById('desired-margin').value) / 100;
    const confidence = parseFloat(document.getElementById('size-confidence-level').value);
    const proportion = parseFloat(document.getElementById('expected-proportion').value) / 100;
    
    if (isNaN(marginOfError) || marginOfError <= 0 || marginOfError >= 1) {
        alert('Please enter a valid margin of error (between 0 and 100)');
        return;
    }
    
    if (isNaN(proportion) || proportion < 0 || proportion > 1) {
        alert('Please enter a valid proportion (between 0 and 100)');
        return;
    }
    
    // Get z-score for confidence level
    const zScore = getZScore(confidence);
    
    // Calculate required sample size
    const sampleSize = Math.ceil(
        (zScore * zScore * proportion * (1 - proportion)) / 
        (marginOfError * marginOfError)
    );
    
    // Update results
    document.getElementById('size-result').style.display = 'block';
    document.getElementById('required-size').textContent = sampleSize.toLocaleString();
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

function updateSuccessTotal() {
    const proportion = parseFloat(document.getElementById('sample-proportion').value);
    const total = parseInt(document.getElementById('total').value);
    
    if (!isNaN(proportion) && !isNaN(total)) {
        document.getElementById('successes').value = Math.round(proportion * total);
    }
}

function updateProportion() {
    const successes = parseInt(document.getElementById('successes').value);
    const total = parseInt(document.getElementById('total').value);
    
    if (!isNaN(successes) && !isNaN(total) && total > 0) {
        document.getElementById('sample-proportion').value = (successes / total).toFixed(4);
    }
}

function drawIntervalChart(point = 0.5, lower = 0.4, upper = 0.6) {
    const ctx = document.getElementById('interval-chart').getContext('2d');
    
    // Clear previous chart if it exists
    if (window.intervalChart) {
        window.intervalChart.destroy();
    }
    
    // Create data for normal distribution curve
    const data = [];
    const labels = [];
    const range = upper - lower;
    const min = lower - range/2;
    const max = upper + range/2;
    const step = range/50;
    
    for (let x = min; x <= max; x += step) {
        labels.push(x.toFixed(2));
        data.push(normalPDF(x, point, range/4));
    }
    
    // Create new chart
    window.intervalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribution',
                data: data,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            xMin: lower,
                            xMax: lower,
                            borderColor: 'red',
                            borderWidth: 2
                        },
                        line2: {
                            type: 'line',
                            xMin: upper,
                            xMax: upper,
                            borderColor: 'red',
                            borderWidth: 2
                        }
                    }
                }
            }
        }
    });
}

function normalPDF(x, mean, sd) {
    const coefficient = 1 / (sd * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mean, 2) / (2 * sd * sd);
    return coefficient * Math.exp(exponent);
}

function showExamples() {
    alert(`Confidence Interval Examples:

1. Population Mean
   Sample Mean = 75
   Sample Size = 100
   Standard Deviation = 12
   95% Confidence Level
   Result: 75 ± 2.35 (72.65 to 77.35)

2. Population Proportion
   Sample Proportion = 0.65 (65%)
   Sample Size = 500
   95% Confidence Level
   Result: 0.65 ± 0.042 (0.608 to 0.692)

3. Required Sample Size
   Desired Margin of Error = 3%
   Expected Proportion = 50%
   95% Confidence Level
   Result: 1,068 samples needed

Note: Larger sample sizes and lower confidence levels 
result in narrower confidence intervals.`);
}

function showFormulas() {
    alert(`Confidence Interval Formulas:

1. Mean (known σ):
   CI = x̄ ± (z * σ/√n)
   where:
   x̄ = sample mean
   z = z-score for confidence level
   σ = population standard deviation
   n = sample size

2. Mean (unknown σ):
   CI = x̄ ± (t * s/√n)
   where:
   t = t-score for confidence level
   s = sample standard deviation

3. Proportion:
   CI = p̂ ± z * √(p̂(1-p̂)/n)
   where:
   p̂ = sample proportion
   n = sample size

4. Required Sample Size:
   n = (z²p̂(1-p̂))/E²
   where:
   E = margin of error
   p̂ = expected proportion`);
}

function clearCalculator() {
    // Clear mean interval inputs
    document.getElementById('sample-mean').value = '';
    document.getElementById('sample-size').value = '';
    document.getElementById('standard-deviation').value = '';
    document.getElementById('mean-result').style.display = 'none';
    
    // Clear proportion interval inputs
    document.getElementById('sample-proportion').value = '';
    document.getElementById('successes').value = '';
    document.getElementById('total').value = '';
    document.getElementById('proportion-result').style.display = 'none';
    
    // Clear sample size inputs
    document.getElementById('desired-margin').value = '5';
    document.getElementById('expected-proportion').value = '50';
    document.getElementById('size-result').style.display = 'none';
    
    // Reset chart
    drawIntervalChart();
}
