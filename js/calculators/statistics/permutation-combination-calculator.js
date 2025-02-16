function loadPermutationCombinationCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Permutation & Combination Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Basic Calculations -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Basic Calculations</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Total Items (n)</label>
                                <input type="number" class="form-control" id="total-items" min="0" max="100">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Items to Choose (r)</label>
                                <input type="number" class="form-control" id="items-to-choose" min="0" max="100">
                            </div>
                            <div class="col-12">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="with-repetition">
                                    <label class="form-check-label" for="with-repetition">
                                        Allow Repetition
                                    </label>
                                    <i class="bi bi-info-circle" data-bs-toggle="tooltip" 
                                       title="If checked, the same item can be chosen multiple times"></i>
                                </div>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary me-2" onclick="calculatePermutation()">Calculate Permutation</button>
                                <button class="btn btn-primary" onclick="calculateCombination()">Calculate Combination</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="basic-result" style="display: none;">
                                    <div class="mb-2">Permutation: <span id="permutation-result">-</span></div>
                                    <div>Combination: <span id="combination-result">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Word Arrangements -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Word Arrangements</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">Enter Word</label>
                                <input type="text" class="form-control" id="word-input" 
                                    placeholder="Enter a word (e.g., MISSISSIPPI)">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateWordArrangements()">Calculate Arrangements</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="word-result" style="display: none;">
                                    Possible Arrangements: <span class="result-value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Circular Arrangements -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Circular Arrangements</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">Number of Items</label>
                                <input type="number" class="form-control" id="circular-items" min="1" max="100">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateCircularArrangements()">Calculate Arrangements</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="circular-result" style="display: none;">
                                    Circular Arrangements: <span class="result-value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Visual Representation -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Visual Representation</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="arrangement-visual" height="200"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Visual example of arrangements
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
                            <h6>Permutation</h6>
                            <p class="small text-muted">
                                Order matters. Formula without repetition: P(n,r) = n!/(n-r)!
                                <br>With repetition: P(n,r) = n^r
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Combination</h6>
                            <p class="small text-muted">
                                Order doesn't matter. Formula without repetition: C(n,r) = n!/[r!(n-r)!]
                                <br>With repetition: C(n+r-1,r)
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Circular Arrangement</h6>
                            <p class="small text-muted">
                                For n distinct objects: (n-1)!
                                <br>Rotations are considered the same arrangement.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Examples Modal -->
        <div class="modal fade" id="examplesModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Examples</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Problem</th>
                                        <th>Type</th>
                                        <th>Solution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Arrange 3 books on a shelf</td>
                                        <td>Permutation</td>
                                        <td>P(3,3) = 6</td>
                                    </tr>
                                    <tr>
                                        <td>Choose 2 fruits from 5</td>
                                        <td>Combination</td>
                                        <td>C(5,2) = 10</td>
                                    </tr>
                                    <tr>
                                        <td>Arrange 4 people around a table</td>
                                        <td>Circular</td>
                                        <td>3! = 6</td>
                                    </tr>
                                </tbody>
                            </table>
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

    // Draw initial visual
    drawArrangementVisual();
}

function factorial(n) {
    if (n < 0) return 0;
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

function calculatePermutation() {
    const n = parseInt(document.getElementById('total-items').value);
    const r = parseInt(document.getElementById('items-to-choose').value);
    const withRepetition = document.getElementById('with-repetition').checked;
    
    if (isNaN(n) || isNaN(r)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (n < 0 || r < 0) {
        alert('Numbers must be non-negative');
        return;
    }
    
    if (!withRepetition && r > n) {
        alert('Cannot choose more items than available');
        return;
    }
    
    let result;
    if (withRepetition) {
        result = Math.pow(n, r);
    } else {
        result = factorial(n) / factorial(n - r);
    }
    
    document.getElementById('basic-result').style.display = 'block';
    document.getElementById('permutation-result').textContent = result.toLocaleString();
    
    // Update visual
    drawArrangementVisual('permutation', n, r);
}

function calculateCombination() {
    const n = parseInt(document.getElementById('total-items').value);
    const r = parseInt(document.getElementById('items-to-choose').value);
    const withRepetition = document.getElementById('with-repetition').checked;
    
    if (isNaN(n) || isNaN(r)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (n < 0 || r < 0) {
        alert('Numbers must be non-negative');
        return;
    }
    
    if (!withRepetition && r > n) {
        alert('Cannot choose more items than available');
        return;
    }
    
    let result;
    if (withRepetition) {
        // Combination with repetition formula: C(n+r-1,r)
        result = factorial(n + r - 1) / (factorial(r) * factorial(n - 1));
    } else {
        result = factorial(n) / (factorial(r) * factorial(n - r));
    }
    
    document.getElementById('basic-result').style.display = 'block';
    document.getElementById('combination-result').textContent = result.toLocaleString();
    
    // Update visual
    drawArrangementVisual('combination', n, r);
}

function calculateWordArrangements() {
    const word = document.getElementById('word-input').value.toUpperCase();
    
    if (!word) {
        alert('Please enter a word');
        return;
    }
    
    // Count frequency of each letter
    const frequency = {};
    for (let char of word) {
        frequency[char] = (frequency[char] || 0) + 1;
    }
    
    // Calculate arrangements with repeated letters
    let denominator = 1;
    Object.values(frequency).forEach(count => {
        denominator *= factorial(count);
    });
    
    const result = factorial(word.length) / denominator;
    
    document.getElementById('word-result').style.display = 'block';
    document.getElementById('word-result').querySelector('.result-value').textContent = 
        result.toLocaleString();
}

function calculateCircularArrangements() {
    const n = parseInt(document.getElementById('circular-items').value);
    
    if (isNaN(n)) {
        alert('Please enter a valid number');
        return;
    }
    
    if (n < 1) {
        alert('Number must be positive');
        return;
    }
    
    // Circular arrangement formula: (n-1)!
    const result = factorial(n - 1);
    
    document.getElementById('circular-result').style.display = 'block';
    document.getElementById('circular-result').querySelector('.result-value').textContent = 
        result.toLocaleString();
    
    // Update visual
    drawArrangementVisual('circular', n);
}

function drawArrangementVisual(type = 'basic', n = 3, r = 2) {
    const ctx = document.getElementById('arrangement-visual').getContext('2d');
    
    // Clear previous chart if it exists
    if (window.arrangementChart) {
        window.arrangementChart.destroy();
    }
    
    if (type === 'circular') {
        // Draw circular arrangement
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 30;
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#36a2eb';
        ctx.stroke();
        
        // Draw points
        for (let i = 0; i < n; i++) {
            const angle = (i * 2 * Math.PI) / n;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#36a2eb';
            ctx.fill();
            
            // Add number
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((i + 1).toString(), x, y - 15);
        }
    } else {
        // Draw grid representation for permutation/combination
        const items = Array.from({length: n}, (_, i) => i + 1);
        const data = {
            labels: items,
            datasets: [{
                label: type === 'permutation' ? 'Permutation' : 'Combination',
                data: items.map(() => 1),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
        
        window.arrangementChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Selecting ${r} items from ${n} items`
                    }
                }
            }
        });
    }
}

function showExamples() {
    const modal = new bootstrap.Modal(document.getElementById('examplesModal'));
    modal.show();
}

function showFormulas() {
    alert(`Formulas:

Permutation (without repetition):
P(n,r) = n!/(n-r)!

Permutation (with repetition):
P(n,r) = n^r

Combination (without repetition):
C(n,r) = n!/[r!(n-r)!]

Combination (with repetition):
C(n+r-1,r)

Circular Arrangement:
(n-1)!

Word Arrangement with repeated letters:
n!/(n1!×n2!×...×nk!)
where ni is the frequency of letter i`);
}

function clearCalculator() {
    // Clear basic calculations
    document.getElementById('total-items').value = '';
    document.getElementById('items-to-choose').value = '';
    document.getElementById('with-repetition').checked = false;
    document.getElementById('basic-result').style.display = 'none';
    
    // Clear word arrangements
    document.getElementById('word-input').value = '';
    document.getElementById('word-result').style.display = 'none';
    
    // Clear circular arrangements
    document.getElementById('circular-items').value = '';
    document.getElementById('circular-result').style.display = 'none';
    
    // Reset visual
    drawArrangementVisual();
}
