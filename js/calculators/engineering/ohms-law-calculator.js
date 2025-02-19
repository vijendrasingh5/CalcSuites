// Ohm's Law Calculator
function createOhmsLawCalculator() {
    const calculator = document.createElement('div');
    calculator.className = 'calculator-content';
    calculator.innerHTML = `
        <h2>Ohm's Law Calculator</h2>
        <div class="form-group mb-3">
            <label for="voltage">Voltage (V)</label>
            <input type="number" class="form-control" id="voltage" placeholder="Enter voltage">
        </div>
        <div class="form-group mb-3">
            <label for="current">Current (A)</label>
            <input type="number" class="form-control" id="current" placeholder="Enter current">
        </div>
        <div class="form-group mb-3">
            <label for="resistance">Resistance (Ω)</label>
            <input type="number" class="form-control" id="resistance" placeholder="Enter resistance">
        </div>
        <button class="btn btn-primary" onclick="calculateOhmsLaw()">Calculate</button>
        <div id="ohmsLawResult" class="mt-3"></div>
    `;
    return calculator;
}

function calculateOhmsLaw() {
    const voltage = parseFloat(document.getElementById('voltage').value);
    const current = parseFloat(document.getElementById('current').value);
    const resistance = parseFloat(document.getElementById('resistance').value);
    const resultDiv = document.getElementById('ohmsLawResult');

    let result = '';
    if (isNaN(voltage) && !isNaN(current) && !isNaN(resistance)) {
        // Calculate voltage
        const calculatedVoltage = current * resistance;
        result = `Voltage (V) = ${calculatedVoltage.toFixed(2)} V`;
    } else if (isNaN(current) && !isNaN(voltage) && !isNaN(resistance)) {
        // Calculate current
        const calculatedCurrent = voltage / resistance;
        result = `Current (A) = ${calculatedCurrent.toFixed(2)} A`;
    } else if (isNaN(resistance) && !isNaN(voltage) && !isNaN(current)) {
        // Calculate resistance
        const calculatedResistance = voltage / current;
        result = `Resistance (Ω) = ${calculatedResistance.toFixed(2)} Ω`;
    } else {
        result = 'Please enter exactly two values to calculate the third';
    }

    resultDiv.innerHTML = `<div class="alert alert-info">${result}</div>`;
    
    // Track calculator usage
    trackCalculatorUse('ohms-law');
}
