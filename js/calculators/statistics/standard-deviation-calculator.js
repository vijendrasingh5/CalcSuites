function loadStandardDeviationCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Standard Deviation Calculator');
    const cardBody = card.querySelector('.card-body');

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
                                <label class="form-label">Enter numbers (comma or space separated)</label>
                                <textarea class="form-control" id="data-input" rows="4" 
                                    placeholder="Example: 1, 2, 3, 4, 5&#10;or&#10;1 2 3 4 5"></textarea>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="population" id="sample" checked>
                                    <label class="form-check-label" for="sample">
                                        Sample (n-1)
                                    </label>
                                    <i class="bi bi-info-circle" data-bs-toggle="tooltip" 
                                       title="Use when data represents a sample of a larger population"></i>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="population" id="population">
                                    <label class="form-check-label" for="population">
                                        Population (n)
                                    </label>
                                    <i class="bi bi-info-circle" data-bs-toggle="tooltip" 
                                       title="Use when data represents the entire population"></i>
                                </div>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateStatistics()">Calculate</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Results -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Results</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title">Basic Statistics</h6>
                                        <table class="table table-sm">
                                            <tbody>
                                                <tr>
                                                    <th>Count</th>
                                                    <td id="count-result">-</td>
                                                </tr>
                                                <tr>
                                                    <th>Sum</th>
                                                    <td id="sum-result">-</td>
                                                </tr>
                                                <tr>
                                                    <th>Mean</th>
                                                    <td id="mean-result">-</td>
                                                </tr>
                                                <tr>
                                                    <th>Median</th>
                                                    <td id="median-result">-</td>
                                                </tr>
                                                <tr>
                                                    <th>Mode</th>
                                                    <td id="mode-result">-</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title">Dispersion Statistics</h6>
                                        <table class="table table-sm">
                                            <tbody>
                                                <tr>
                                                    <th>Range</th>
                                                    <td id="range-result">-</td>
                                                </tr>
                                                <tr>
                                                    <th>Variance</th>
                                                    <td id="variance-result">-</td>
                                                </tr>
                                                <tr>
                                                    <th>Standard Deviation</th>
                                                    <td id="std-dev-result">-</td>
                                                </tr>
                                                <tr>
                                                    <th>Coefficient of Variation</th>
                                                    <td id="cv-result">-</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Data Analysis -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Data Analysis</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title">Distribution</h6>
                                        <canvas id="distribution-chart" height="200"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title">Box Plot</h6>
                                        <canvas id="box-plot" height="200"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Quick Tools -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Quick Tools</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-secondary" onclick="generateRandomData()">Generate Random Data</button>
                            <button class="btn btn-outline-secondary" onclick="clearData()">Clear Data</button>
                            <button class="btn btn-outline-secondary" onclick="copyResults()">Copy Results</button>
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
                            <h6>Standard Deviation</h6>
                            <p class="small text-muted">
                                Standard deviation measures the dispersion of a dataset relative to its mean. 
                                A low standard deviation indicates data points tend to be close to the mean, 
                                while a high standard deviation indicates data points are spread out.
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Sample vs Population</h6>
                            <p class="small text-muted">
                                Use sample standard deviation (n-1) when your data is a sample of a larger population. 
                                Use population standard deviation (n) when your data represents the entire population.
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Coefficient of Variation</h6>
                            <p class="small text-muted">
                                The coefficient of variation (CV) is the ratio of the standard deviation to the mean. 
                                It shows the extent of variability in relation to the mean.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
}

function calculateStatistics() {
    const input = document.getElementById('data-input').value;
    const isSample = document.getElementById('sample').checked;
    
    // Parse input
    const numbers = input.split(/[\s,]+/)
        .map(num => parseFloat(num.trim()))
        .filter(num => !isNaN(num));
    
    if (numbers.length === 0) {
        alert('Please enter valid numbers');
        return;
    }
    
    // Basic statistics
    const count = numbers.length;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / count;
    
    // Sort numbers for median and mode
    const sorted = [...numbers].sort((a, b) => a - b);
    const median = count % 2 === 0 
        ? (sorted[count/2 - 1] + sorted[count/2]) / 2 
        : sorted[Math.floor(count/2)];
    
    // Calculate mode
    const frequency = {};
    let maxFreq = 0;
    let modes = [];
    numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
            modes = [num];
        } else if (frequency[num] === maxFreq) {
            modes.push(num);
        }
    });
    
    // Calculate variance and standard deviation
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (isSample ? count - 1 : count);
    const stdDev = Math.sqrt(variance);
    
    // Calculate range
    const range = sorted[count - 1] - sorted[0];
    
    // Calculate coefficient of variation
    const cv = (stdDev / Math.abs(mean)) * 100;
    
    // Update results
    document.getElementById('count-result').textContent = count;
    document.getElementById('sum-result').textContent = sum.toFixed(2);
    document.getElementById('mean-result').textContent = mean.toFixed(2);
    document.getElementById('median-result').textContent = median.toFixed(2);
    document.getElementById('mode-result').textContent = modes.length === 1 ? modes[0].toFixed(2) : 'Multiple modes';
    document.getElementById('range-result').textContent = range.toFixed(2);
    document.getElementById('variance-result').textContent = variance.toFixed(2);
    document.getElementById('std-dev-result').textContent = stdDev.toFixed(2);
    document.getElementById('cv-result').textContent = cv.toFixed(2) + '%';
    
    // Update charts
    updateDistributionChart(numbers, mean, stdDev);
    updateBoxPlot(sorted);
}

function updateDistributionChart(numbers, mean, stdDev) {
    const ctx = document.getElementById('distribution-chart').getContext('2d');
    
    // Create histogram data
    const binCount = Math.ceil(Math.sqrt(numbers.length));
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const binWidth = (max - min) / binCount;
    
    const bins = Array(binCount).fill(0);
    numbers.forEach(num => {
        const binIndex = Math.min(Math.floor((num - min) / binWidth), binCount - 1);
        bins[binIndex]++;
    });
    
    // Create labels for bin ranges
    const labels = bins.map((_, i) => {
        const start = (min + i * binWidth).toFixed(1);
        const end = (min + (i + 1) * binWidth).toFixed(1);
        return `${start}-${end}`;
    });
    
    // Clear previous chart if it exists
    if (window.distributionChart) {
        window.distributionChart.destroy();
    }
    
    window.distributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frequency',
                data: bins,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
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
                        text: 'Frequency'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Value Ranges'
                    }
                }
            }
        }
    });
}

function updateBoxPlot(sorted) {
    const ctx = document.getElementById('box-plot').getContext('2d');
    
    // Calculate quartiles
    const q1Index = Math.floor(sorted.length * 0.25);
    const q2Index = Math.floor(sorted.length * 0.5);
    const q3Index = Math.floor(sorted.length * 0.75);
    
    const q1 = sorted[q1Index];
    const q2 = sorted[q2Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;
    
    const min = Math.max(sorted[0], q1 - 1.5 * iqr);
    const max = Math.min(sorted[sorted.length - 1], q3 + 1.5 * iqr);
    
    // Clear previous chart if it exists
    if (window.boxPlotChart) {
        window.boxPlotChart.destroy();
    }
    
    window.boxPlotChart = new Chart(ctx, {
        type: 'boxplot',
        data: {
            labels: ['Distribution'],
            datasets: [{
                label: 'Box Plot',
                data: [{
                    min: min,
                    q1: q1,
                    median: q2,
                    q3: q3,
                    max: max
                }],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function generateRandomData() {
    const count = 20;
    const numbers = Array.from({length: count}, () => Math.floor(Math.random() * 100));
    document.getElementById('data-input').value = numbers.join(', ');
    calculateStatistics();
}

function clearData() {
    document.getElementById('data-input').value = '';
    
    // Clear results
    const resultIds = ['count', 'sum', 'mean', 'median', 'mode', 'range', 'variance', 'std-dev', 'cv'];
    resultIds.forEach(id => document.getElementById(`${id}-result`).textContent = '-');
    
    // Clear charts
    if (window.distributionChart) {
        window.distributionChart.destroy();
    }
    if (window.boxPlotChart) {
        window.boxPlotChart.destroy();
    }
}

function copyResults() {
    const results = {
        'Count': document.getElementById('count-result').textContent,
        'Sum': document.getElementById('sum-result').textContent,
        'Mean': document.getElementById('mean-result').textContent,
        'Median': document.getElementById('median-result').textContent,
        'Mode': document.getElementById('mode-result').textContent,
        'Range': document.getElementById('range-result').textContent,
        'Variance': document.getElementById('variance-result').textContent,
        'Standard Deviation': document.getElementById('std-dev-result').textContent,
        'Coefficient of Variation': document.getElementById('cv-result').textContent
    };
    
    const text = Object.entries(results)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    
    navigator.clipboard.writeText(text)
        .then(() => alert('Results copied to clipboard!'))
        .catch(() => alert('Failed to copy results'));
}
