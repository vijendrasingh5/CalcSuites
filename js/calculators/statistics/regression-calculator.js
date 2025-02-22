function loadRegressionCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Regression Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Data Input -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Data Input</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">Enter X,Y pairs (one per line, comma separated)</label>
                                <textarea class="form-control" id="regression-data" rows="6" 
                                    placeholder="Example:\n1,2\n2,4\n3,6\n4,8"></textarea>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateRegression()">
                                    <i class="fas fa-calculator"></i> Calculate Regression
                                </button>
                                <button class="btn btn-secondary" onclick="generateSampleData()">
                                    <i class="fas fa-random"></i> Generate Sample Data
                                </button>
                                <button class="btn btn-outline-secondary" onclick="clearRegressionData()">
                                    <i class="fas fa-trash"></i> Clear Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Results -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Regression Analysis</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title">Regression Equation</h6>
                                        <div id="regression-equation" class="h5 text-primary">y = mx + b</div>
                                        <div id="regression-details" class="small text-muted mt-2"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title">Statistical Measures</h6>
                                        <table class="table table-sm">
                                            <tbody>
                                                <tr>
                                                    <th>Correlation (r)</th>
                                                    <td id="correlation-value">-</td>
                                                </tr>
                                                <tr>
                                                    <th>R-squared (R²)</th>
                                                    <td id="r-squared-value">-</td>
                                                </tr>
                                                <tr>
                                                    <th>Standard Error</th>
                                                    <td id="standard-error-value">-</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Scatter Plot -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Scatter Plot with Regression Line</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="regression-plot" height="300"></canvas>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <h6>Linear Regression</h6>
                            <p class="small text-muted">
                                Linear regression finds the best-fitting straight line through a set of points by minimizing
                                the sum of squared residuals. The resulting line represents the relationship between
                                variables X and Y.
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Correlation Coefficient (r)</h6>
                            <p class="small text-muted">
                                Measures the strength and direction of the linear relationship between variables.
                                Values range from -1 to +1:
                                <ul class="mb-0">
                                    <li>+1: Perfect positive correlation</li>
                                    <li>0: No correlation</li>
                                    <li>-1: Perfect negative correlation</li>
                                </ul>
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>R-squared (R²)</h6>
                            <p class="small text-muted">
                                Represents the proportion of variance in the dependent variable that's predictable from
                                the independent variable. Ranges from 0 to 1, with 1 indicating perfect prediction.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Initialize the plot
    initRegressionPlot();
}

function initRegressionPlot() {
    const ctx = document.getElementById('regression-plot').getContext('2d');
    window.regressionChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Data Points',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }, {
                label: 'Regression Line',
                data: [],
                type: 'line',
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'X Values'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y Values'
                    }
                }
            }
        }
    });
}

function calculateRegression() {
    const data = document.getElementById('regression-data').value;
    const points = parseDataPoints(data);
    
    if (points.length < 2) {
        showAlert('Please enter at least 2 data points', 'danger');
        return;
    }
    
    const { slope, intercept, r, rSquared, standardError } = performRegression(points);
    
    // Update regression equation
    const equation = `y = ${slope.toFixed(4)}x ${intercept >= 0 ? '+' : ''} ${intercept.toFixed(4)}`;
    document.getElementById('regression-equation').textContent = equation;
    
    // Update statistics
    document.getElementById('correlation-value').textContent = r.toFixed(4);
    document.getElementById('r-squared-value').textContent = rSquared.toFixed(4);
    document.getElementById('standard-error-value').textContent = standardError.toFixed(4);
    
    // Update regression details
    const strength = getCorrelationStrength(r);
    document.getElementById('regression-details').textContent = 
        `This indicates a ${strength} ${r >= 0 ? 'positive' : 'negative'} correlation`;
    
    // Update plot
    updateRegressionPlot(points, slope, intercept);
}

function parseDataPoints(data) {
    return data.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            const [x, y] = line.split(',').map(num => parseFloat(num.trim()));
            if (isNaN(x) || isNaN(y)) throw new Error('Invalid data point');
            return { x, y };
        });
}

function performRegression(points) {
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
    
    points.forEach(point => {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumXX += point.x * point.x;
        sumYY += point.y * point.y;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate correlation coefficient (r)
    const r = (n * sumXY - sumX * sumY) / 
        Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    // Calculate R-squared
    const rSquared = r * r;
    
    // Calculate standard error
    let sumSquaredErrors = 0;
    points.forEach(point => {
        const predicted = slope * point.x + intercept;
        sumSquaredErrors += Math.pow(point.y - predicted, 2);
    });
    const standardError = Math.sqrt(sumSquaredErrors / (n - 2));
    
    return { slope, intercept, r, rSquared, standardError };
}

function updateRegressionPlot(points, slope, intercept) {
    // Get x range for regression line
    const xValues = points.map(p => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    
    // Create regression line points
    const linePoints = [
        { x: minX, y: slope * minX + intercept },
        { x: maxX, y: slope * maxX + intercept }
    ];
    
    // Update chart
    window.regressionChart.data.datasets[0].data = points;
    window.regressionChart.data.datasets[1].data = linePoints;
    window.regressionChart.update();
}

function getCorrelationStrength(r) {
    const abs = Math.abs(r);
    if (abs >= 0.9) return 'very strong';
    if (abs >= 0.7) return 'strong';
    if (abs >= 0.5) return 'moderate';
    if (abs >= 0.3) return 'weak';
    return 'very weak';
}

function generateSampleData() {
    const sampleData = [
        '1,2.1',
        '2,3.8',
        '3,6.2',
        '4,7.9',
        '5,9.3',
        '6,11.0',
        '7,13.2',
        '8,14.8',
        '9,16.1',
        '10,18.5'
    ].join('\n');
    
    document.getElementById('regression-data').value = sampleData;
    calculateRegression();
}

function clearRegressionData() {
    document.getElementById('regression-data').value = '';
    document.getElementById('regression-equation').textContent = 'y = mx + b';
    document.getElementById('regression-details').textContent = '';
    document.getElementById('correlation-value').textContent = '-';
    document.getElementById('r-squared-value').textContent = '-';
    document.getElementById('standard-error-value').textContent = '-';
    
    // Clear plot
    window.regressionChart.data.datasets[0].data = [];
    window.regressionChart.data.datasets[1].data = [];
    window.regressionChart.update();
}