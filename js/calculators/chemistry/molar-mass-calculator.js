// Periodic Table Data (common elements)
const periodicTable = {
    'H': { mass: 1.008, name: 'Hydrogen' },
    'He': { mass: 4.003, name: 'Helium' },
    'Li': { mass: 6.941, name: 'Lithium' },
    'Be': { mass: 9.012, name: 'Beryllium' },
    'B': { mass: 10.811, name: 'Boron' },
    'C': { mass: 12.011, name: 'Carbon' },
    'N': { mass: 14.007, name: 'Nitrogen' },
    'O': { mass: 15.999, name: 'Oxygen' },
    'F': { mass: 18.998, name: 'Fluorine' },
    'Ne': { mass: 20.180, name: 'Neon' },
    'Na': { mass: 22.990, name: 'Sodium' },
    'Mg': { mass: 24.305, name: 'Magnesium' },
    'Al': { mass: 26.982, name: 'Aluminum' },
    'Si': { mass: 28.086, name: 'Silicon' },
    'P': { mass: 30.974, name: 'Phosphorus' },
    'S': { mass: 32.065, name: 'Sulfur' },
    'Cl': { mass: 35.453, name: 'Chlorine' },
    'K': { mass: 39.098, name: 'Potassium' },
    'Ca': { mass: 40.078, name: 'Calcium' },
    'Fe': { mass: 55.845, name: 'Iron' }
};

function createMolarMassCalculator() {
    const calculator = document.createElement('div');
    calculator.className = 'calculator-content';
    calculator.innerHTML = `
        <h2>Molar Mass Calculator</h2>
        <div class="form-group mb-3">
            <label for="formula">Chemical Formula</label>
            <input type="text" class="form-control" id="formula" placeholder="Enter chemical formula (e.g., H2O, NaCl)">
            <small class="form-text text-muted">Use capital letters for elements (e.g., Na for sodium). Numbers go after the element symbol.</small>
        </div>
        <button class="btn btn-primary" onclick="calculateMolarMass()">Calculate</button>
        <div id="molarMassResult" class="mt-3"></div>
        <div class="mt-4">
            <h4>Common Elements</h4>
            <div class="row">
                ${Object.entries(periodicTable).map(([symbol, data]) => `
                    <div class="col-md-3 col-sm-4 mb-2">
                        <button class="btn btn-outline-secondary btn-sm w-100" 
                                onclick="insertElement('${symbol}')"
                                title="${data.name}: ${data.mass} g/mol">
                            ${symbol}
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    return calculator;
}

function loadMolarMassCalculator() {
    const calculatorContainer = document.getElementById('calculator-container');
    if (calculatorContainer) {
        calculatorContainer.innerHTML = '';
        calculatorContainer.appendChild(createMolarMassCalculator());
    }
}

function insertElement(symbol) {
    const formulaInput = document.getElementById('formula');
    formulaInput.value += symbol;
    formulaInput.focus();
}

function calculateMolarMass() {
    const formula = document.getElementById('formula').value.trim();
    const resultDiv = document.getElementById('molarMassResult');
    
    if (!formula) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please enter a chemical formula</div>';
        return;
    }
    
    try {
        let totalMass = 0;
        let currentElement = '';
        let currentNumber = '';
        let breakdown = [];
        
        // Parse the formula
        for (let i = 0; i < formula.length; i++) {
            const char = formula[i];
            
            if (char >= 'A' && char <= 'Z') {
                // Process previous element if exists
                if (currentElement) {
                    const number = currentNumber || '1';
                    const mass = calculateElementMass(currentElement, parseInt(number));
                    totalMass += mass;
                    breakdown.push(`${currentElement}${number}: ${mass.toFixed(3)} g/mol`);
                }
                currentElement = char;
                currentNumber = '';
            }
            else if (char >= 'a' && char <= 'z') {
                currentElement += char;
            }
            else if (char >= '0' && char <= '9') {
                currentNumber += char;
            }
            else {
                throw new Error(`Invalid character in formula: ${char}`);
            }
        }
        
        // Process last element
        if (currentElement) {
            const number = currentNumber || '1';
            const mass = calculateElementMass(currentElement, parseInt(number));
            totalMass += mass;
            breakdown.push(`${currentElement}${number}: ${mass.toFixed(3)} g/mol`);
        }
        
        resultDiv.innerHTML = `
            <div class="alert alert-info">
                <h5>Total Molar Mass: ${totalMass.toFixed(3)} g/mol</h5>
                <hr>
                <h6>Breakdown:</h6>
                <ul class="mb-0">
                    ${breakdown.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
        
        // Track calculator usage
        trackCalculatorUse('molar-mass');
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}

function calculateElementMass(element, count) {
    if (!periodicTable[element]) {
        throw new Error(`Unknown element: ${element}`);
    }
    return periodicTable[element].mass * count;
}
