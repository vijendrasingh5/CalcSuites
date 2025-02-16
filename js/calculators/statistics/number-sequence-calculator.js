function loadNumberSequenceCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Number Sequence Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Sequence Analysis -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Sequence Analysis</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">Enter Numbers (comma-separated)</label>
                                <input type="text" class="form-control" id="sequence-input" 
                                    placeholder="e.g., 2, 4, 6, 8, 10">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary me-2" onclick="analyzeSequence()">Analyze Sequence</button>
                                <button class="btn btn-outline-secondary" onclick="generateExample()">Generate Example</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="sequence-result" style="display: none;">
                                    <div class="mb-2">Type: <span id="sequence-type">-</span></div>
                                    <div class="mb-2">Pattern: <span id="sequence-pattern">-</span></div>
                                    <div class="mb-2">Next Term: <span id="next-term">-</span></div>
                                    <div>Formula: <span id="sequence-formula">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sequence Generator -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Sequence Generator</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Sequence Type</label>
                                <select class="form-select" id="generator-type">
                                    <option value="arithmetic">Arithmetic</option>
                                    <option value="geometric">Geometric</option>
                                    <option value="fibonacci">Fibonacci</option>
                                    <option value="square">Square Numbers</option>
                                    <option value="cube">Cube Numbers</option>
                                    <option value="prime">Prime Numbers</option>
                                    <option value="triangular">Triangular Numbers</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Number of Terms</label>
                                <input type="number" class="form-control" id="num-terms" 
                                    value="10" min="1" max="100">
                            </div>
                            <div class="col-md-6 arithmetic-params">
                                <label class="form-label">First Term</label>
                                <input type="number" class="form-control" id="first-term" value="1">
                            </div>
                            <div class="col-md-6 arithmetic-params">
                                <label class="form-label">Common Difference/Ratio</label>
                                <input type="number" class="form-control" id="common-diff" value="2">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="generateSequence()">Generate Sequence</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="generator-result" style="display: none;">
                                    <div class="mb-2">Generated Sequence:</div>
                                    <div id="generated-sequence" class="text-break">-</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sequence Statistics -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Sequence Statistics</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <div id="sequence-stats" style="display: none;">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-2">Sum: <span id="sequence-sum">-</span></div>
                                            <div class="mb-2">Mean: <span id="sequence-mean">-</span></div>
                                            <div class="mb-2">Median: <span id="sequence-median">-</span></div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-2">First Difference: <span id="first-difference">-</span></div>
                                            <div class="mb-2">Second Difference: <span id="second-difference">-</span></div>
                                            <div class="mb-2">Growth Rate: <span id="growth-rate">-</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Sequence Visualization -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Sequence Visualization</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="sequence-chart" height="200"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Visual representation of the sequence
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
                            <button class="btn btn-outline-secondary" onclick="showPatterns()">Common Patterns</button>
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
                            <h6>Arithmetic Sequence</h6>
                            <p class="small text-muted">
                                Each term differs from the previous by a constant (common difference).
                                <br>Example: 2, 5, 8, 11, 14 (d=3)
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Geometric Sequence</h6>
                            <p class="small text-muted">
                                Each term is a constant multiple of the previous term.
                                <br>Example: 2, 6, 18, 54, 162 (r=3)
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Fibonacci Sequence</h6>
                            <p class="small text-muted">
                                Each term is the sum of the two preceding terms.
                                <br>Example: 0, 1, 1, 2, 3, 5, 8, 13
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
    document.getElementById('generator-type').addEventListener('change', updateGeneratorParams);
    
    // Draw initial chart
    drawSequenceChart();
}

function analyzeSequence() {
    const input = document.getElementById('sequence-input').value;
    const sequence = input.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    
    if (sequence.length < 3) {
        alert('Please enter at least 3 numbers');
        return;
    }
    
    // Calculate differences
    const firstDiff = [];
    const secondDiff = [];
    for (let i = 1; i < sequence.length; i++) {
        firstDiff.push(sequence[i] - sequence[i-1]);
    }
    for (let i = 1; i < firstDiff.length; i++) {
        secondDiff.push(firstDiff[i] - firstDiff[i-1]);
    }
    
    // Determine sequence type and pattern
    let type = '';
    let pattern = '';
    let formula = '';
    let nextTerm = '';
    
    // Check for arithmetic sequence
    if (secondDiff.every(d => Math.abs(d) < 0.0001)) {
        type = 'Arithmetic Sequence';
        const d = firstDiff[0];
        pattern = `Common difference: ${d}`;
        nextTerm = sequence[sequence.length-1] + d;
        formula = `an = a1 + (n-1)d = ${sequence[0]} + (n-1)(${d})`;
    }
    // Check for geometric sequence
    else {
        const ratios = [];
        for (let i = 1; i < sequence.length; i++) {
            ratios.push(sequence[i] / sequence[i-1]);
        }
        if (ratios.every(r => Math.abs(r - ratios[0]) < 0.0001)) {
            type = 'Geometric Sequence';
            const r = ratios[0];
            pattern = `Common ratio: ${r}`;
            nextTerm = sequence[sequence.length-1] * r;
            formula = `an = a1 * r^(n-1) = ${sequence[0]} * ${r}^(n-1)`;
        }
    }
    
    // If no pattern found, check for other sequences
    if (!type) {
        // Check for Fibonacci-like sequence
        let isFibonacci = true;
        for (let i = 2; i < sequence.length; i++) {
            if (Math.abs(sequence[i] - (sequence[i-1] + sequence[i-2])) > 0.0001) {
                isFibonacci = false;
                break;
            }
        }
        if (isFibonacci) {
            type = 'Fibonacci-like Sequence';
            pattern = 'Each term is the sum of the two preceding terms';
            nextTerm = sequence[sequence.length-1] + sequence[sequence.length-2];
            formula = 'an = a(n-1) + a(n-2)';
        }
    }
    
    // Update results
    document.getElementById('sequence-result').style.display = 'block';
    document.getElementById('sequence-type').textContent = type || 'Unknown';
    document.getElementById('sequence-pattern').textContent = pattern || 'No clear pattern detected';
    document.getElementById('next-term').textContent = nextTerm || 'Cannot predict';
    document.getElementById('sequence-formula').textContent = formula || 'No formula available';
    
    // Update statistics
    updateSequenceStats(sequence);
    
    // Update chart
    drawSequenceChart(sequence);
}

function generateSequence() {
    const type = document.getElementById('generator-type').value;
    const numTerms = parseInt(document.getElementById('num-terms').value);
    const firstTerm = parseFloat(document.getElementById('first-term').value);
    const commonDiff = parseFloat(document.getElementById('common-diff').value);
    
    if (isNaN(numTerms) || numTerms < 1) {
        alert('Please enter a valid number of terms');
        return;
    }
    
    let sequence = [];
    
    switch (type) {
        case 'arithmetic':
            for (let i = 0; i < numTerms; i++) {
                sequence.push(firstTerm + i * commonDiff);
            }
            break;
            
        case 'geometric':
            for (let i = 0; i < numTerms; i++) {
                sequence.push(firstTerm * Math.pow(commonDiff, i));
            }
            break;
            
        case 'fibonacci':
            sequence = [0, 1];
            for (let i = 2; i < numTerms; i++) {
                sequence.push(sequence[i-1] + sequence[i-2]);
            }
            break;
            
        case 'square':
            for (let i = 1; i <= numTerms; i++) {
                sequence.push(i * i);
            }
            break;
            
        case 'cube':
            for (let i = 1; i <= numTerms; i++) {
                sequence.push(i * i * i);
            }
            break;
            
        case 'prime':
            let num = 2;
            while (sequence.length < numTerms) {
                if (isPrime(num)) {
                    sequence.push(num);
                }
                num++;
            }
            break;
            
        case 'triangular':
            for (let i = 1; i <= numTerms; i++) {
                sequence.push((i * (i + 1)) / 2);
            }
            break;
    }
    
    // Update results
    document.getElementById('generator-result').style.display = 'block';
    document.getElementById('generated-sequence').textContent = sequence.join(', ');
    
    // Update statistics
    updateSequenceStats(sequence);
    
    // Update chart
    drawSequenceChart(sequence);
}

function updateGeneratorParams() {
    const type = document.getElementById('generator-type').value;
    const arithmeticParams = document.querySelectorAll('.arithmetic-params');
    
    arithmeticParams.forEach(param => {
        param.style.display = ['arithmetic', 'geometric'].includes(type) ? 'block' : 'none';
    });
    
    if (type === 'geometric') {
        document.querySelector('label[for="common-diff"]').textContent = 'Common Ratio';
    } else {
        document.querySelector('label[for="common-diff"]').textContent = 'Common Difference';
    }
}

function updateSequenceStats(sequence) {
    const stats = document.getElementById('sequence-stats');
    stats.style.display = 'block';
    
    // Calculate basic statistics
    const sum = sequence.reduce((a, b) => a + b, 0);
    const mean = sum / sequence.length;
    const sortedSeq = [...sequence].sort((a, b) => a - b);
    const median = sequence.length % 2 === 0 
        ? (sortedSeq[sequence.length/2-1] + sortedSeq[sequence.length/2]) / 2
        : sortedSeq[Math.floor(sequence.length/2)];
    
    // Calculate differences and growth rate
    const firstDiff = sequence.length > 1 ? sequence[1] - sequence[0] : 'N/A';
    const secondDiff = sequence.length > 2 ? (sequence[2] - sequence[1]) - (sequence[1] - sequence[0]) : 'N/A';
    const growthRate = sequence.length > 1 ? ((sequence[sequence.length-1] / sequence[0]) - 1) * 100 : 'N/A';
    
    // Update display
    document.getElementById('sequence-sum').textContent = sum.toLocaleString();
    document.getElementById('sequence-mean').textContent = mean.toFixed(2);
    document.getElementById('sequence-median').textContent = median.toLocaleString();
    document.getElementById('first-difference').textContent = firstDiff.toString();
    document.getElementById('second-difference').textContent = secondDiff.toString();
    document.getElementById('growth-rate').textContent = 
        typeof growthRate === 'number' ? growthRate.toFixed(2) + '%' : growthRate;
}

function drawSequenceChart(sequence = [1, 2, 3, 4, 5]) {
    const ctx = document.getElementById('sequence-chart').getContext('2d');
    
    // Clear previous chart if it exists
    if (window.sequenceChart) {
        window.sequenceChart.destroy();
    }
    
    // Create labels (term numbers)
    const labels = Array.from({length: sequence.length}, (_, i) => `Term ${i+1}`);
    
    // Create new chart
    window.sequenceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sequence Values',
                data: sequence,
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
                    beginAtZero: true
                }
            }
        }
    });
}

function generateExample() {
    const examples = [
        '2, 4, 6, 8, 10',                    // Arithmetic
        '2, 6, 18, 54, 162',                 // Geometric
        '0, 1, 1, 2, 3, 5, 8, 13',          // Fibonacci
        '1, 4, 9, 16, 25',                   // Square
        '1, 8, 27, 64, 125',                 // Cube
        '2, 3, 5, 7, 11, 13',               // Prime
        '1, 3, 6, 10, 15'                    // Triangular
    ];
    
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    document.getElementById('sequence-input').value = randomExample;
    analyzeSequence();
}

function isPrime(num) {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
        if (num % i === 0) return false;
    }
    return num > 1;
}

function showPatterns() {
    alert(`Common Number Sequence Patterns:

1. Arithmetic Sequence
   • Constant difference between terms
   • Example: 2, 5, 8, 11, 14 (d=3)

2. Geometric Sequence
   • Constant ratio between terms
   • Example: 2, 6, 18, 54, 162 (r=3)

3. Fibonacci Sequence
   • Each term is sum of previous two
   • Example: 0, 1, 1, 2, 3, 5, 8, 13

4. Square Numbers
   • Perfect squares
   • Example: 1, 4, 9, 16, 25

5. Cube Numbers
   • Perfect cubes
   • Example: 1, 8, 27, 64, 125

6. Prime Numbers
   • Divisible only by 1 and itself
   • Example: 2, 3, 5, 7, 11, 13

7. Triangular Numbers
   • Sum of first n natural numbers
   • Example: 1, 3, 6, 10, 15`);
}

function showFormulas() {
    alert(`Sequence Formulas:

1. Arithmetic Sequence:
   • nth term: an = a1 + (n-1)d
   • Sum: Sn = n(a1 + an)/2
   where d = common difference

2. Geometric Sequence:
   • nth term: an = a1 * r^(n-1)
   • Sum: Sn = a1(1-r^n)/(1-r)
   where r = common ratio

3. Fibonacci Sequence:
   • an = a(n-1) + a(n-2)
   • Golden ratio ≈ 1.618034

4. Square Numbers:
   • an = n²

5. Cube Numbers:
   • an = n³

6. Triangular Numbers:
   • an = n(n+1)/2

7. Sum of Sequence:
   • Arithmetic: Sn = n(a1 + an)/2
   • Geometric: Sn = a1(1-r^n)/(1-r)`);
}

function clearCalculator() {
    // Clear sequence analysis
    document.getElementById('sequence-input').value = '';
    document.getElementById('sequence-result').style.display = 'none';
    
    // Clear sequence generator
    document.getElementById('num-terms').value = '10';
    document.getElementById('first-term').value = '1';
    document.getElementById('common-diff').value = '2';
    document.getElementById('generator-result').style.display = 'none';
    
    // Clear statistics
    document.getElementById('sequence-stats').style.display = 'none';
    
    // Reset chart
    drawSequenceChart();
}
