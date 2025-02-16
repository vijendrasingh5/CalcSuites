function loadArmyBodyFatCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Army Body Fat Calculator (U.S. DoD Method)');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Gender</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="abf-gender" id="abf-gender-male" value="male" checked onchange="updateArmyBodyFatInputs()">
                            <label class="form-check-label" for="abf-gender-male">Male</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="abf-gender" id="abf-gender-female" value="female" onchange="updateArmyBodyFatInputs()">
                            <label class="form-check-label" for="abf-gender-female">Female</label>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="abf-age" class="form-label">Age</label>
                    <input type="number" class="form-control" id="abf-age" min="17" max="65">
                </div>
                
                <div class="mb-3">
                    <label for="abf-height" class="form-label">Height</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="abf-height" step="0.5">
                        <select class="form-select" id="abf-height-unit">
                            <option value="in">inches</option>
                            <option value="cm">cm</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="abf-neck" class="form-label">Neck Circumference</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="abf-neck" step="0.5">
                        <select class="form-select" id="abf-neck-unit">
                            <option value="in">inches</option>
                            <option value="cm">cm</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="abf-waist" class="form-label">Waist Circumference</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="abf-waist" step="0.5">
                        <select class="form-select" id="abf-waist-unit">
                            <option value="in">inches</option>
                            <option value="cm">cm</option>
                        </select>
                    </div>
                </div>
                
                <div id="abf-hip-section" class="mb-3" style="display: none;">
                    <label for="abf-hip" class="form-label">Hip Circumference</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="abf-hip" step="0.5">
                        <select class="form-select" id="abf-hip-unit">
                            <option value="in">inches</option>
                            <option value="cm">cm</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateArmyBodyFat()">Calculate Body Fat</button>
            </div>
            
            <div class="col-md-6">
                <div id="abf-result" class="result-box mt-3" style="display: none;">
                    <h4>Army Body Fat Results</h4>
                    <div class="mb-3">
                        <strong>Body Fat Percentage:</strong>
                        <p id="abf-percentage" class="h3 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <strong>Status:</strong>
                        <p id="abf-status"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Army Body Fat Standards</h5>
                        <div id="abf-standards"></div>
                    </div>
                    
                    <div class="alert alert-info">
                        <h5>Notes:</h5>
                        <ul class="mb-0">
                            <li>This calculator uses the U.S. Department of Defense body fat calculation method</li>
                            <li>All measurements should be taken in the morning after using the bathroom</li>
                            <li>Measurements should be taken while standing straight with abdomen relaxed</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    updateArmyBodyFatInputs();
}

function updateArmyBodyFatInputs() {
    const gender = document.querySelector('input[name="abf-gender"]:checked').value;
    const hipSection = document.getElementById('abf-hip-section');
    
    if (gender === 'female') {
        hipSection.style.display = 'block';
    } else {
        hipSection.style.display = 'none';
    }
}

const armyStandards = {
    male: {
        '17-20': 20,
        '21-27': 22,
        '28-39': 24,
        '40+': 26
    },
    female: {
        '17-20': 30,
        '21-27': 32,
        '28-39': 34,
        '40+': 36
    }
};

function calculateArmyBodyFat() {
    const gender = document.querySelector('input[name="abf-gender"]:checked').value;
    const age = parseInt(document.getElementById('abf-age').value);
    let height = parseFloat(document.getElementById('abf-height').value);
    let neck = parseFloat(document.getElementById('abf-neck').value);
    let waist = parseFloat(document.getElementById('abf-waist').value);
    let hip = gender === 'female' ? parseFloat(document.getElementById('abf-hip').value) : 0;
    
    // Get units
    const heightUnit = document.getElementById('abf-height-unit').value;
    const neckUnit = document.getElementById('abf-neck-unit').value;
    const waistUnit = document.getElementById('abf-waist-unit').value;
    const hipUnit = document.getElementById('abf-hip-unit').value;
    
    // Validate inputs
    if (!validateArmyBodyFatInputs(gender, age, height, neck, waist, hip)) {
        return;
    }
    
    // Convert all measurements to inches if needed
    if (heightUnit === 'cm') height = height / 2.54;
    if (neckUnit === 'cm') neck = neck / 2.54;
    if (waistUnit === 'cm') waist = waist / 2.54;
    if (hipUnit === 'cm') hip = hip / 2.54;
    
    // Calculate body fat percentage using DoD formula
    let bodyFat;
    if (gender === 'male') {
        bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    } else {
        bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
    }
    
    // Round to nearest tenth
    bodyFat = Math.round(bodyFat * 10) / 10;
    
    // Determine standard for age group
    let standard;
    if (age <= 20) standard = armyStandards[gender]['17-20'];
    else if (age <= 27) standard = armyStandards[gender]['21-27'];
    else if (age <= 39) standard = armyStandards[gender]['28-39'];
    else standard = armyStandards[gender]['40+'];
    
    // Determine status
    let status;
    if (bodyFat <= standard) {
        status = '<span class="text-success">Within Standards</span>';
    } else {
        status = '<span class="text-danger">Exceeds Standards</span>';
    }
    
    // Display results
    document.getElementById('abf-result').style.display = 'block';
    document.getElementById('abf-percentage').textContent = `${bodyFat}%`;
    document.getElementById('abf-status').innerHTML = status;
    
    // Display standards table
    let standardsHTML = `
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Age Group</th>
                    <th>Maximum Allowed</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (const [ageGroup, maxBF] of Object.entries(armyStandards[gender])) {
        standardsHTML += `
            <tr ${ageGroup === getAgeGroup(age) ? 'class="table-primary"' : ''}>
                <td>${ageGroup}</td>
                <td>${maxBF}%</td>
            </tr>
        `;
    }
    
    standardsHTML += '</tbody></table>';
    document.getElementById('abf-standards').innerHTML = standardsHTML;
}

function validateArmyBodyFatInputs(gender, age, height, neck, waist, hip) {
    if (!age || age < 17 || age > 65) {
        alert('Please enter a valid age between 17 and 65');
        return false;
    }
    
    if (!height || !neck || !waist || (gender === 'female' && !hip)) {
        alert('Please enter valid measurements for all required fields');
        return false;
    }
    
    return true;
}

function getAgeGroup(age) {
    if (age <= 20) return '17-20';
    if (age <= 27) return '21-27';
    if (age <= 39) return '28-39';
    return '40+';
}
