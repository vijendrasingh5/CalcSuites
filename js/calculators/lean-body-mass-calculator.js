function loadLeanBodyMassCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Lean Body Mass Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Gender</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="lbm-gender" id="lbm-gender-male" value="male" checked>
                            <label class="form-check-label" for="lbm-gender-male">Male</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="lbm-gender" id="lbm-gender-female" value="female">
                            <label class="form-check-label" for="lbm-gender-female">Female</label>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="lbm-height" class="form-label">Height</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="lbm-height" step="0.1">
                        <select class="form-select" id="lbm-height-unit">
                            <option value="cm">cm</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="lbm-weight" class="form-label">Weight</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="lbm-weight" step="0.1">
                        <select class="form-select" id="lbm-weight-unit">
                            <option value="kg">kg</option>
                            <option value="lbs">lbs</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="lbm-formula" class="form-label">Formula</label>
                    <select class="form-select" id="lbm-formula">
                        <option value="boer">Boer Formula</option>
                        <option value="james">James Formula</option>
                        <option value="hume">Hume Formula</option>
                    </select>
                </div>
                
                <button class="btn btn-primary" onclick="calculateLeanBodyMass()">Calculate Lean Body Mass</button>
            </div>
            
            <div class="col-md-6">
                <div id="lbm-result" class="result-box mt-3" style="display: none;">
                    <h4>Lean Body Mass Results</h4>
                    <div class="mb-3">
                        <strong>Lean Body Mass:</strong>
                        <p id="lbm-mass" class="h3 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <strong>Body Composition Breakdown:</strong>
                        <div class="progress mt-2" style="height: 25px;">
                            <div id="lbm-progress" class="progress-bar" role="progressbar"></div>
                        </div>
                        <div id="lbm-breakdown" class="mt-2"></div>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Results by Formula</h5>
                        <ul class="list-unstyled" id="lbm-formulas"></ul>
                    </div>
                    
                    <div class="alert alert-info">
                        <h5>About the Formulas:</h5>
                        <ul class="mb-0">
                            <li><strong>Boer Formula:</strong> Most accurate for normal BMI range</li>
                            <li><strong>James Formula:</strong> Good for athletic individuals</li>
                            <li><strong>Hume Formula:</strong> Works well across different body types</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function calculateLeanBodyMass() {
    const gender = document.querySelector('input[name="lbm-gender"]:checked').value;
    const formula = document.getElementById('lbm-formula').value;
    let height = parseFloat(document.getElementById('lbm-height').value);
    let weight = parseFloat(document.getElementById('lbm-weight').value);
    
    // Get units
    const heightUnit = document.getElementById('lbm-height-unit').value;
    const weightUnit = document.getElementById('lbm-weight-unit').value;
    
    // Validate inputs
    if (!height || !weight) {
        alert('Please enter valid values for height and weight');
        return;
    }
    
    // Convert measurements to cm and kg if needed
    if (heightUnit === 'ft') height = height * 30.48;
    if (weightUnit === 'lbs') weight = weight * 0.453592;
    
    // Calculate LBM using different formulas
    const results = {
        boer: calculateBoerLBM(gender, height, weight),
        james: calculateJamesLBM(gender, height, weight),
        hume: calculateHumeLBM(gender, height, weight)
    };
    
    // Get the selected formula result
    const lbm = results[formula];
    const fatMass = weight - lbm;
    const bodyFatPercentage = (fatMass / weight) * 100;
    
    // Display results
    document.getElementById('lbm-result').style.display = 'block';
    
    // Show main result
    const lbmLbs = lbm * 2.20462;
    document.getElementById('lbm-mass').innerHTML = 
        `${formatNumber(lbm, 1)} kg<br>(${formatNumber(lbmLbs, 1)} lbs)`;
    
    // Update progress bar
    const lbmPercentage = ((weight - fatMass) / weight) * 100;
    const progressBar = document.getElementById('lbm-progress');
    progressBar.style.width = `${lbmPercentage}%`;
    progressBar.textContent = `${formatNumber(lbmPercentage, 1)}% Lean Mass`;
    
    // Show breakdown
    document.getElementById('lbm-breakdown').innerHTML = `
        <div class="row mt-2">
            <div class="col-6">Lean Mass: ${formatNumber(lbm, 1)} kg</div>
            <div class="col-6">Fat Mass: ${formatNumber(fatMass, 1)} kg</div>
        </div>
        <div class="row">
            <div class="col-6">${formatNumber(lbmPercentage, 1)}% of total</div>
            <div class="col-6">${formatNumber(bodyFatPercentage, 1)}% of total</div>
        </div>
    `;
    
    // Show results from all formulas
    const formulasHTML = Object.entries(results).map(([name, value]) => `
        <li class="mb-2 ${name === formula ? 'fw-bold' : ''}">
            <strong>${name.charAt(0).toUpperCase() + name.slice(1)} Formula:</strong>
            ${formatNumber(value, 1)} kg (${formatNumber(value * 2.20462, 1)} lbs)
        </li>
    `).join('');
    
    document.getElementById('lbm-formulas').innerHTML = formulasHTML;
}

function calculateBoerLBM(gender, height, weight) {
    if (gender === 'male') {
        return (0.407 * weight) + (0.267 * height) - 19.2;
    } else {
        return (0.252 * weight) + (0.473 * height) - 48.3;
    }
}

function calculateJamesLBM(gender, height, weight) {
    if (gender === 'male') {
        return (1.1 * weight) - (128 * Math.pow(weight/height, 2));
    } else {
        return (1.07 * weight) - (148 * Math.pow(weight/height, 2));
    }
}

function calculateHumeLBM(gender, height, weight) {
    if (gender === 'male') {
        return (0.3281 * weight) + (0.33929 * height) - 29.5336;
    } else {
        return (0.29569 * weight) + (0.41813 * height) - 43.2933;
    }
}
