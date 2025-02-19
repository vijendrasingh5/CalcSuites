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
                    </select>
                </div>
                <div id="powerInputFields">
                    <!-- Dynamic input fields will be inserted here -->
                </div>
                <button class="btn btn-primary" onclick="calculatePower()">Calculate</button>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Results</h5>
                        <div id="powerResult"></div>
                    </div>
                </div>
                <div class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">Common Power Values Reference</h5>
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Device/Application</th>
                                    <th>Typical Power</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>LED Light Bulb</td>
                                    <td>5-15 W</td>
                                </tr>
                                <tr>
                                    <td>Laptop Computer</td>
                                    <td>45-100 W</td>
                                </tr>
                                <tr>
                                    <td>Microwave Oven</td>
                                    <td>600-1200 W</td>
                                </tr>
                                <tr>
                                    <td>Electric Car Motor</td>
                                    <td>50-200 kW</td>
                                </tr>
                            </tbody>
                        </table>
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
    
    let fieldsHTML = '';
    switch (calculationType) {
        case 'electrical':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="voltage">Voltage (V)</label>
                    <input type="number" class="form-control" id="voltage" step="any" placeholder="Enter voltage">
                </div>
                <div class="form-group mb-3">
                    <label for="current">Current (A)</label>
                    <input type="number" class="form-control" id="current" step="any" placeholder="Enter current">
                </div>
            `;
            break;
            
        case 'resistance':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="current">Current (A)</label>
                    <input type="number" class="form-control" id="current" step="any" placeholder="Enter current">
                </div>
                <div class="form-group mb-3">
                    <label for="resistance">Resistance (Ω)</label>
                    <input type="number" class="form-control" id="resistance" step="any" placeholder="Enter resistance">
                </div>
            `;
            break;
            
        case 'voltage':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="voltage">Voltage (V)</label>
                    <input type="number" class="form-control" id="voltage" step="any" placeholder="Enter voltage">
                </div>
                <div class="form-group mb-3">
                    <label for="resistance">Resistance (Ω)</label>
                    <input type="number" class="form-control" id="resistance" step="any" placeholder="Enter resistance">
                </div>
            `;
            break;
            
        case 'mechanical':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="force">Force (N)</label>
                    <input type="number" class="form-control" id="force" step="any" placeholder="Enter force">
                </div>
                <div class="form-group mb-3">
                    <label for="velocity">Velocity (m/s)</label>
                    <input type="number" class="form-control" id="velocity" step="any" placeholder="Enter velocity">
                </div>
            `;
            break;
            
        case 'energy':
            fieldsHTML = `
                <div class="form-group mb-3">
                    <label for="energy">Energy (Joules)</label>
                    <input type="number" class="form-control" id="energy" step="any" placeholder="Enter energy">
                </div>
                <div class="form-group mb-3">
                    <label for="time">Time (seconds)</label>
                    <input type="number" class="form-control" id="time" step="any" placeholder="Enter time">
                </div>
            `;
            break;
    }
    
    inputFieldsDiv.innerHTML = fieldsHTML;
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
        
        // Track calculator usage
        trackCalculatorUse('power');
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}
