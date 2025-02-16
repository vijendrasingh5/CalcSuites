function loadBMRCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('BMR Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Gender</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender" id="gender-male" value="male" checked>
                            <label class="form-check-label" for="gender-male">Male</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender" id="gender-female" value="female">
                            <label class="form-check-label" for="gender-female">Female</label>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="bmr-age" class="form-label">Age (years)</label>
                    <input type="number" class="form-control" id="bmr-age" min="1" max="120">
                </div>
                
                <div class="mb-3">
                    <label for="bmr-height" class="form-label">Height</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="bmr-height" step="0.01">
                        <select class="form-select" id="bmr-height-unit">
                            <option value="cm">cm</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="bmr-weight" class="form-label">Weight</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="bmr-weight" step="0.1">
                        <select class="form-select" id="bmr-weight-unit">
                            <option value="kg">kg</option>
                            <option value="lbs">lbs</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="activity-level" class="form-label">Activity Level</label>
                    <select class="form-select" id="activity-level">
                        <option value="1.2">Sedentary (little or no exercise)</option>
                        <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
                        <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
                        <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
                        <option value="1.9">Extra active (very hard exercise & physical job)</option>
                    </select>
                </div>
                
                <button class="btn btn-primary" onclick="calculateBMR()">Calculate BMR</button>
            </div>
            
            <div class="col-md-6">
                <div id="bmr-result" class="result-box mt-3" style="display: none;">
                    <h4>Your BMR Results</h4>
                    <div class="mb-2">
                        <strong>Basal Metabolic Rate (BMR):</strong>
                        <p id="bmr-value"></p>
                    </div>
                    <div class="mb-2">
                        <strong>Total Daily Energy Expenditure (TDEE):</strong>
                        <p id="tdee-value"></p>
                    </div>
                    <div class="mt-3">
                        <h5>Daily Calorie Needs Based on Goals:</h5>
                        <ul class="list-unstyled">
                            <li id="maintain-calories"></li>
                            <li id="lose-calories"></li>
                            <li id="gain-calories"></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function calculateBMR() {
    // Get input values
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const age = parseFloat(document.getElementById('bmr-age').value);
    const heightUnit = document.getElementById('bmr-height-unit').value;
    const weightUnit = document.getElementById('bmr-weight-unit').value;
    let height = parseFloat(document.getElementById('bmr-height').value);
    let weight = parseFloat(document.getElementById('bmr-weight').value);
    const activityLevel = parseFloat(document.getElementById('activity-level').value);
    
    // Validate inputs
    if (!age || !height || !weight || age < 1 || age > 120) {
        alert('Please enter valid values for all fields');
        return;
    }
    
    // Convert measurements to cm and kg if necessary
    if (heightUnit === 'ft') {
        height = height * 30.48; // Convert feet to cm
    }
    if (weightUnit === 'lbs') {
        weight = weight * 0.453592; // Convert lbs to kg
    }
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // Calculate TDEE
    const tdee = bmr * activityLevel;
    
    // Display results
    document.getElementById('bmr-result').style.display = 'block';
    document.getElementById('bmr-value').textContent = `${formatNumber(bmr)} calories/day`;
    document.getElementById('tdee-value').textContent = `${formatNumber(tdee)} calories/day`;
    
    // Calculate and display calorie goals
    document.getElementById('maintain-calories').innerHTML = 
        `<strong>Maintain weight:</strong> ${formatNumber(tdee)} calories/day`;
    document.getElementById('lose-calories').innerHTML = 
        `<strong>Lose weight:</strong> ${formatNumber(tdee - 500)} calories/day (0.5 kg/week)`;
    document.getElementById('gain-calories').innerHTML = 
        `<strong>Gain weight:</strong> ${formatNumber(tdee + 500)} calories/day (0.5 kg/week)`;
}
