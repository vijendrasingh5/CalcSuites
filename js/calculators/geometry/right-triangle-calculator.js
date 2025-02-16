function loadRightTriangleCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Right Triangle Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Input Methods -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Input Method</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Select Method</label>
                                <select class="form-select" id="input-method" onchange="updateInputFields()">
                                    <option value="legs">Two Legs</option>
                                    <option value="leg-hypotenuse">Leg and Hypotenuse</option>
                                    <option value="leg-angle">Leg and Angle</option>
                                    <option value="hypotenuse-angle">Hypotenuse and Angle</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info">
                                    <small id="method-description">Enter the lengths of both legs (a and b)</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Triangle Inputs -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Triangle Measurements</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6" id="leg-a-input">
                                <label class="form-label">Leg a</label>
                                <input type="number" class="form-control" id="leg-a" min="0" step="0.1">
                            </div>
                            <div class="col-md-6" id="leg-b-input">
                                <label class="form-label">Leg b</label>
                                <input type="number" class="form-control" id="leg-b" min="0" step="0.1">
                            </div>
                            <div class="col-md-6" id="hypotenuse-input" style="display: none;">
                                <label class="form-label">Hypotenuse c</label>
                                <input type="number" class="form-control" id="hypotenuse" min="0" step="0.1">
                            </div>
                            <div class="col-md-6" id="angle-input" style="display: none;">
                                <label class="form-label">Angle θ (degrees)</label>
                                <input type="number" class="form-control" id="angle" min="0" max="90" step="0.1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateTriangle()">Calculate</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Results -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Results</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="triangle-results" style="display: none;">
                                    <h6>Side Lengths:</h6>
                                    <div class="mb-2">Leg a: <span id="result-leg-a">-</span></div>
                                    <div class="mb-2">Leg b: <span id="result-leg-b">-</span></div>
                                    <div class="mb-2">Hypotenuse c: <span id="result-hypotenuse">-</span></div>
                                    
                                    <h6 class="mt-3">Angles:</h6>
                                    <div class="mb-2">Angle α (opposite to leg a): <span id="result-angle-a">-</span></div>
                                    <div class="mb-2">Angle β (opposite to leg b): <span id="result-angle-b">-</span></div>
                                    <div class="mb-2">Right Angle γ: 90°</div>
                                    
                                    <h6 class="mt-3">Area and Perimeter:</h6>
                                    <div class="mb-2">Area: <span id="result-area">-</span></div>
                                    <div class="mb-2">Perimeter: <span id="result-perimeter">-</span></div>
                                    
                                    <h6 class="mt-3">Special Properties:</h6>
                                    <div class="mb-2">Height to Hypotenuse: <span id="result-height">-</span></div>
                                    <div class="mb-2">Median to Hypotenuse: <span id="result-median">-</span></div>
                                    <div>Inradius (radius of inscribed circle): <span id="result-inradius">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Triangle Visualization -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Triangle Visualization</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="triangle-canvas" height="300"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Interactive triangle visualization
                        </div>
                    </div>
                </div>

                <!-- Quick Tools -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Quick Tools</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-secondary" onclick="showTrigRatios()">Show Trig Ratios</button>
                            <button class="btn btn-outline-secondary" onclick="clearCalculator()">Clear Calculator</button>
                            <button class="btn btn-outline-secondary" onclick="showFormulas()">Show Formulas</button>
                        </div>
                    </div>
                </div>

                <!-- Information -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <h6>Pythagorean Theorem</h6>
                            <p class="small text-muted">
                                a² + b² = c²
                                <br>where c is the hypotenuse
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Trigonometric Ratios</h6>
                            <p class="small text-muted">
                                sin θ = opposite/hypotenuse
                                <br>cos θ = adjacent/hypotenuse
                                <br>tan θ = opposite/adjacent
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Area</h6>
                            <p class="small text-muted">
                                Area = (a × b)/2
                                <br>Area = (c × h)/2
                                <br>where h is height to hypotenuse
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Initialize the calculator
    updateInputFields();
    drawTriangle();
}

function updateInputFields() {
    const method = document.getElementById('input-method').value;
    const legAInput = document.getElementById('leg-a-input');
    const legBInput = document.getElementById('leg-b-input');
    const hypotenuseInput = document.getElementById('hypotenuse-input');
    const angleInput = document.getElementById('angle-input');
    const description = document.getElementById('method-description');
    
    // Reset all inputs
    legAInput.style.display = 'none';
    legBInput.style.display = 'none';
    hypotenuseInput.style.display = 'none';
    angleInput.style.display = 'none';
    
    // Show relevant inputs based on method
    switch (method) {
        case 'legs':
            legAInput.style.display = 'block';
            legBInput.style.display = 'block';
            description.textContent = 'Enter the lengths of both legs (a and b)';
            break;
            
        case 'leg-hypotenuse':
            legAInput.style.display = 'block';
            hypotenuseInput.style.display = 'block';
            description.textContent = 'Enter the length of one leg (a) and the hypotenuse (c)';
            break;
            
        case 'leg-angle':
            legAInput.style.display = 'block';
            angleInput.style.display = 'block';
            description.textContent = 'Enter the length of one leg (a) and an acute angle (θ)';
            break;
            
        case 'hypotenuse-angle':
            hypotenuseInput.style.display = 'block';
            angleInput.style.display = 'block';
            description.textContent = 'Enter the length of the hypotenuse (c) and an acute angle (θ)';
            break;
    }
}

function calculateTriangle() {
    const method = document.getElementById('input-method').value;
    let a, b, c, angleA, angleB;
    
    // Get input values based on method
    switch (method) {
        case 'legs':
            a = parseFloat(document.getElementById('leg-a').value);
            b = parseFloat(document.getElementById('leg-b').value);
            if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
                alert('Please enter positive numbers for both legs');
                return;
            }
            c = Math.sqrt(a * a + b * b);
            angleA = Math.atan(a/b) * 180 / Math.PI;
            angleB = Math.atan(b/a) * 180 / Math.PI;
            break;
            
        case 'leg-hypotenuse':
            a = parseFloat(document.getElementById('leg-a').value);
            c = parseFloat(document.getElementById('hypotenuse').value);
            if (isNaN(a) || isNaN(c) || a <= 0 || c <= 0 || a >= c) {
                alert('Please enter valid measurements (leg must be less than hypotenuse)');
                return;
            }
            b = Math.sqrt(c * c - a * a);
            angleA = Math.asin(a/c) * 180 / Math.PI;
            angleB = Math.asin(b/c) * 180 / Math.PI;
            break;
            
        case 'leg-angle':
            a = parseFloat(document.getElementById('leg-a').value);
            angleA = parseFloat(document.getElementById('angle').value);
            if (isNaN(a) || isNaN(angleA) || a <= 0 || angleA <= 0 || angleA >= 90) {
                alert('Please enter valid measurements (angle must be between 0° and 90°)');
                return;
            }
            c = a / Math.sin(angleA * Math.PI / 180);
            b = a / Math.tan(angleA * Math.PI / 180);
            angleB = 90 - angleA;
            break;
            
        case 'hypotenuse-angle':
            c = parseFloat(document.getElementById('hypotenuse').value);
            angleA = parseFloat(document.getElementById('angle').value);
            if (isNaN(c) || isNaN(angleA) || c <= 0 || angleA <= 0 || angleA >= 90) {
                alert('Please enter valid measurements (angle must be between 0° and 90°)');
                return;
            }
            a = c * Math.sin(angleA * Math.PI / 180);
            b = c * Math.cos(angleA * Math.PI / 180);
            angleB = 90 - angleA;
            break;
    }
    
    // Calculate additional properties
    const area = (a * b) / 2;
    const perimeter = a + b + c;
    const height = (2 * area) / c;
    const median = c / 2;
    const inradius = area / ((a + b + c) / 2);
    
    // Update results
    document.getElementById('triangle-results').style.display = 'block';
    document.getElementById('result-leg-a').textContent = a.toFixed(4);
    document.getElementById('result-leg-b').textContent = b.toFixed(4);
    document.getElementById('result-hypotenuse').textContent = c.toFixed(4);
    document.getElementById('result-angle-a').textContent = angleA.toFixed(2) + '°';
    document.getElementById('result-angle-b').textContent = angleB.toFixed(2) + '°';
    document.getElementById('result-area').textContent = area.toFixed(4);
    document.getElementById('result-perimeter').textContent = perimeter.toFixed(4);
    document.getElementById('result-height').textContent = height.toFixed(4);
    document.getElementById('result-median').textContent = median.toFixed(4);
    document.getElementById('result-inradius').textContent = inradius.toFixed(4);
    
    // Update visualization
    drawTriangle(a, b, c, angleA, angleB);
}

function drawTriangle(a = 5, b = 4, c = Math.sqrt(41), angleA = Math.atan(5/4) * 180 / Math.PI, angleB = Math.atan(4/5) * 180 / Math.PI) {
    const canvas = document.getElementById('triangle-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scale and position
    const scale = Math.min(canvas.width, canvas.height) / (Math.max(a, b, c) * 2);
    const margin = 50;
    
    // Calculate vertices
    const x1 = margin;
    const y1 = canvas.height - margin;
    const x2 = x1 + a * scale;
    const y2 = y1;
    const x3 = x1;
    const y3 = y1 - b * scale;
    
    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.strokeStyle = '#36a2eb';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw right angle symbol
    const symbolSize = 20;
    ctx.beginPath();
    ctx.moveTo(x1 + symbolSize, y1);
    ctx.lineTo(x1 + symbolSize, y1 - symbolSize);
    ctx.lineTo(x1, y1 - symbolSize);
    ctx.strokeStyle = '#ff6384';
    ctx.stroke();
    
    // Add labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    
    // Side labels
    ctx.fillText(`a = ${a.toFixed(2)}`, (x1 + x2) / 2, y1 + 20);
    ctx.fillText(`b = ${b.toFixed(2)}`, x1 - 30, (y1 + y3) / 2);
    ctx.fillText(`c = ${c.toFixed(2)}`, (x2 + x3) / 2 - 20, (y2 + y3) / 2 + 20);
    
    // Angle labels
    ctx.fillText(`${angleA.toFixed(1)}°`, x2 - 30, y2 - 10);
    ctx.fillText(`${angleB.toFixed(1)}°`, x3 + 10, y3 + 20);
    ctx.fillText('90°', x1 + 10, y1 - 10);
}

function showTrigRatios() {
    const a = parseFloat(document.getElementById('result-leg-a')?.textContent) || 0;
    const b = parseFloat(document.getElementById('result-leg-b')?.textContent) || 0;
    const c = parseFloat(document.getElementById('result-hypotenuse')?.textContent) || 0;
    const angleA = parseFloat(document.getElementById('result-angle-a')?.textContent) || 0;
    const angleB = parseFloat(document.getElementById('result-angle-b')?.textContent) || 0;
    
    if (a === 0 || b === 0 || c === 0) {
        alert('Please calculate triangle properties first');
        return;
    }
    
    alert(`Trigonometric Ratios:

For angle α (${angleA.toFixed(2)}°):
sin α = ${(a/c).toFixed(4)}
cos α = ${(b/c).toFixed(4)}
tan α = ${(a/b).toFixed(4)}

For angle β (${angleB.toFixed(2)}°):
sin β = ${(b/c).toFixed(4)}
cos β = ${(a/c).toFixed(4)}
tan β = ${(b/a).toFixed(4)}

Reciprocal Ratios:
cosec α = ${(c/a).toFixed(4)}
sec α = ${(c/b).toFixed(4)}
cot α = ${(b/a).toFixed(4)}`);
}

function showFormulas() {
    alert(`Right Triangle Formulas:

1. Pythagorean Theorem:
   a² + b² = c²
   where c is the hypotenuse

2. Trigonometric Ratios:
   sin θ = opposite/hypotenuse
   cos θ = adjacent/hypotenuse
   tan θ = opposite/adjacent
   
3. Angle Relationships:
   α + β = 90°
   sin α = cos β
   cos α = sin β
   tan α = 1/tan β

4. Area Formulas:
   Area = (a × b)/2
   Area = (c × h)/2
   Area = (p × r)
   where:
   h = height to hypotenuse
   p = semi-perimeter
   r = inradius

5. Special Lines:
   Height to hypotenuse = (2 × Area)/c
   Median to hypotenuse = c/2
   Inradius = Area/s
   where s = semi-perimeter`);
}

function clearCalculator() {
    // Clear all inputs
    document.getElementById('leg-a').value = '';
    document.getElementById('leg-b').value = '';
    document.getElementById('hypotenuse').value = '';
    document.getElementById('angle').value = '';
    
    // Hide results
    document.getElementById('triangle-results').style.display = 'none';
    
    // Reset visualization
    drawTriangle();
}
