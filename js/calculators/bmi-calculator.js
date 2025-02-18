function initBMICalculator() {
    const container = document.getElementById('calculator-container');
    
    // BMI Calculator UI
    container.innerHTML = `
        <div class="calculator-card">
            <h3><i class="fas fa-weight"></i> BMI Calculator</h3>
            <div class="input-group">
                <label>Weight (kg)</label>
                <input type="number" id="bmi-weight" step="0.1" required>
            </div>
            <div class="input-group">
                <label>Height (cm)</label>
                <input type="number" id="bmi-height" step="0.1" required>
            </div>
            <button onclick="calculateBMI()" class="btn-calculate">
                Calculate BMI
            </button>
            <div id="bmi-results" class="results-card"></div>
        </div>
    `;

    window.currentCalculator = {
        type: 'bmi',
        calculate: calculateBMI
    };
}

function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value)/100;
    
    if (!weight || !height) {
        document.getElementById('bmi-results').innerHTML = `
            <div class="alert alert-danger">
                Please enter valid values
            </div>
        `;
        return;
    }

    const bmi = weight / (height * height);
    const category = getBMICategory(bmi);
    
    document.getElementById('bmi-results').innerHTML = `
        <h4>Result: ${bmi.toFixed(1)}</h4>
        <div class="bmi-scale ${category}">
            <p>Category: ${category}</p>
        </div>
    `;
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
}
