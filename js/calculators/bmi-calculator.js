function loadBMICalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('BMI Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="height" class="form-label">Height</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="height" step="0.01" required>
                        <select class="form-select" id="height-unit">
                            <option value="cm">cm</option>
                            <option value="m">m</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="weight" class="form-label">Weight</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="weight" step="0.1" required>
                        <select class="form-select" id="weight-unit">
                            <option value="kg">kg</option>
                            <option value="lbs">lbs</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <button class="btn btn-primary" onclick="calculateBMI()">Calculate BMI</button>
        <div id="bmi-result" class="result-box mt-3" style="display: none;">
            <h4>Your BMI Result</h4>
            <p id="bmi-value"></p>
            <p id="bmi-category"></p>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const heightUnit = document.getElementById('height-unit').value;
    const weightUnit = document.getElementById('weight-unit').value;
    
    if (!validateNumber(height) || !validateNumber(weight)) {
        alert('Please enter valid numbers for height and weight');
        return;
    }
    
    // Convert to meters and kilograms
    let heightInM = height;
    let weightInKg = weight;
    
    switch(heightUnit) {
        case 'cm':
            heightInM = height / 100;
            break;
        case 'ft':
            heightInM = height * 0.3048;
            break;
    }
    
    if (weightUnit === 'lbs') {
        weightInKg = weight * 0.453592;
    }
    
    const bmi = weightInKg / (heightInM * heightInM);
    const resultDiv = document.getElementById('bmi-result');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    
    resultDiv.style.display = 'block';
    bmiValue.textContent = `BMI: ${formatNumber(bmi, 1)}`;
    
    // Determine BMI category
    let category;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    
    bmiCategory.textContent = `Category: ${category}`;
}
