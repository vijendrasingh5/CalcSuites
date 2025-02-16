function loadBodyFatCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Body Fat Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Gender</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="bf-gender" id="bf-gender-male" value="male" checked onchange="updateBodyFatInputs()">
                            <label class="form-check-label" for="bf-gender-male">Male</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="bf-gender" id="bf-gender-female" value="female" onchange="updateBodyFatInputs()">
                            <label class="form-check-label" for="bf-gender-female">Female</label>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="bf-age" class="form-label">Age (years)</label>
                    <input type="number" class="form-control" id="bf-age" min="18" max="120">
                </div>
                
                <div class="mb-3">
                    <label for="bf-height" class="form-label">Height</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="bf-height" step="0.01">
                        <select class="form-select" id="bf-height-unit">
                            <option value="cm">cm</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="bf-weight" class="form-label">Weight</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="bf-weight" step="0.1">
                        <select class="form-select" id="bf-weight-unit">
                            <option value="kg">kg</option>
                            <option value="lbs">lbs</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="bf-neck" class="form-label">Neck Circumference</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="bf-neck" step="0.1">
                        <select class="form-select" id="bf-neck-unit">
                            <option value="cm">cm</option>
                            <option value="in">in</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="bf-waist" class="form-label">Waist Circumference</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="bf-waist" step="0.1">
                        <select class="form-select" id="bf-waist-unit">
                            <option value="cm">cm</option>
                            <option value="in">in</option>
                        </select>
                    </div>
                </div>
                
                <div id="hip-measurement" class="mb-3" style="display: none;">
                    <label for="bf-hip" class="form-label">Hip Circumference</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="bf-hip" step="0.1">
                        <select class="form-select" id="bf-hip-unit">
                            <option value="cm">cm</option>
                            <option value="in">in</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateBodyFat()">Calculate Body Fat</button>
            </div>
            
            <div class="col-md-6">
                <div id="bf-result" class="result-box mt-3" style="display: none;">
                    <h4>Your Body Fat Results</h4>
                    <div class="mb-2">
                        <strong>Body Fat Percentage:</strong>
                        <p id="bf-percentage"></p>
                    </div>
                    <div class="mb-2">
                        <strong>Body Fat Category:</strong>
                        <p id="bf-category"></p>
                    </div>
                    <div class="mb-2">
                        <strong>Fat Mass:</strong>
                        <p id="fat-mass"></p>
                    </div>
                    <div class="mb-2">
                        <strong>Lean Mass:</strong>
                        <p id="lean-mass"></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    updateBodyFatInputs();
}

function updateBodyFatInputs() {
    const gender = document.querySelector('input[name="bf-gender"]:checked').value;
    const hipMeasurement = document.getElementById('hip-measurement');
    
    if (gender === 'female') {
        hipMeasurement.style.display = 'block';
    } else {
        hipMeasurement.style.display = 'none';
    }
}

function calculateBodyFat() {
    // Get input values
    const gender = document.querySelector('input[name="bf-gender"]:checked').value;
    const age = parseFloat(document.getElementById('bf-age').value);
    let height = parseFloat(document.getElementById('bf-height').value);
    let weight = parseFloat(document.getElementById('bf-weight').value);
    let neck = parseFloat(document.getElementById('bf-neck').value);
    let waist = parseFloat(document.getElementById('bf-waist').value);
    let hip = gender === 'female' ? parseFloat(document.getElementById('bf-hip').value) : 0;
    
    // Get units
    const heightUnit = document.getElementById('bf-height-unit').value;
    const weightUnit = document.getElementById('bf-weight-unit').value;
    const neckUnit = document.getElementById('bf-neck-unit').value;
    const waistUnit = document.getElementById('bf-waist-unit').value;
    const hipUnit = document.getElementById('bf-hip-unit').value;
    
    // Validate inputs
    if (!validateBodyFatInputs(gender, age, height, weight, neck, waist, hip)) {
        return;
    }
    
    // Convert measurements to cm and kg if necessary
    if (heightUnit === 'ft') height *= 30.48;
    if (weightUnit === 'lbs') weight *= 0.453592;
    if (neckUnit === 'in') neck *= 2.54;
    if (waistUnit === 'in') waist *= 2.54;
    if (hipUnit === 'in') hip *= 2.54;
    
    // Calculate body fat percentage using U.S. Navy method
    let bodyFat;
    if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }
    
    // Calculate fat mass and lean mass
    const fatMass = (weight * bodyFat) / 100;
    const leanMass = weight - fatMass;
    
    // Determine category
    const category = getBodyFatCategory(gender, bodyFat);
    
    // Display results
    document.getElementById('bf-result').style.display = 'block';
    document.getElementById('bf-percentage').textContent = `${formatNumber(bodyFat, 1)}%`;
    document.getElementById('bf-category').textContent = category;
    document.getElementById('fat-mass').textContent = `${formatNumber(fatMass, 1)} kg`;
    document.getElementById('lean-mass').textContent = `${formatNumber(leanMass, 1)} kg`;
}

function validateBodyFatInputs(gender, age, height, weight, neck, waist, hip) {
    if (!age || age < 18 || age > 120) {
        alert('Please enter a valid age between 18 and 120');
        return false;
    }
    
    if (!height || !weight || !neck || !waist || (gender === 'female' && !hip)) {
        alert('Please enter valid values for all measurements');
        return false;
    }
    
    return true;
}

function getBodyFatCategory(gender, bodyFat) {
    if (gender === 'male') {
        if (bodyFat < 6) return 'Essential Fat';
        if (bodyFat < 14) return 'Athletes';
        if (bodyFat < 18) return 'Fitness';
        if (bodyFat < 25) return 'Average';
        return 'Obese';
    } else {
        if (bodyFat < 14) return 'Essential Fat';
        if (bodyFat < 21) return 'Athletes';
        if (bodyFat < 25) return 'Fitness';
        if (bodyFat < 32) return 'Average';
        return 'Obese';
    }
}
