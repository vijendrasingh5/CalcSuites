function loadProbabilityCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Probability Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Basic Probability -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Basic Probability</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Number of Favorable Outcomes</label>
                                <input type="number" class="form-control" id="favorable-outcomes" min="0">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Total Number of Possible Outcomes</label>
                                <input type="number" class="form-control" id="total-outcomes" min="1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateBasicProbability()">Calculate Probability</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="basic-probability-result" style="display: none;">
                                    Probability: <span class="result-value">-</span>
                                    <div class="small mt-2">
                                        Percentage: <span class="percentage-value">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Compound Probability -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Compound Probability</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <select class="form-select" id="compound-type">
                                    <option value="and">AND (Independent Events)</option>
                                    <option value="or">OR (Mutually Exclusive Events)</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Probability of Event A</label>
                                <input type="number" class="form-control" id="probability-a" 
                                    min="0" max="1" step="0.01">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Probability of Event B</label>
                                <input type="number" class="form-control" id="probability-b" 
                                    min="0" max="1" step="0.01">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateCompoundProbability()">Calculate Compound Probability</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="compound-probability-result" style="display: none;">
                                    Compound Probability: <span class="result-value">-</span>
                                    <div class="small mt-2">
                                        Percentage: <span class="percentage-value">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Conditional Probability -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Conditional Probability</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">P(A and B)</label>
                                <input type="number" class="form-control" id="probability-a-and-b" 
                                    min="0" max="1" step="0.01">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">P(B)</label>
                                <input type="number" class="form-control" id="probability-b-only" 
                                    min="0" max="1" step="0.01">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateConditionalProbability()">Calculate P(A|B)</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="conditional-probability-result" style="display: none;">
                                    P(A|B): <span class="result-value">-</span>
                                    <div class="small mt-2">
                                        Percentage: <span class="percentage-value">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Probability Tree -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Probability Tree</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="probability-tree" height="200"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Visual representation of probability paths
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
                            <button class="btn btn-outline-secondary" onclick="calculateComplementProbability()">Find Complement</button>
                            <button class="btn btn-outline-secondary" onclick="clearCalculator()">Clear Calculator</button>
                            <button class="btn btn-outline-secondary" onclick="showProbabilityTable()">Common Probability Table</button>
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
                            <h6>Basic Probability</h6>
                            <p class="small text-muted">
                                P(Event) = (Favorable Outcomes) / (Total Possible Outcomes)
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Compound Probability</h6>
                            <ul class="list-unstyled small text-muted">
                                <li>• AND (Independent): P(A and B) = P(A) × P(B)</li>
                                <li>• OR (Mutually Exclusive): P(A or B) = P(A) + P(B)</li>
                            </ul>
                        </div>
                        <div class="mb-3">
                            <h6>Conditional Probability</h6>
                            <p class="small text-muted">
                                P(A|B) = P(A and B) / P(B)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Common Probability Table Modal -->
        <div class="modal fade" id="probabilityTableModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Common Probability Table</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Probability</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Coin Flip (Heads)</td>
                                        <td>1/2</td>
                                        <td>50%</td>
                                    </tr>
                                    <tr>
                                        <td>Die Roll (Any Number)</td>
                                        <td>1/6</td>
                                        <td>16.67%</td>
                                    </tr>
                                    <tr>
                                        <td>Drawing Ace from Deck</td>
                                        <td>4/52</td>
                                        <td>7.69%</td>
                                    </tr>
                                    <tr>
                                        <td>Drawing Red Card</td>
                                        <td>26/52</td>
                                        <td>50%</td>
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

    // Initialize probability tree
    drawProbabilityTree();
}

function calculateBasicProbability() {
    const favorable = parseInt(document.getElementById('favorable-outcomes').value);
    const total = parseInt(document.getElementById('total-outcomes').value);
    
    if (isNaN(favorable) || isNaN(total)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (total <= 0) {
        alert('Total outcomes must be greater than 0');
        return;
    }
    
    if (favorable > total) {
        alert('Favorable outcomes cannot exceed total outcomes');
        return;
    }
    
    const probability = favorable / total;
    
    const resultContainer = document.getElementById('basic-probability-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.result-value').textContent = probability.toFixed(4);
    resultContainer.querySelector('.percentage-value').textContent = 
        `${(probability * 100).toFixed(2)}%`;
}

function calculateCompoundProbability() {
    const type = document.getElementById('compound-type').value;
    const probA = parseFloat(document.getElementById('probability-a').value);
    const probB = parseFloat(document.getElementById('probability-b').value);
    
    if (isNaN(probA) || isNaN(probB)) {
        alert('Please enter valid probabilities');
        return;
    }
    
    if (probA < 0 || probA > 1 || probB < 0 || probB > 1) {
        alert('Probabilities must be between 0 and 1');
        return;
    }
    
    let probability;
    if (type === 'and') {
        probability = probA * probB;
    } else {
        probability = probA + probB;
        if (probability > 1) {
            alert('Sum of probabilities cannot exceed 1 for mutually exclusive events');
            return;
        }
    }
    
    const resultContainer = document.getElementById('compound-probability-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.result-value').textContent = probability.toFixed(4);
    resultContainer.querySelector('.percentage-value').textContent = 
        `${(probability * 100).toFixed(2)}%`;
    
    // Update tree visualization
    drawProbabilityTree(type, probA, probB);
}

function calculateConditionalProbability() {
    const probAandB = parseFloat(document.getElementById('probability-a-and-b').value);
    const probB = parseFloat(document.getElementById('probability-b-only').value);
    
    if (isNaN(probAandB) || isNaN(probB)) {
        alert('Please enter valid probabilities');
        return;
    }
    
    if (probAandB < 0 || probAandB > 1 || probB < 0 || probB > 1) {
        alert('Probabilities must be between 0 and 1');
        return;
    }
    
    if (probAandB > probB) {
        alert('P(A and B) cannot be greater than P(B)');
        return;
    }
    
    if (probB === 0) {
        alert('P(B) cannot be 0');
        return;
    }
    
    const probability = probAandB / probB;
    
    const resultContainer = document.getElementById('conditional-probability-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.result-value').textContent = probability.toFixed(4);
    resultContainer.querySelector('.percentage-value').textContent = 
        `${(probability * 100).toFixed(2)}%`;
}

function calculateComplementProbability() {
    const basicProb = document.getElementById('basic-probability-result');
    if (basicProb.style.display === 'block') {
        const prob = parseFloat(basicProb.querySelector('.result-value').textContent);
        const complement = 1 - prob;
        alert(`Complement Probability: ${complement.toFixed(4)} (${(complement * 100).toFixed(2)}%)`);
    } else {
        alert('Please calculate a basic probability first');
    }
}

function drawProbabilityTree(type = 'and', probA = 0.5, probB = 0.5) {
    const ctx = document.getElementById('probability-tree').getContext('2d');
    
    // Clear previous chart if it exists
    if (window.probabilityChart) {
        window.probabilityChart.destroy();
    }
    
    // Calculate node positions
    const data = {
        nodes: [
            { id: 'start', x: 50, y: 100 },
            { id: 'A', x: 150, y: 50 },
            { id: 'notA', x: 150, y: 150 },
            { id: 'AB', x: 250, y: 25 },
            { id: 'AnotB', x: 250, y: 75 },
            { id: 'notAB', x: 250, y: 125 },
            { id: 'notAnotB', x: 250, y: 175 }
        ],
        edges: [
            { from: 'start', to: 'A', label: `P(A)=${probA.toFixed(2)}` },
            { from: 'start', to: 'notA', label: `P(not A)=${(1-probA).toFixed(2)}` },
            { from: 'A', to: 'AB', label: `P(B)=${probB.toFixed(2)}` },
            { from: 'A', to: 'AnotB', label: `P(not B)=${(1-probB).toFixed(2)}` },
            { from: 'notA', to: 'notAB', label: `P(B)=${probB.toFixed(2)}` },
            { from: 'notA', to: 'notAnotB', label: `P(not B)=${(1-probB).toFixed(2)}` }
        ]
    };
    
    // Draw tree
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw edges
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    data.edges.forEach(edge => {
        const from = data.nodes.find(n => n.id === edge.from);
        const to = data.nodes.find(n => n.id === edge.to);
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        
        // Draw edge label
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.fillText(edge.label, 
            (from.x + to.x) / 2, 
            (from.y + to.y) / 2 - 5);
    });
    
    // Draw nodes
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#36a2eb';
    ctx.lineWidth = 2;
    data.nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw node label
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
    });
}

function showProbabilityTable() {
    const modal = new bootstrap.Modal(document.getElementById('probabilityTableModal'));
    modal.show();
}

function clearCalculator() {
    // Clear basic probability
    document.getElementById('favorable-outcomes').value = '';
    document.getElementById('total-outcomes').value = '';
    document.getElementById('basic-probability-result').style.display = 'none';
    
    // Clear compound probability
    document.getElementById('probability-a').value = '';
    document.getElementById('probability-b').value = '';
    document.getElementById('compound-probability-result').style.display = 'none';
    
    // Clear conditional probability
    document.getElementById('probability-a-and-b').value = '';
    document.getElementById('probability-b-only').value = '';
    document.getElementById('conditional-probability-result').style.display = 'none';
    
    // Reset probability tree
    drawProbabilityTree();
}
