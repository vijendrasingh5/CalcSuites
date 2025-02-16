// Register the boxplot controller
// Chart.register(Chart.BoxPlotController);

function loadStatisticsCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Statistics Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Data Input -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Data Input</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="data-input" class="form-label">Enter numbers (separated by commas, spaces, or new lines)</label>
                            <textarea class="form-control" id="data-input" rows="4" placeholder="Example: 1, 2, 3, 4, 5"></textarea>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary" onclick="calculateStats()">Calculate</button>
                            <button class="btn btn-secondary" onclick="generateSampleData()">Sample Data</button>
                            <button class="btn btn-danger" onclick="clearStats()">Clear</button>
                        </div>
                    </div>
                </div>

                <!-- Results -->
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Results</h5>
                        <button class="btn btn-sm btn-outline-primary" onclick="copyResults()">
                            Copy Results
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Count</th>
                                        <td id="count-result">-</td>
                                        <th>Sum</th>
                                        <td id="sum-result">-</td>
                                    </tr>
                                    <tr>
                                        <th>Mean</th>
                                        <td id="mean-result">-</td>
                                        <th>Median</th>
                                        <td id="median-result">-</td>
                                    </tr>
                                    <tr>
                                        <th>Mode</th>
                                        <td id="mode-result">-</td>
                                        <th>Range</th>
                                        <td id="range-result">-</td>
                                    </tr>
                                    <tr>
                                        <th>Variance</th>
                                        <td id="variance-result">-</td>
                                        <th>Std. Deviation</th>
                                        <td id="stddev-result">-</td>
                                    </tr>
                                    <tr>
                                        <th>Minimum</th>
                                        <td id="min-result">-</td>
                                        <th>Maximum</th>
                                        <td id="max-result">-</td>
                                    </tr>
                                    <tr>
                                        <th>Q1 (25th)</th>
                                        <td id="q1-result">-</td>
                                        <th>Q3 (75th)</th>
                                        <td id="q3-result">-</td>
                                    </tr>
                                    <tr>
                                        <th>Skewness</th>
                                        <td id="skewness-result">-</td>
                                        <th>Kurtosis</th>
                                        <td id="kurtosis-result">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Visualization -->
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Distribution</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="distribution-chart"></canvas>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Summary Plot</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="summary-plot"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Initialize charts after a short delay to ensure Chart.js is ready
    setTimeout(initializeCharts, 0);
}

// Global chart instances
let distributionChart = null;
let summaryPlot = null;

function calculateStats() {
    const input = document.getElementById('data-input').value;
    const numbers = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    
    if (numbers.length === 0) {
        alert('Please enter valid numbers');
        return;
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const count = numbers.length;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / count;
    
    // Calculate median
    const median = count % 2 === 0 
        ? (sorted[count/2 - 1] + sorted[count/2]) / 2 
        : sorted[Math.floor(count/2)];
    
    // Calculate mode
    const frequency = {};
    numbers.forEach(num => frequency[num] = (frequency[num] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency)
        .filter(key => frequency[key] === maxFreq)
        .map(Number);
    
    // Calculate variance and standard deviation
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / count;
    const stdDev = Math.sqrt(variance);
    
    // Calculate quartiles
    const q1 = sorted[Math.floor(count * 0.25)];
    const q3 = sorted[Math.floor(count * 0.75)];
    
    // Calculate skewness
    const skewness = numbers.reduce((acc, num) => 
        acc + Math.pow((num - mean) / stdDev, 3), 0) / count;
    
    // Calculate kurtosis
    const kurtosis = numbers.reduce((acc, num) => 
        acc + Math.pow((num - mean) / stdDev, 4), 0) / count - 3;
    
    // Update results
    document.getElementById('count-result').textContent = count;
    document.getElementById('sum-result').textContent = formatNumber(sum);
    document.getElementById('mean-result').textContent = formatNumber(mean);
    document.getElementById('median-result').textContent = formatNumber(median);
    document.getElementById('mode-result').textContent = mode.map(n => formatNumber(n)).join(', ');
    document.getElementById('range-result').textContent = formatNumber(sorted[count-1] - sorted[0]);
    document.getElementById('variance-result').textContent = formatNumber(variance);
    document.getElementById('stddev-result').textContent = formatNumber(stdDev);
    document.getElementById('min-result').textContent = formatNumber(sorted[0]);
    document.getElementById('max-result').textContent = formatNumber(sorted[count-1]);
    document.getElementById('q1-result').textContent = formatNumber(q1);
    document.getElementById('q3-result').textContent = formatNumber(q3);
    document.getElementById('skewness-result').textContent = formatNumber(skewness);
    document.getElementById('kurtosis-result').textContent = formatNumber(kurtosis);
    
    // Update visualizations
    updateDistributionChart(numbers, mean, stdDev);
    updateSummaryPlot(sorted);
}

function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    // Initialize distribution chart
    const distCtx = document.getElementById('distribution-chart')?.getContext('2d');
    if (distCtx) {
        // Destroy existing chart if it exists
        if (distributionChart) {
            distributionChart.destroy();
            distributionChart = null;
        }

        distributionChart = new Chart(distCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Frequency',
                    data: [],
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

    // Initialize summary plot
    const summaryCtx = document.getElementById('summary-plot')?.getContext('2d');
    if (summaryCtx) {
        // Destroy existing chart if it exists
        if (summaryPlot) {
            summaryPlot.destroy();
            summaryPlot = null;
        }

        summaryPlot = new Chart(summaryCtx, {
            type: 'bar',
            data: {
                labels: ['Summary'],
                datasets: [{
                    label: 'Range',
                    data: [0],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    barPercentage: 0.1
                }, {
                    label: 'IQR',
                    data: [0],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    barPercentage: 0.3
                }, {
                    label: 'Median',
                    data: [0],
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    barPercentage: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Values'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
}

function updateDistributionChart(numbers, mean, stdDev) {
    if (!distributionChart) {
        console.error('Distribution chart not initialized');
        return;
    }

    // Create histogram data
    const binCount = Math.min(Math.ceil(Math.sqrt(numbers.length)), 20);
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const binWidth = (max - min) / binCount;
    
    const bins = Array(binCount).fill(0);
    const labels = [];
    
    // Create bin labels and count frequencies
    for (let i = 0; i < binCount; i++) {
        const binStart = min + i * binWidth;
        const binEnd = binStart + binWidth;
        labels.push(`${formatNumber(binStart)}-${formatNumber(binEnd)}`);
        
        numbers.forEach(num => {
            if (num >= binStart && (i === binCount - 1 ? num <= binEnd : num < binEnd)) {
                bins[i]++;
            }
        });
    }
    
    distributionChart.data.labels = labels;
    distributionChart.data.datasets[0].data = bins;
    distributionChart.update();
}

function updateSummaryPlot(sorted) {
    if (!summaryPlot) {
        console.error('Summary plot not initialized');
        return;
    }

    const count = sorted.length;
    const q1 = sorted[Math.floor(count * 0.25)];
    const median = count % 2 === 0 
        ? (sorted[count/2 - 1] + sorted[count/2]) / 2 
        : sorted[Math.floor(count/2)];
    const q3 = sorted[Math.floor(count * 0.75)];
    const min = sorted[0];
    const max = sorted[count - 1];
    
    // Update the summary plot data
    summaryPlot.data.datasets[0].data = [max - min];  // Range
    summaryPlot.data.datasets[0].base = min;  // Range bottom at min
    
    summaryPlot.data.datasets[1].data = [q3 - q1];  // IQR
    summaryPlot.data.datasets[1].base = q1;  // IQR bottom at Q1
    
    summaryPlot.data.datasets[2].data = [0.1];  // Median line (small height)
    summaryPlot.data.datasets[2].base = median - 0.05;  // Centered on median
    
    summaryPlot.update();
}

function generateSampleData() {
    const sampleSize = 30;
    const mean = 50;
    const stdDev = 10;
    
    let data = [];
    for (let i = 0; i < sampleSize; i++) {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push(mean + stdDev * z);
    }
    
    document.getElementById('data-input').value = data.map(n => formatNumber(n)).join(', ');
    calculateStats();
}

function clearStats() {
    // Clear inputs
    document.getElementById('data-input').value = '';
    
    // Clear results
    const results = [
        'count', 'sum', 'mean', 'median', 'mode', 'range',
        'variance', 'stddev', 'min', 'max', 'q1', 'q3',
        'skewness', 'kurtosis'
    ];
    results.forEach(id => {
        document.getElementById(`${id}-result`).textContent = '-';
    });
    
    // Clear charts
    if (distributionChart) {
        distributionChart.data.labels = [];
        distributionChart.data.datasets[0].data = [];
        distributionChart.update();
    }
    
    if (summaryPlot) {
        summaryPlot.data.datasets[0].data = [0];
        summaryPlot.data.datasets[0].base = 0;
        summaryPlot.data.datasets[1].data = [0];
        summaryPlot.data.datasets[1].base = 0;
        summaryPlot.data.datasets[2].data = [0];
        summaryPlot.data.datasets[2].base = 0;
        summaryPlot.update();
    }
}

function copyResults() {
    const resultIds = [
        'count', 'sum', 'mean', 'median', 'mode', 'range',
        'variance', 'stddev', 'min', 'max', 'q1', 'q3',
        'skewness', 'kurtosis'
    ];
    
    let text = 'Statistics Results:\n\n';
    resultIds.forEach(id => {
        const label = id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ');
        const value = document.getElementById(`${id}-result`).textContent;
        text += `${label}: ${value}\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Results copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy results:', err);
        alert('Failed to copy results to clipboard');
    });
}
