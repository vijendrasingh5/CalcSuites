function loadExponentCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Exponent Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Power Calculator -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Power Calculator</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-5">
                                <label class="form-label">Base (x)</label>
                                <input type="number" class="form-control" id="power-base" step="any">
                            </div>
                            <div class="col-md-5">
                                <label class="form-label">Exponent (n)</label>
                                <input type="number" class="form-control" id="power-exponent" step="any">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">&nbsp;</label>
                                <button class="btn btn-primary w-100" onclick="calculatePower()">Calculate</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="power-result" style="display: none;">
                                    Result: <span class="result-value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Root Calculator -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Root Calculator</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-5">
                                <label class="form-label">Number (x)</label>
                                <input type="number" class="form-control" id="root-number" step="any">
                            </div>
                            <div class="col-md-5">
                                <label class="form-label">Root (n)</label>
                                <input type="number" class="form-control" id="root-value" step="any" value="2">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">&nbsp;</label>
                                <button class="btn btn-primary w-100" onclick="calculateRoot()">Calculate</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="root-result" style="display: none;">
                                    Result: <span class="result-value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Scientific Notation -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Scientific Notation Converter</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-10">
                                <label class="form-label">Number</label>
                                <input type="text" class="form-control" id="scientific-number" placeholder="Enter a number or scientific notation (e.g., 1.23e+4)">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">&nbsp;</label>
                                <button class="btn btn-primary w-100" onclick="convertScientificNotation()">Convert</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="scientific-result" style="display: none;">
                                    <div class="mb-2">Standard Form: <span class="standard-form">-</span></div>
                                    <div>Scientific Notation: <span class="scientific-form">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Tools and Info -->
            <div class="col-md-4">
                <!-- Common Powers -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Quick Powers</h5>
                    </div>
                    <div class="card-body">
                        <div class="input-group mb-3">
                            <input type="number" class="form-control" id="quick-power-number" placeholder="Enter number">
                            <button class="btn btn-outline-secondary" onclick="calculateQuickPower(2)">x²</button>
                            <button class="btn btn-outline-secondary" onclick="calculateQuickPower(3)">x³</button>
                        </div>
                        <div class="input-group">
                            <input type="number" class="form-control" id="quick-root-number" placeholder="Enter number">
                            <button class="btn btn-outline-secondary" onclick="calculateQuickRoot(2)">√x</button>
                            <button class="btn btn-outline-secondary" onclick="calculateQuickRoot(3)">∛x</button>
                        </div>
                    </div>
                </div>

                <!-- Formulas and Info -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Formulas & Info</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <h6>Power Rule</h6>
                            <p class="text-muted small">
                                x<sup>n</sup> × x<sup>m</sup> = x<sup>n+m</sup><br>
                                x<sup>n</sup> ÷ x<sup>m</sup> = x<sup>n-m</sup><br>
                                (x<sup>n</sup>)<sup>m</sup> = x<sup>n×m</sup>
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Root Properties</h6>
                            <p class="text-muted small">
                                ⁿ√x = x<sup>1/n</sup><br>
                                ⁿ√(x × y) = ⁿ√x × ⁿ√y<br>
                                ⁿ√(x<sup>m</sup>) = (ⁿ√x)<sup>m</sup>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);
}

function calculatePower() {
    const base = parseFloat(document.getElementById('power-base').value);
    const exponent = parseFloat(document.getElementById('power-exponent').value);
    
    if (isNaN(base) || isNaN(exponent)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const result = Math.pow(base, exponent);
    const resultContainer = document.getElementById('power-result');
    resultContainer.style.display = 'block';
    
    if (isFinite(result)) {
        resultContainer.querySelector('.result-value').textContent = 
            `${base}^${exponent} = ${formatNumber(result)}`;
    } else {
        resultContainer.querySelector('.result-value').textContent = 
            'Result is too large to display';
    }
}

function calculateRoot() {
    const number = parseFloat(document.getElementById('root-number').value);
    const root = parseFloat(document.getElementById('root-value').value);
    
    if (isNaN(number) || isNaN(root)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (root === 0) {
        alert('Root cannot be zero');
        return;
    }
    
    if (number < 0 && root % 2 === 0) {
        alert('Even roots of negative numbers are not real');
        return;
    }
    
    const result = Math.pow(Math.abs(number), 1/root) * (number < 0 ? -1 : 1);
    const resultContainer = document.getElementById('root-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.result-value').textContent = 
        `${root}√${number} = ${formatNumber(result)}`;
}

function convertScientificNotation() {
    const input = document.getElementById('scientific-number').value.trim();
    
    if (!input) {
        alert('Please enter a number');
        return;
    }
    
    let number;
    try {
        number = parseFloat(input);
        if (isNaN(number)) throw new Error('Invalid number');
    } catch (e) {
        alert('Please enter a valid number');
        return;
    }
    
    const resultContainer = document.getElementById('scientific-result');
    resultContainer.style.display = 'block';
    
    // Format in standard form
    resultContainer.querySelector('.standard-form').textContent = 
        number.toLocaleString();
    
    // Format in scientific notation
    const scientificStr = number.toExponential(5);
    resultContainer.querySelector('.scientific-form').textContent = scientificStr;
}

function calculateQuickPower(power) {
    const number = parseFloat(document.getElementById('quick-power-number').value);
    
    if (isNaN(number)) {
        alert('Please enter a valid number');
        return;
    }
    
    const result = Math.pow(number, power);
    alert(`${number}^${power} = ${formatNumber(result)}`);
}

function calculateQuickRoot(root) {
    const number = parseFloat(document.getElementById('quick-root-number').value);
    
    if (isNaN(number)) {
        alert('Please enter a valid number');
        return;
    }
    
    if (number < 0 && root % 2 === 0) {
        alert('Even roots of negative numbers are not real');
        return;
    }
    
    const result = Math.pow(Math.abs(number), 1/root) * (number < 0 ? -1 : 1);
    alert(`${root}√${number} = ${formatNumber(result)}`);
}

function formatNumber(num) {
    if (Math.abs(num) < 0.000001 || Math.abs(num) > 999999) {
        return num.toExponential(5);
    }
    return Number(num.toFixed(6)).toString();
}
