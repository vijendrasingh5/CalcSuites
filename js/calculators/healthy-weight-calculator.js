function loadHealthyWeightCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Healthy Weight Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Gender</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="hw-gender" id="hw-gender-male" value="male" checked>
                            <label class="form-check-label" for="hw-gender-male">Male</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="hw-gender" id="hw-gender-female" value="female">
                            <label class="form-check-label" for="hw-gender-female">Female</label>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="hw-age" class="form-label">Age</label>
                    <input type="number" class="form-control" id="hw-age" min="18" max="120">
                </div>
                
                <div class="mb-3">
                    <label for="hw-height" class="form-label">Height</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="hw-height" step="0.1">
                        <select class="form-select" id="hw-height-unit">
                            <option value="cm">cm</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="hw-weight" class="form-label">Current Weight</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="hw-weight" step="0.1">
                        <select class="form-select" id="hw-weight-unit">
                            <option value="kg">kg</option>
                            <option value="lbs">lbs</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="hw-frame" class="form-label">Body Frame Size</label>
                    <select class="form-select" id="hw-frame">
                        <option value="small">Small Frame</option>
                        <option value="medium" selected>Medium Frame</option>
                        <option value="large">Large Frame</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label for="hw-activity" class="form-label">Activity Level</label>
                    <select class="form-select" id="hw-activity">
                        <option value="1.2">Sedentary (little or no exercise)</option>
                        <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
                        <option value="1.55" selected>Moderately active (moderate exercise 3-5 days/week)</option>
                        <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
                        <option value="1.9">Extra active (very hard exercise & physical job)</option>
                    </select>
                </div>
                
                <button class="btn btn-primary" onclick="calculateHealthyWeight()">Calculate Healthy Weight</button>
            </div>
            
            <div class="col-md-6">
                <div id="hw-result" class="result-box mt-3" style="display: none;">
                    <h4>Healthy Weight Analysis</h4>
                    
                    <div class="mb-3">
                        <h5>Weight Status</h5>
                        <div class="progress" style="height: 25px;">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 20%">Under</div>
                            <div class="progress-bar bg-success" role="progressbar" style="width: 30%">Healthy</div>
                            <div class="progress-bar bg-warning" role="progressbar" style="width: 30%">Over</div>
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 20%">Obese</div>
                        </div>
                        <div id="hw-weight-marker" class="text-center mt-2">
                            <span class="badge bg-primary">▼ Your Weight</span>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Healthy Weight Range</h5>
                        <p id="hw-range" class="h4 text-success"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Current Status</h5>
                        <ul class="list-unstyled">
                            <li id="hw-bmi"></li>
                            <li id="hw-category"></li>
                            <li id="hw-difference"></li>
                        </ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Daily Calorie Needs</h5>
                        <ul class="list-unstyled" id="hw-calories"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Health Recommendations</h5>
                        <ul id="hw-recommendations"></ul>
                    </div>
                    
                    <div class="alert alert-info">
                        <h5>Note:</h5>
                        <p class="mb-0">This calculator provides general guidelines. Individual needs may vary based on factors like muscle mass, body composition, and specific health conditions. Consult a healthcare provider for personalized advice.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function calculateHealthyWeight() {
    const gender = document.querySelector('input[name="hw-gender"]:checked').value;
    const age = parseInt(document.getElementById('hw-age').value);
    let height = parseFloat(document.getElementById('hw-height').value);
    let weight = parseFloat(document.getElementById('hw-weight').value);
    const frame = document.getElementById('hw-frame').value;
    const activity = parseFloat(document.getElementById('hw-activity').value);
    
    // Get units
    const heightUnit = document.getElementById('hw-height-unit').value;
    const weightUnit = document.getElementById('hw-weight-unit').value;
    
    // Validate inputs
    if (!validateHealthyWeightInputs(age, height, weight)) {
        return;
    }
    
    // Convert to metric if needed
    if (heightUnit === 'ft') height = height * 30.48;
    if (weightUnit === 'lbs') weight = weight * 0.453592;
    
    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Calculate healthy BMI range (adjusted for frame size)
    const bmiAdjustments = {
        small: { min: -1, max: -0.5 },
        medium: { min: 0, max: 0 },
        large: { min: 0.5, max: 1 }
    };
    
    const adjustment = bmiAdjustments[frame];
    const healthyBmiMin = 18.5 + adjustment.min;
    const healthyBmiMax = 24.9 + adjustment.max;
    
    // Calculate healthy weight range
    const healthyWeightMin = healthyBmiMin * (heightInMeters * heightInMeters);
    const healthyWeightMax = healthyBmiMax * (heightInMeters * heightInMeters);
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // Calculate TDEE
    const tdee = bmr * activity;
    
    // Display results
    document.getElementById('hw-result').style.display = 'block';
    
    // Show healthy weight range
    const rangeKg = `${formatNumber(healthyWeightMin, 1)} - ${formatNumber(healthyWeightMax, 1)} kg`;
    const rangeLbs = `${formatNumber(healthyWeightMin * 2.20462, 1)} - ${formatNumber(healthyWeightMax * 2.20462, 1)} lbs`;
    document.getElementById('hw-range').textContent = `${rangeKg}\n(${rangeLbs})`;
    
    // Show BMI and category
    document.getElementById('hw-bmi').innerHTML = 
        `<strong>BMI:</strong> ${formatNumber(bmi, 1)}`;
    
    let category, recommendations;
    if (bmi < 18.5) {
        category = '<span class="text-danger">Underweight</span>';
        recommendations = [
            'Gradually increase calorie intake',
            'Focus on nutrient-dense foods',
            'Include protein-rich foods in every meal',
            'Consider strength training to build muscle',
            'Consult a nutritionist for a personalized plan'
        ];
    } else if (bmi < 25) {
        category = '<span class="text-success">Healthy Weight</span>';
        recommendations = [
            'Maintain current healthy habits',
            'Regular exercise (150 minutes/week)',
            'Balanced diet with variety',
            'Regular health check-ups',
            'Adequate sleep and stress management'
        ];
    } else if (bmi < 30) {
        category = '<span class="text-warning">Overweight</span>';
        recommendations = [
            'Gradually reduce calorie intake',
            'Increase physical activity',
            'Focus on portion control',
            'Choose whole, unprocessed foods',
            'Regular monitoring of progress'
        ];
    } else {
        category = '<span class="text-danger">Obese</span>';
        recommendations = [
            'Consult healthcare provider',
            'Structured weight loss program',
            'Regular physical activity',
            'Consider professional support',
            'Monitor health markers regularly'
        ];
    }
    
    document.getElementById('hw-category').innerHTML = 
        `<strong>Category:</strong> ${category}`;
    
    // Show weight difference from healthy range
    let differenceText;
    if (weight < healthyWeightMin) {
        const diff = healthyWeightMin - weight;
        differenceText = `${formatNumber(diff, 1)} kg (${formatNumber(diff * 2.20462, 1)} lbs) below healthy range`;
    } else if (weight > healthyWeightMax) {
        const diff = weight - healthyWeightMax;
        differenceText = `${formatNumber(diff, 1)} kg (${formatNumber(diff * 2.20462, 1)} lbs) above healthy range`;
    } else {
        differenceText = 'Within healthy range';
    }
    document.getElementById('hw-difference').innerHTML = 
        `<strong>Weight Status:</strong> ${differenceText}`;
    
    // Show calorie needs
    const caloriesList = [
        `<li><strong>Maintenance:</strong> ${formatNumber(tdee, 0)} calories/day</li>`
    ];
    
    if (bmi < 18.5) {
        caloriesList.push(`<li><strong>Weight Gain:</strong> ${formatNumber(tdee + 500, 0)} calories/day</li>`);
    } else if (bmi > 25) {
        caloriesList.push(`<li><strong>Weight Loss:</strong> ${formatNumber(tdee - 500, 0)} calories/day</li>`);
    }
    
    document.getElementById('hw-calories').innerHTML = caloriesList.join('');
    
    // Show recommendations
    document.getElementById('hw-recommendations').innerHTML = 
        recommendations.map(rec => `<li>${rec}</li>`).join('');
    
    // Position weight marker on progress bar
    const markerPosition = calculateMarkerPosition(bmi);
    document.getElementById('hw-weight-marker').style.marginLeft = `${markerPosition}%`;
}

function validateHealthyWeightInputs(age, height, weight) {
    if (!age || age < 18 || age > 120) {
        alert('Please enter a valid age between 18 and 120');
        return false;
    }
    
    if (!height || !weight) {
        alert('Please enter valid values for height and weight');
        return false;
    }
    
    return true;
}

function calculateMarkerPosition(bmi) {
    // Convert BMI to position percentage on progress bar
    if (bmi < 18.5) {
        return (bmi / 18.5) * 20;
    } else if (bmi < 25) {
        return 20 + ((bmi - 18.5) / 6.5) * 30;
    } else if (bmi < 30) {
        return 50 + ((bmi - 25) / 5) * 30;
    } else {
        return Math.min(100, 80 + ((bmi - 30) / 5) * 20);
    }
}
