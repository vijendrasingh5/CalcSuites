function loadPercentageCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Percentage Calculator');
    
    const calculatorHTML = `
        <div class="percentage-calculator">
            <div class="calculation-section mb-4">
                <h5>Calculate Percentage</h5>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label for="value" class="form-label">Value</label>
                        <input type="number" class="form-control" id="value" step="any">
                    </div>
                    <div class="col-md-4">
                        <label for="percentage" class="form-label">Percentage</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="percentage" step="any">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label for="result" class="form-label">Result</label>
                        <input type="text" class="form-control" id="result" readonly>
                    </div>
                </div>
                <button class="btn btn-primary mt-3" onclick="calculatePercentage()">Calculate</button>
            </div>

            <div class="calculation-section mb-4">
                <h5>Calculate Percentage Change</h5>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label for="old-value" class="form-label">Original Value</label>
                        <input type="number" class="form-control" id="old-value" step="any">
                    </div>
                    <div class="col-md-4">
                        <label for="new-value" class="form-label">New Value</label>
                        <input type="number" class="form-control" id="new-value" step="any">
                    </div>
                    <div class="col-md-4">
                        <label for="change-result" class="form-label">Percentage Change</label>
                        <input type="text" class="form-control" id="change-result" readonly>
                    </div>
                </div>
                <button class="btn btn-primary mt-3" onclick="calculatePercentageChange()">Calculate Change</button>
            </div>

            <div class="calculation-section">
                <h5>Calculate Value from Percentage</h5>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label for="total" class="form-label">Total Value</label>
                        <input type="number" class="form-control" id="total" step="any">
                    </div>
                    <div class="col-md-4">
                        <label for="percent" class="form-label">Percentage</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="percent" step="any">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label for="value-result" class="form-label">Result</label>
                        <input type="text" class="form-control" id="value-result" readonly>
                    </div>
                </div>
                <button class="btn btn-primary mt-3" onclick="calculateValueFromPercentage()">Calculate Value</button>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function calculatePercentage() {
    const value = parseFloat(document.getElementById('value').value);
    const percentage = parseFloat(document.getElementById('percentage').value);
    
    if (!validateNumber(value) || !validateNumber(percentage)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const result = (value * percentage) / 100;
    document.getElementById('result').value = formatNumber(result);
}

function calculatePercentageChange() {
    const oldValue = parseFloat(document.getElementById('old-value').value);
    const newValue = parseFloat(document.getElementById('new-value').value);
    
    if (!validateNumber(oldValue) || !validateNumber(newValue)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const change = ((newValue - oldValue) / oldValue) * 100;
    document.getElementById('change-result').value = formatNumber(change) + '%';
}

function calculateValueFromPercentage() {
    const total = parseFloat(document.getElementById('total').value);
    const percent = parseFloat(document.getElementById('percent').value);
    
    if (!validateNumber(total) || !validateNumber(percent)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const result = (total * percent) / 100;
    document.getElementById('value-result').value = formatNumber(result);
}
