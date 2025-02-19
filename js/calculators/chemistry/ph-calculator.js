function createPHCalculator() {
    const calculator = document.createElement('div');
    calculator.className = 'calculator-content';
    calculator.innerHTML = `
        <h2>pH Calculator</h2>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group mb-3">
                    <label for="calculationType">Calculation Type</label>
                    <select class="form-control" id="calculationType" onchange="updatePHCalculatorFields()">
                        <option value="ph">Calculate pH from [H+]</option>
                        <option value="poh">Calculate pOH from [OH-]</option>
                        <option value="h">Calculate [H+] from pH</option>
                        <option value="oh">Calculate [OH-] from pOH</option>
                    </select>
                </div>
                <div class="form-group mb-3" id="inputGroup">
                    <label for="inputValue">Concentration (mol/L)</label>
                    <input type="number" class="form-control" id="inputValue" step="any" placeholder="Enter concentration">
                </div>
                <button class="btn btn-primary" onclick="calculatePH()">Calculate</button>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Results</h5>
                        <div id="phResult"></div>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="progress" style="height: 30px;">
                        <div id="phScale" class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="7" aria-valuemin="0" aria-valuemax="14">pH 7</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">pH Scale Reference</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>pH Range</th>
                                        <th>Classification</th>
                                        <th>Examples</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>0-2</td>
                                        <td>Strong Acid</td>
                                        <td>Battery acid, stomach acid</td>
                                    </tr>
                                    <tr>
                                        <td>3-6</td>
                                        <td>Weak Acid</td>
                                        <td>Citrus fruits, vinegar</td>
                                    </tr>
                                    <tr>
                                        <td>7</td>
                                        <td>Neutral</td>
                                        <td>Pure water</td>
                                    </tr>
                                    <tr>
                                        <td>8-11</td>
                                        <td>Weak Base</td>
                                        <td>Baking soda, soap</td>
                                    </tr>
                                    <tr>
                                        <td>12-14</td>
                                        <td>Strong Base</td>
                                        <td>Bleach, drain cleaner</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return calculator;
}

function loadPHCalculator() {
    const calculatorContainer = document.getElementById('calculator-container');
    if (calculatorContainer) {
        calculatorContainer.innerHTML = '';
        calculatorContainer.appendChild(createPHCalculator());
    }
}

function updatePHCalculatorFields() {
    const calculationType = document.getElementById('calculationType').value;
    const inputLabel = document.querySelector('label[for="inputValue"]');
    const inputField = document.getElementById('inputValue');
    
    switch (calculationType) {
        case 'ph':
            inputLabel.textContent = 'H+ Concentration (mol/L)';
            inputField.placeholder = 'Enter [H+] concentration';
            break;
        case 'poh':
            inputLabel.textContent = 'OH- Concentration (mol/L)';
            inputField.placeholder = 'Enter [OH-] concentration';
            break;
        case 'h':
            inputLabel.textContent = 'pH Value';
            inputField.placeholder = 'Enter pH (0-14)';
            break;
        case 'oh':
            inputLabel.textContent = 'pOH Value';
            inputField.placeholder = 'Enter pOH (0-14)';
            break;
    }
}

function calculatePH() {
    const calculationType = document.getElementById('calculationType').value;
    const inputValue = parseFloat(document.getElementById('inputValue').value);
    const resultDiv = document.getElementById('phResult');
    const phScale = document.getElementById('phScale');
    
    if (isNaN(inputValue)) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please enter a valid number</div>';
        return;
    }
    
    try {
        let ph, poh, hConc, ohConc;
        
        switch (calculationType) {
            case 'ph':
                if (inputValue <= 0) {
                    throw new Error('Concentration must be greater than 0');
                }
                hConc = inputValue;
                ph = -Math.log10(hConc);
                poh = 14 - ph;
                ohConc = Math.pow(10, -poh);
                break;
                
            case 'poh':
                if (inputValue <= 0) {
                    throw new Error('Concentration must be greater than 0');
                }
                ohConc = inputValue;
                poh = -Math.log10(ohConc);
                ph = 14 - poh;
                hConc = Math.pow(10, -ph);
                break;
                
            case 'h':
                if (inputValue < 0 || inputValue > 14) {
                    throw new Error('pH must be between 0 and 14');
                }
                ph = inputValue;
                poh = 14 - ph;
                hConc = Math.pow(10, -ph);
                ohConc = Math.pow(10, -poh);
                break;
                
            case 'oh':
                if (inputValue < 0 || inputValue > 14) {
                    throw new Error('pOH must be between 0 and 14');
                }
                poh = inputValue;
                ph = 14 - poh;
                hConc = Math.pow(10, -ph);
                ohConc = Math.pow(10, -poh);
                break;
        }
        
        // Update results
        resultDiv.innerHTML = `
            <table class="table table-bordered">
                <tr>
                    <td><strong>pH:</strong></td>
                    <td>${ph.toFixed(2)}</td>
                </tr>
                <tr>
                    <td><strong>pOH:</strong></td>
                    <td>${poh.toFixed(2)}</td>
                </tr>
                <tr>
                    <td><strong>[H+]:</strong></td>
                    <td>${hConc.toExponential(2)} mol/L</td>
                </tr>
                <tr>
                    <td><strong>[OH-]:</strong></td>
                    <td>${ohConc.toExponential(2)} mol/L</td>
                </tr>
                <tr>
                    <td><strong>Solution Type:</strong></td>
                    <td>${getSolutionType(ph)}</td>
                </tr>
            </table>
        `;
        
        // Update pH scale visualization
        const percentage = (ph / 14) * 100;
        phScale.style.width = `${percentage}%`;
        phScale.textContent = `pH ${ph.toFixed(2)}`;
        
        // Update color based on pH
        if (ph < 7) {
            phScale.className = 'progress-bar bg-danger';
        } else if (ph > 7) {
            phScale.className = 'progress-bar bg-primary';
        } else {
            phScale.className = 'progress-bar bg-success';
        }
        
        // Track calculator usage
        trackCalculatorUse('ph');
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}

function getSolutionType(ph) {
    if (ph < 3) return 'Strong Acid';
    if (ph < 7) return 'Weak Acid';
    if (ph === 7) return 'Neutral';
    if (ph < 11) return 'Weak Base';
    return 'Strong Base';
}
