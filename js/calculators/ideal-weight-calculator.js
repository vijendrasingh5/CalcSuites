function loadIdealWeightCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Ideal Weight Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Gender</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="iw-gender" id="iw-gender-male" value="male" checked>
                            <label class="form-check-label" for="iw-gender-male">Male</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="iw-gender" id="iw-gender-female" value="female">
                            <label class="form-check-label" for="iw-gender-female">Female</label>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="iw-height" class="form-label">Height</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="iw-height" step="0.01">
                        <select class="form-select" id="iw-height-unit" onchange="calculateIdealWeight()">
                            <option value="cm">cm</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="iw-frame" class="form-label">Body Frame Size</label>
                    <select class="form-select" id="iw-frame" onchange="calculateIdealWeight()">
                        <option value="small">Small Frame</option>
                        <option value="medium" selected>Medium Frame</option>
                        <option value="large">Large Frame</option>
                    </select>
                </div>
                
                <button class="btn btn-primary" onclick="calculateIdealWeight()">Calculate Ideal Weight</button>
            </div>
            
            <div class="col-md-6">
                <div id="iw-result" class="result-box mt-3" style="display: none;">
                    <h4>Your Ideal Weight Results</h4>
                    <div class="mb-3">
                        <h5>Different Formulas:</h5>
                        <ul class="list-unstyled">
                            <li id="devine-formula" class="mb-2"></li>
                            <li id="hamwi-formula" class="mb-2"></li>
                            <li id="miller-formula" class="mb-2"></li>
                            <li id="robinson-formula" class="mb-2"></li>
                        </ul>
                    </div>
                    <div class="mb-3">
                        <strong>Recommended Weight Range:</strong>
                        <p id="weight-range"></p>
                    </div>
                    <div class="alert alert-info">
                        Note: These are general guidelines. Factors like age, muscle mass, and overall health should be considered.
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    calculateIdealWeight();
}

function calculateIdealWeight() {
    const gender = document.querySelector('input[name="iw-gender"]:checked').value;
    let height = parseFloat(document.getElementById('iw-height').value);
    const heightUnit = document.getElementById('iw-height-unit').value;
    const frame = document.getElementById('iw-frame').value;
    
    if (!height) {
        document.getElementById('iw-result').style.display = 'none';
        return;
    }
    
    // Convert height to cm if in feet
    if (heightUnit === 'ft') {
        height = height * 30.48;
    }
    
    // Convert height to inches for formulas
    const heightInches = height / 2.54;
    
    // Base height for formulas (height in inches - 60)
    const baseHeight = heightInches - 60;
    
    // Calculate ideal weight using different formulas
    let devine, hamwi, miller, robinson;
    
    if (gender === 'male') {
        devine = 50.0 + (2.3 * baseHeight);
        hamwi = 48.0 + (2.7 * baseHeight);
        miller = 56.2 + (1.41 * baseHeight);
        robinson = 52.0 + (1.9 * baseHeight);
    } else {
        devine = 45.5 + (2.3 * baseHeight);
        hamwi = 45.5 + (2.2 * baseHeight);
        miller = 53.1 + (1.36 * baseHeight);
        robinson = 49.0 + (1.7 * baseHeight);
    }
    
    // Apply frame size adjustments
    const frameAdjustments = {
        small: 0.9,
        medium: 1.0,
        large: 1.1
    };
    
    const frameMultiplier = frameAdjustments[frame];
    
    devine *= frameMultiplier;
    hamwi *= frameMultiplier;
    miller *= frameMultiplier;
    robinson *= frameMultiplier;
    
    // Calculate average and range
    const weights = [devine, hamwi, miller, robinson];
    const avgWeight = weights.reduce((a, b) => a + b) / weights.length;
    const range = {
        min: Math.min(...weights),
        max: Math.max(...weights)
    };
    
    // Display results
    document.getElementById('iw-result').style.display = 'block';
    
    document.getElementById('devine-formula').innerHTML = 
        `<strong>Devine Formula:</strong> ${formatNumber(devine, 1)} kg (${formatNumber(devine * 2.20462, 1)} lbs)`;
    document.getElementById('hamwi-formula').innerHTML = 
        `<strong>Hamwi Formula:</strong> ${formatNumber(hamwi, 1)} kg (${formatNumber(hamwi * 2.20462, 1)} lbs)`;
    document.getElementById('miller-formula').innerHTML = 
        `<strong>Miller Formula:</strong> ${formatNumber(miller, 1)} kg (${formatNumber(miller * 2.20462, 1)} lbs)`;
    document.getElementById('robinson-formula').innerHTML = 
        `<strong>Robinson Formula:</strong> ${formatNumber(robinson, 1)} kg (${formatNumber(robinson * 2.20462, 1)} lbs)`;
    
    document.getElementById('weight-range').innerHTML = 
        `${formatNumber(range.min, 1)} - ${formatNumber(range.max, 1)} kg<br>` +
        `(${formatNumber(range.min * 2.20462, 1)} - ${formatNumber(range.max * 2.20462, 1)} lbs)`;
}
