function createPowerCalculator() {
    const calculator = document.createElement('div');
    calculator.className = 'calculator-content';
    calculator.innerHTML = `
        <h2>Power Calculator</h2>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group mb-3">
                    <label for="calculationType">Calculation Type</label>
                    <select class="form-control" id="calculationType" onchange="updatePowerCalculatorFields()">
                        <option value="electrical">Electrical Power (P = V × I)</option>
                        <option value="resistance">Power with Resistance (P = I²R)</option>
                        <option value="voltage">Power with Voltage (P = V²/R)</option>
                        <option value="mechanical">Mechanical Power (P = F × v)</option>
                        <option value="energy">Power from Energy (P = E/t)</option>
                        <option value="rotational">Rotational Power (P = T × ω)</option>
                        <option value="efficiency">Power Efficiency</option>
                    </select>
                </div>
                <div id="powerInputFields">
                    <!-- Dynamic input fields will be inserted here -->
                </div>
                <div class="form-group mb-3">
                    <label for="unitSystem">Unit System</label>
                    <select class="form-control" id="unitSystem" onchange="updatePowerUnits()">
                        <option value="si">SI Units (Watts, Newton, etc.)</option>
                        <option value="imperial">Imperial Units (HP, lb-ft, etc.)</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="calculatePower()">Calculate</button>
                <button class="btn btn-secondary ms-2" onclick="saveToHistory()">Save Result</button>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Results</h5>
                        <div id="powerResult"></div>
                        <canvas id="powerVisualization" class="mt-3" style="width: 100%; height: 200px;"></canvas>
                    </div>
                </div>
                <div class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">Calculation History</h5>
                        <div id="calculationHistory" style="max-height: 200px; overflow-y: auto;">
                            <!-- History items will be added here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Power Comparison</h5>
                        <div class="power-scale" id="powerComparison">
                            <!-- Power scale visualization will be added here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return calculator;
}

function loadPowerCalculator() {
    const calculatorContainer = document.getElementById('calculator-container');
    if (calculatorContainer) {
        calculatorContainer.innerHTML = '';
        calculatorContainer.appendChild(createPowerCalculator());
        updatePowerCalculatorFields(); // Initialize input fields
    }
}

function updatePowerCalculatorFields() {
    const calculationType = document.getElementById('calculationType').value;
    const inputFieldsDiv = document.getElementById('powerInputFields');
    const unitSystem = document.getElementById('unitSystem').value;
    
    let fieldsHTML = '';
    switch (calculationType) {
        case 'electrical':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="voltage">Voltage (${unitSystem === 'si' ? 'V' : 'V'})</label>
                    <input type="number" class="form-control" id="voltage" step="any" placeholder="Enter voltage">
                    <div class="form-text">Range: 0-100,000V</div>
                </div>
                <div class="form-group mb-3">
                    <label for="current">Current (${unitSystem === 'si' ? 'A' : 'A'})</label>
                    <input type="number" class="form-control" id="current" step="any" placeholder="Enter current">
                    <div class="form-text">Range: 0-1,000A</div>
                </div>
            `;
            break;
            
        case 'resistance':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="current">Current (${unitSystem === 'si' ? 'A' : 'A'})</label>
                    <input type="number" class="form-control" id="current" step="any" placeholder="Enter current">
                </div>
                <div class="form-group mb-3">
                    <label for="resistance">Resistance (${unitSystem === 'si' ? 'Ω' : 'Ω'})</label>
                    <input type="number" class="form-control" id="resistance" step="any" placeholder="Enter resistance">
                </div>
            `;
            break;
            
        case 'voltage':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="voltage">Voltage (${unitSystem === 'si' ? 'V' : 'V'})</label>
                    <input type="number" class="form-control" id="voltage" step="any" placeholder="Enter voltage">
                </div>
                <div class="form-group mb-3">
                    <label for="resistance">Resistance (${unitSystem === 'si' ? 'Ω' : 'Ω'})</label>
                    <input type="number" class="form-control" id="resistance" step="any" placeholder="Enter resistance">
                </div>
            `;
            break;
            
        case 'mechanical':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="force">Force (${unitSystem === 'si' ? 'N' : 'lb'})</label>
                    <input type="number" class="form-control" id="force" step="any" placeholder="Enter force">
                </div>
                <div class="form-group mb-3">
                    <label for="velocity">Velocity (${unitSystem === 'si' ? 'm/s' : 'ft/s'})</label>
                    <input type="number" class="form-control" id="velocity" step="any" placeholder="Enter velocity">
                </div>
            `;
            break;
            
        case 'energy':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="energy">Energy (${unitSystem === 'si' ? 'J' : 'BTU'})</label>
                    <input type="number" class="form-control" id="energy" step="any" placeholder="Enter energy">
                </div>
                <div class="form-group mb-3">
                    <label for="time">Time (${unitSystem === 'si' ? 's' : 's'})</label>
                    <input type="number" class="form-control" id="time" step="any" placeholder="Enter time">
                </div>
            `;
            break;
            
        case 'rotational':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="torque">Torque (${unitSystem === 'si' ? 'N⋅m' : 'lb⋅ft'})</label>
                    <input type="number" class="form-control" id="torque" step="any" placeholder="Enter torque">
                </div>
                <div class="form-group mb-3">
                    <label for="angularVelocity">Angular Velocity (${unitSystem === 'si' ? 'rad/s' : 'RPM'})</label>
                    <input type="number" class="form-control" id="angularVelocity" step="any" placeholder="Enter angular velocity">
                </div>
            `;
            break;
            
        case 'efficiency':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="inputPower">Input Power (${unitSystem === 'si' ? 'W' : 'HP'})</label>
                    <input type="number" class="form-control" id="inputPower" step="any" placeholder="Enter input power">
                </div>
                <div class="form-group mb-3">
                    <label for="outputPower">Output Power (${unitSystem === 'si' ? 'W' : 'HP'})</label>
                    <input type="number" class="form-control" id="outputPower" step="any" placeholder="Enter output power">
                </div>
            `;
            break;
    }
    
    inputFieldsDiv.innerHTML = fieldsHTML;
}

function updatePowerUnits() {
    updatePowerCalculatorFields();
}

function saveToHistory() {
    const resultDiv = document.getElementById('powerResult');
    const historyDiv = document.getElementById('calculationHistory');
    const calculationType = document.getElementById('calculationType').value;
    
    if (resultDiv.textContent) {
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = document.createElement('div');
        historyItem.className = 'alert alert-secondary mt-2';
        historyItem.innerHTML = `
            <small>${timestamp} - ${calculationType}</small>
            <hr class="my-1">
            ${resultDiv.textContent}
            <button class="btn btn-sm btn-outline-primary mt-1" onclick="recallCalculation(this)">Recall</button>
        `;
        
        historyDiv.insertBefore(historyItem, historyDiv.firstChild);
        
        // Limit history to last 5 calculations
        if (historyDiv.children.length > 5) {
            historyDiv.removeChild(historyDiv.lastChild);
        }
    }
}

function recallCalculation(button) {
    const historyItem = button.parentElement;
    const resultDiv = document.getElementById('powerResult');
    resultDiv.innerHTML = historyItem.innerHTML;
}

function visualizePower(power) {
    const canvas = document.getElementById('powerVisualization');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw power meter
    const maxPower = 1000; // Adjust based on typical values
    const percentage = Math.min(power / maxPower, 1);
    
    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // Draw power bar
    const gradient = ctx.createLinearGradient(0, 0, width * percentage, 0);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, percentage > 0.8 ? '#f44336' : '#2196F3');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width * percentage, height);
    
    // Draw power value
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${power.toFixed(2)} W`, width / 2, height / 2 + 10);
}

function updatePowerComparison(power) {
    const comparisonDiv = document.getElementById('powerComparison');
    const commonPowers = [
        { name: 'LED Bulb', power: 10 },
        { name: 'Laptop', power: 65 },
        { name: 'Microwave', power: 1000 },
        { name: 'Electric Car', power: 100000 }
    ];
    
    let html = '<div class="power-scale-container">';
    commonPowers.forEach(item => {
        const magnitude = Math.log10(item.power);
        html += `
            <div class="power-scale-item" style="left: ${magnitude * 10}%">
                <div class="power-marker"></div>
                <div class="power-label">${item.name}<br>${item.power}W</div>
            </div>
        `;
    });
    
    // Add current calculation
    const magnitude = Math.log10(power);
    html += `
        <div class="power-scale-item current" style="left: ${magnitude * 10}%">
            <div class="power-marker"></div>
            <div class="power-label">Current<br>${power.toFixed(2)}W</div>
        </div>
    `;
    
    html += '</div>';
    comparisonDiv.innerHTML = html;
}

function calculatePower() {
    const calculationType = document.getElementById('calculationType').value;
    const resultDiv = document.getElementById('powerResult');
    
    try {
        let power = 0;
        let details = '';
        
        switch (calculationType) {
            case 'electrical':
                const voltage = parseFloat(document.getElementById('voltage').value);
                const current = parseFloat(document.getElementById('current').value);
                
                if (isNaN(voltage) || isNaN(current)) {
                    throw new Error('Please enter both voltage and current values');
                }
                
                power = voltage * current;
                details = `P = V × I = ${voltage} V × ${current} A = ${power} W`;
                break;
                
            case 'resistance':
                const i = parseFloat(document.getElementById('current').value);
                const r = parseFloat(document.getElementById('resistance').value);
                
                if (isNaN(i) || isNaN(r)) {
                    throw new Error('Please enter both current and resistance values');
                }
                
                power = i * i * r;
                details = `P = I²R = ${i}² A × ${r} Ω = ${power} W`;
                break;
                
            case 'voltage':
                const v = parseFloat(document.getElementById('voltage').value);
                const res = parseFloat(document.getElementById('resistance').value);
                
                if (isNaN(v) || isNaN(res)) {
                    throw new Error('Please enter both voltage and resistance values');
                }
                
                power = (v * v) / res;
                details = `P = V²/R = ${v}² V / ${res} Ω = ${power} W`;
                break;
                
            case 'mechanical':
                const force = parseFloat(document.getElementById('force').value);
                const velocity = parseFloat(document.getElementById('velocity').value);
                
                if (isNaN(force) || isNaN(velocity)) {
                    throw new Error('Please enter both force and velocity values');
                }
                
                power = force * velocity;
                details = `P = F × v = ${force} N × ${velocity} m/s = ${power} W`;
                break;
                
            case 'energy':
                const energy = parseFloat(document.getElementById('energy').value);
                const time = parseFloat(document.getElementById('time').value);
                
                if (isNaN(energy) || isNaN(time)) {
                    throw new Error('Please enter both energy and time values');
                }
                if (time <= 0) {
                    throw new Error('Time must be greater than 0');
                }
                
                power = energy / time;
                details = `P = E/t = ${energy} J / ${time} s = ${power} W`;
                break;
                
            case 'rotational':
                const torque = parseFloat(document.getElementById('torque').value);
                const angularVelocity = parseFloat(document.getElementById('angularVelocity').value);
                
                if (isNaN(torque) || isNaN(angularVelocity)) {
                    throw new Error('Please enter both torque and angular velocity values');
                }
                
                power = torque * angularVelocity;
                details = `P = T × ω = ${torque} N⋅m × ${angularVelocity} rad/s = ${power} W`;
                break;
                
            case 'efficiency':
                const inputPower = parseFloat(document.getElementById('inputPower').value);
                const outputPower = parseFloat(document.getElementById('outputPower').value);
                
                if (isNaN(inputPower) || isNaN(outputPower)) {
                    throw new Error('Please enter both input and output power values');
                }
                
                const efficiency = (outputPower / inputPower) * 100;
                details = `Efficiency = (P_out / P_in) × 100 = (${outputPower} W / ${inputPower} W) × 100 = ${efficiency.toFixed(2)}%`;
                break;
        }
        
        // Format the result
        resultDiv.innerHTML = `
            <div class="alert alert-info">
                <h5>Power: ${power.toFixed(2)} Watts</h5>
                <hr>
                <p class="mb-0">Calculation: ${details}</p>
            </div>
            <div class="mt-3">
                <h6>Equivalent to:</h6>
                <ul class="list-unstyled">
                    <li>Kilowatts: ${(power / 1000).toFixed(3)} kW</li>
                    <li>Horsepower: ${(power / 745.7).toFixed(3)} hp</li>
                    <li>BTU/hour: ${(power * 3.412142).toFixed(2)} BTU/h</li>
                </ul>
            </div>
        `;
        
        // Visualize power
        visualizePower(power);
        
        // Update power comparison
        updatePowerComparison(power);
        
        // Track calculator usage
        trackCalculatorUse('power');
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}
