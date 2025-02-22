function loadBmrCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('BMR Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Gender</label>
                    <div class="gender-selector">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender" id="gender-male" value="male" checked>
                            <label class="form-check-label" for="gender-male">
                                <i class="fas fa-male"></i> Male
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender" id="gender-female" value="female">
                            <label class="form-check-label" for="gender-female">
                                <i class="fas fa-female"></i> Female
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="bmr-age" class="form-label">Age (years)</label>
                    <input type="number" class="form-control" id="bmr-age" min="1" max="120" placeholder="Enter age (1-120)">
                    <div class="form-text">Typical range: 1-120 years</div>
                </div>
                
                <div class="mb-3">
                    <label for="bmr-height" class="form-label">Height</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="bmr-height" step="0.01" placeholder="Enter height">
                        <select class="form-select" id="bmr-height-unit" onchange="updateBMRPlaceholders()">
                            <option value="cm">cm</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                    <div class="form-text" id="height-range">Typical range: 100-250 cm</div>
                </div>
                
                <div class="mb-3">
                    <label for="bmr-weight" class="form-label">Weight</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="bmr-weight" step="0.1" placeholder="Enter weight">
                        <select class="form-select" id="bmr-weight-unit" onchange="updateBMRPlaceholders()">
                            <option value="kg">kg</option>
                            <option value="lbs">lbs</option>
                        </select>
                    </div>
                    <div class="form-text" id="weight-range">Typical range: 30-300 kg</div>
                </div>
                
                <div class="mb-3">
                    <label for="activity-level" class="form-label">Activity Level</label>
                    <select class="form-select" id="activity-level">
                        <option value="1.2">Sedentary (little or no exercise)</option>
                        <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
                        <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
                        <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
                        <option value="1.9">Extra active (very hard exercise & physical job)</option>
                    </select>
                </div>
                
                <div class="d-grid gap-2">
                    <button class="btn btn-primary" onclick="calculateBMR()">
                        <i class="fas fa-calculator"></i> Calculate BMR
                    </button>
                    <button class="btn btn-secondary" onclick="saveBMRToHistory()">
                        <i class="fas fa-save"></i> Save Result
                    </button>
                </div>
            </div>
            
            <div class="col-md-6">
                <div id="bmr-result" class="result-box mt-3" style="display: none;">
                    <h4>Your BMR Results</h4>
                    <div class="mb-3">
                        <strong>Basal Metabolic Rate (BMR):</strong>
                        <p id="bmr-value" class="result-value"></p>
                        <canvas id="bmr-gauge" class="mt-2" style="width: 100%; height: 100px;"></canvas>
                    </div>
                    <div class="mb-3">
                        <strong>Total Daily Energy Expenditure (TDEE):</strong>
                        <p id="tdee-value" class="result-value"></p>
                        <div class="progress">
                            <div id="tdee-progress" class="progress-bar bg-info" role="progressbar"></div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <h5>Daily Calorie Needs Based on Goals:</h5>
                        <div class="calorie-goals">
                            <div id="maintain-calories" class="goal-card maintain"></div>
                            <div id="lose-calories" class="goal-card lose"></div>
                            <div id="gain-calories" class="goal-card gain"></div>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">Calculation History</h5>
                        <div id="bmr-history" style="max-height: 200px; overflow-y: auto;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    initBMRGauge();
}

function updateBMRPlaceholders() {
    const heightUnit = document.getElementById('bmr-height-unit').value;
    const weightUnit = document.getElementById('bmr-weight-unit').value;
    const heightRange = document.getElementById('height-range');
    const weightRange = document.getElementById('weight-range');
    
    if (heightUnit === 'cm') {
        heightRange.textContent = 'Typical range: 100-250 cm';
    } else {
        heightRange.textContent = 'Typical range: 3.3-8.2 ft';
    }
    
    if (weightUnit === 'kg') {
        weightRange.textContent = 'Typical range: 30-300 kg';
    } else {
        weightRange.textContent = 'Typical range: 66-660 lbs';
    }
}

function initBMRGauge() {
    const canvas = document.getElementById('bmr-gauge');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawBMRGauge(ctx, canvas.width, canvas.height, 0);
}

function drawBMRGauge(ctx, width, height, percentage) {
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height - 20;
    const radius = Math.max(Math.min(width / 2.5, height - 30), 0);
    
    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#f0f0f0';
    ctx.stroke();
    
    // Draw value arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + (percentage * Math.PI));
    ctx.lineWidth = 20;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(0.5, '#2196F3');
    gradient.addColorStop(1, '#f44336');
    ctx.strokeStyle = gradient;
    ctx.stroke();
}

function calculateBMR() {
    // Get input values
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const age = parseFloat(document.getElementById('bmr-age').value);
    const heightUnit = document.getElementById('bmr-height-unit').value;
    const weightUnit = document.getElementById('bmr-weight-unit').value;
    let height = parseFloat(document.getElementById('bmr-height').value);
    let weight = parseFloat(document.getElementById('bmr-weight').value);
    const activityLevel = parseFloat(document.getElementById('activity-level').value);
    
    // Validate inputs
    if (!age || !height || !weight || age < 1 || age > 120) {
        showAlert('Please enter valid values for all fields', 'danger');
        return;
    }
    
    // Convert measurements to cm and kg if necessary
    if (heightUnit === 'ft') {
        height = height * 30.48; // Convert feet to cm
    }
    if (weightUnit === 'lbs') {
        weight = weight * 0.453592; // Convert lbs to kg
    }
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // Calculate TDEE
    const tdee = bmr * activityLevel;
    
    // Display results
    document.getElementById('bmr-result').style.display = 'block';
    document.getElementById('bmr-value').textContent = `${formatNumber(bmr)} calories/day`;
    document.getElementById('tdee-value').textContent = `${formatNumber(tdee)} calories/day`;
    
    // Update gauge visualization
    const maxBMR = 3000; // Adjust based on typical values
    const bmrPercentage = Math.min(bmr / maxBMR, 1);
    drawBMRGauge(document.getElementById('bmr-gauge').getContext('2d'),
                 document.getElementById('bmr-gauge').width,
                 document.getElementById('bmr-gauge').height,
                 bmrPercentage);
    
    // Update TDEE progress bar
    const tdeeProgress = document.getElementById('tdee-progress');
    const tdeePercentage = Math.min((tdee / (bmr * 2)) * 100, 100);
    tdeeProgress.style.width = `${tdeePercentage}%`;
    
    // Calculate and display calorie goals with icons
    document.getElementById('maintain-calories').innerHTML = `
        <i class="fas fa-balance-scale"></i>
        <strong>Maintain weight</strong>
        <span>${formatNumber(tdee)} cal/day</span>
    `;
    
    document.getElementById('lose-calories').innerHTML = `
        <i class="fas fa-arrow-down"></i>
        <strong>Lose weight</strong>
        <span>${formatNumber(tdee - 500)} cal/day</span>
        <small>-0.5 kg/week</small>
    `;
    
    document.getElementById('gain-calories').innerHTML = `
        <i class="fas fa-arrow-up"></i>
        <strong>Gain weight</strong>
        <span>${formatNumber(tdee + 500)} cal/day</span>
        <small>+0.5 kg/week</small>
    `;
    
    // Track calculator usage
    trackCalculatorUse('bmr');
}

function saveBMRToHistory() {
    const results = document.getElementById('bmr-result');
    const history = document.getElementById('bmr-history');
    
    if (results.style.display !== 'none') {
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item mb-2';
        
        const bmrValue = document.getElementById('bmr-value').textContent;
        const tdeeValue = document.getElementById('tdee-value').textContent;
        
        historyItem.innerHTML = `
            <small class="text-muted">${timestamp}</small>
            <hr class="my-1">
            <div><strong>BMR:</strong> ${bmrValue}</div>
            <div><strong>TDEE:</strong> ${tdeeValue}</div>
            <button class="btn btn-sm btn-outline-primary mt-1" onclick="recallBMRCalculation(this)">
                <i class="fas fa-history"></i> Recall
            </button>
        `;
        
        history.insertBefore(historyItem, history.firstChild);
        
        // Limit history to last 5 calculations
        if (history.children.length > 5) {
            history.removeChild(history.lastChild);
        }
    }
}

function recallBMRCalculation(button) {
    const historyItem = button.parentElement;
    const results = document.getElementById('bmr-result');
    results.style.display = 'block';
    
    // Extract values from history item
    const [bmrText, tdeeText] = historyItem.textContent.split('\n').slice(1);
    
    // Update display
    document.getElementById('bmr-value').textContent = bmrText.split(': ')[1];
    document.getElementById('tdee-value').textContent = tdeeText.split(': ')[1];
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.getElementById('calculator-container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function formatNumber(num) {
    return Math.round(num).toLocaleString();
}
