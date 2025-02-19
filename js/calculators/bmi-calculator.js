function loadBmiCalculator() {
    const container = document.getElementById('calculator-container');
    
    // BMI Calculator UI
    container.innerHTML = `
        <div class="calculator-card">
            <h3><i class="fas fa-weight"></i> BMI Calculator</h3>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label>Unit System</label>
                        <select class="form-control" id="bmi-unit-system" onchange="updateBMIUnits()">
                            <option value="metric">Metric (kg, cm)</option>
                            <option value="imperial">Imperial (lb, in)</option>
                        </select>
                    </div>
                    <div id="bmi-inputs">
                        <div class="form-group mb-3">
                            <label id="weight-label">Weight (kg)</label>
                            <input type="number" id="bmi-weight" class="form-control" step="0.1" required>
                            <div class="form-text" id="weight-range">Healthy range: 30-300 kg</div>
                        </div>
                        <div class="form-group mb-3">
                            <label id="height-label">Height (cm)</label>
                            <input type="number" id="bmi-height" class="form-control" step="0.1" required>
                            <div class="form-text" id="height-range">Typical range: 100-250 cm</div>
                        </div>
                    </div>
                    <button onclick="calculateBMI()" class="btn btn-primary">
                        Calculate BMI
                    </button>
                    <button onclick="saveBMIToHistory()" class="btn btn-secondary ms-2">
                        Save Result
                    </button>
                </div>
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Results</h5>
                            <div id="bmi-results"></div>
                            <canvas id="bmi-gauge" class="mt-3" style="width: 100%; height: 150px;"></canvas>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">History</h5>
                            <div id="bmi-history" style="max-height: 200px; overflow-y: auto;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">BMI Categories</h5>
                            <div class="bmi-scale-container">
                                <div class="bmi-scale">
                                    <div class="scale-segment underweight" style="width: 20%">
                                        <span>Underweight</span>
                                        <small>&lt;18.5</small>
                                    </div>
                                    <div class="scale-segment normal" style="width: 25%">
                                        <span>Normal</span>
                                        <small>18.5-24.9</small>
                                    </div>
                                    <div class="scale-segment overweight" style="width: 25%">
                                        <span>Overweight</span>
                                        <small>25-29.9</small>
                                    </div>
                                    <div class="scale-segment obese" style="width: 30%">
                                        <span>Obese</span>
                                        <small>≥30</small>
                                    </div>
                                </div>
                                <div id="bmi-marker" class="bmi-marker"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize the BMI gauge
    initBMIGauge();

    window.currentCalculator = {
        type: 'bmi',
        calculate: calculateBMI
    };
}

function updateBMIUnits() {
    const unitSystem = document.getElementById('bmi-unit-system').value;
    const weightLabel = document.getElementById('weight-label');
    const heightLabel = document.getElementById('height-label');
    const weightRange = document.getElementById('weight-range');
    const heightRange = document.getElementById('height-range');
    
    if (unitSystem === 'metric') {
        weightLabel.textContent = 'Weight (kg)';
        heightLabel.textContent = 'Height (cm)';
        weightRange.textContent = 'Healthy range: 30-300 kg';
        heightRange.textContent = 'Typical range: 100-250 cm';
    } else {
        weightLabel.textContent = 'Weight (lb)';
        heightLabel.textContent = 'Height (in)';
        weightRange.textContent = 'Healthy range: 66-660 lb';
        heightRange.textContent = 'Typical range: 39-98 in';
    }
}

function initBMIGauge() {
    const canvas = document.getElementById('bmi-gauge');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw empty gauge
    drawBMIGauge(ctx, canvas.width, canvas.height, 0);
}

function drawBMIGauge(ctx, width, height, bmi) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Validate BMI value
    if (isNaN(bmi) || bmi < 0) {
        bmi = 0;
    }
    
    // Draw gauge background
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#81c784'); // Underweight
    gradient.addColorStop(0.3, '#4caf50'); // Normal
    gradient.addColorStop(0.6, '#ffd54f'); // Overweight
    gradient.addColorStop(1, '#e57373'); // Obese
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height/2, width, 20);
    
    // Draw marker only if BMI is valid and positive
    if (bmi > 0) {
        const position = Math.min((bmi / 40) * width, width);
        
        // Draw triangle marker
        ctx.beginPath();
        ctx.moveTo(position, height/2);
        ctx.lineTo(position - 10, height/2 - 15);
        ctx.lineTo(position + 10, height/2 - 15);
        ctx.closePath();
        ctx.fillStyle = '#000';
        ctx.fill();
        
        // Draw BMI value
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(bmi.toFixed(1), position, height/2 - 25);
    }
}

function calculateBMI() {
    const unitSystem = document.getElementById('bmi-unit-system').value;
    let weight = parseFloat(document.getElementById('bmi-weight').value);
    let height = parseFloat(document.getElementById('bmi-height').value);
    
    if (!weight || !height) {
        document.getElementById('bmi-results').innerHTML = `
            <div class="alert alert-danger">
                Please enter valid values
            </div>
        `;
        return;
    }
    
    // Convert imperial to metric if needed
    if (unitSystem === 'imperial') {
        weight = weight * 0.453592; // lb to kg
        height = height * 2.54; // in to cm
    }
    
    // Convert height to meters
    height = height / 100;
    
    const bmi = weight / (height * height);
    const category = getBMICategory(bmi);
    const healthyWeightRange = getHealthyWeightRange(height, unitSystem);
    
    document.getElementById('bmi-results').innerHTML = `
        <div class="alert alert-info">
            <h4>BMI: ${bmi.toFixed(1)}</h4>
            <p class="mb-0">Category: <strong>${category}</strong></p>
            <hr>
            <p class="mb-0">Healthy Weight Range:<br>${healthyWeightRange}</p>
        </div>
    `;
    
    // Update visualizations
    drawBMIGauge(document.getElementById('bmi-gauge').getContext('2d'), 
                 document.getElementById('bmi-gauge').width,
                 document.getElementById('bmi-gauge').height,
                 bmi);
    
    updateBMIMarker(bmi);
    
    // Track calculator usage
    trackCalculatorUse('bmi');
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal Weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

function getHealthyWeightRange(height, unitSystem) {
    const minBMI = 18.5;
    const maxBMI = 24.9;
    
    let minWeight = minBMI * height * height;
    let maxWeight = maxBMI * height * height;
    
    if (unitSystem === 'imperial') {
        minWeight = minWeight * 2.20462; // kg to lb
        maxWeight = maxWeight * 2.20462;
        return `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} lb`;
    }
    
    return `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg`;
}

function updateBMIMarker(bmi) {
    const marker = document.getElementById('bmi-marker');
    const position = Math.min((bmi / 40) * 100, 100);
    marker.style.left = `${position}%`;
}

function saveBMIToHistory() {
    const results = document.getElementById('bmi-results');
    const history = document.getElementById('bmi-history');
    
    if (results.textContent) {
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = document.createElement('div');
        historyItem.className = 'alert alert-secondary mt-2';
        historyItem.innerHTML = `
            <small>${timestamp}</small>
            <hr class="my-1">
            ${results.textContent}
            <button class="btn btn-sm btn-outline-primary mt-1" onclick="recallBMICalculation(this)">Recall</button>
        `;
        
        history.insertBefore(historyItem, history.firstChild);
        
        // Limit history to last 5 calculations
        if (history.children.length > 5) {
            history.removeChild(history.lastChild);
        }
    }
}

function recallBMICalculation(button) {
    const historyItem = button.parentElement;
    const results = document.getElementById('bmi-results');
    results.innerHTML = historyItem.innerHTML;
}
