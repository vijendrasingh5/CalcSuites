function loadSlopeCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Slope Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Point Input -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Calculate Slope</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Point 1</label>
                                <div class="input-group">
                                    <input type="number" class="form-control" id="x1" placeholder="x₁" step="0.1">
                                    <input type="number" class="form-control" id="y1" placeholder="y₁" step="0.1">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Point 2</label>
                                <div class="input-group">
                                    <input type="number" class="form-control" id="x2" placeholder="x₂" step="0.1">
                                    <input type="number" class="form-control" id="y2" placeholder="y₂" step="0.1">
                                </div>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateSlope()">Calculate</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Results -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Results</h5>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-info mb-0" id="slope-results" style="display: none;">
                            <div class="mb-2">Slope (m): <span id="slope-value">-</span></div>
                            <div class="mb-2">Angle (θ): <span id="angle-value">-</span></div>
                            <div class="mb-2">Line Equation: <span id="line-equation">-</span></div>
                            <div class="mb-2">Perpendicular Slope: <span id="perpendicular-slope">-</span></div>
                            <div>Slope as Percentage: <span id="slope-percentage">-</span></div>
                        </div>
                    </div>
                </div>

                <!-- Slope Converter -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Slope Converter</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Convert From</label>
                                <select class="form-select" id="slope-type">
                                    <option value="ratio">Ratio (rise/run)</option>
                                    <option value="angle">Angle (degrees)</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="decimal">Decimal</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Value</label>
                                <input type="number" class="form-control" id="slope-input" step="0.1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="convertSlope()">Convert</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="conversion-results" style="display: none;">
                                    <div class="mb-2">Ratio: <span id="ratio-result">-</span></div>
                                    <div class="mb-2">Angle: <span id="angle-result">-</span></div>
                                    <div class="mb-2">Percentage: <span id="percentage-result">-</span></div>
                                    <div>Decimal: <span id="decimal-result">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Line Visualization -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Line Visualization</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="slope-canvas" height="300"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Interactive line visualization
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
                            <button class="btn btn-outline-secondary" onclick="showSlopeTypes()">Common Slopes</button>
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
                            <h6>Slope Formula</h6>
                            <p class="small text-muted">
                                m = (y₂ - y₁)/(x₂ - x₁)
                                <br>where (x₁,y₁) and (x₂,y₂) are points
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Line Equation</h6>
                            <p class="small text-muted">
                                y = mx + b
                                <br>where m is slope and b is y-intercept
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Angle Relationship</h6>
                            <p class="small text-muted">
                                θ = arctan(m)
                                <br>where θ is angle with x-axis
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Initialize visualization
    drawLine();
}

function calculateSlope() {
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const y2 = parseFloat(document.getElementById('y2').value);
    
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        alert('Please enter valid coordinates');
        return;
    }
    
    if (x1 === x2) {
        document.getElementById('slope-results').style.display = 'block';
        document.getElementById('slope-value').textContent = 'Undefined (vertical line)';
        document.getElementById('angle-value').textContent = '90°';
        document.getElementById('line-equation').textContent = `x = ${x1}`;
        document.getElementById('perpendicular-slope').textContent = '0 (horizontal line)';
        document.getElementById('slope-percentage').textContent = 'Undefined';
        drawLine(x1, y1, x2, y2);
        return;
    }
    
    const slope = (y2 - y1) / (x2 - x1);
    const angle = Math.atan(slope) * (180 / Math.PI);
    const yIntercept = y1 - slope * x1;
    const perpendicularSlope = slope === 0 ? 'Undefined (vertical line)' : (-1 / slope).toFixed(4);
    const percentage = Math.abs(slope) * 100;
    
    document.getElementById('slope-results').style.display = 'block';
    document.getElementById('slope-value').textContent = slope.toFixed(4);
    document.getElementById('angle-value').textContent = angle.toFixed(2) + '°';
    document.getElementById('line-equation').textContent = 
        `y = ${slope.toFixed(2)}x ${yIntercept >= 0 ? '+' : ''} ${yIntercept.toFixed(2)}`;
    document.getElementById('perpendicular-slope').textContent = perpendicularSlope;
    document.getElementById('slope-percentage').textContent = percentage.toFixed(2) + '%';
    
    drawLine(x1, y1, x2, y2);
}

function convertSlope() {
    const type = document.getElementById('slope-type').value;
    const value = parseFloat(document.getElementById('slope-input').value);
    
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }
    
    let ratio, angle, percentage, decimal;
    
    switch (type) {
        case 'ratio':
            ratio = value;
            angle = Math.atan(value) * (180 / Math.PI);
            percentage = value * 100;
            decimal = value;
            break;
            
        case 'angle':
            if (value === 90 || value === -90) {
                ratio = 'Undefined';
                angle = value;
                percentage = 'Undefined';
                decimal = 'Undefined';
            } else {
                ratio = Math.tan(value * Math.PI / 180);
                angle = value;
                percentage = Math.tan(value * Math.PI / 180) * 100;
                decimal = Math.tan(value * Math.PI / 180);
            }
            break;
            
        case 'percentage':
            ratio = value / 100;
            angle = Math.atan(value / 100) * (180 / Math.PI);
            percentage = value;
            decimal = value / 100;
            break;
            
        case 'decimal':
            ratio = value;
            angle = Math.atan(value) * (180 / Math.PI);
            percentage = value * 100;
            decimal = value;
            break;
    }
    
    document.getElementById('conversion-results').style.display = 'block';
    document.getElementById('ratio-result').textContent = typeof ratio === 'number' ? ratio.toFixed(4) : ratio;
    document.getElementById('angle-result').textContent = typeof angle === 'number' ? angle.toFixed(2) + '°' : angle;
    document.getElementById('percentage-result').textContent = typeof percentage === 'number' ? percentage.toFixed(2) + '%' : percentage;
    document.getElementById('decimal-result').textContent = typeof decimal === 'number' ? decimal.toFixed(4) : decimal;
    
    // Draw line with converted slope
    if (typeof ratio === 'number') {
        drawLine(0, 0, 1, ratio);
    }
}

function drawLine(x1 = 0, y1 = 0, x2 = 1, y2 = 1) {
    const canvas = document.getElementById('slope-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);
    
    // Calculate scale and center
    const points = [[x1, y1], [x2, y2]];
    const xValues = points.map(p => p[0]);
    const yValues = points.map(p => p[1]);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    const margin = 40;
    const xScale = (canvas.width - 2 * margin) / (xMax - xMin || 2);
    const yScale = (canvas.height - 2 * margin) / (yMax - yMin || 2);
    const scale = Math.min(xScale, yScale);
    
    // Transform coordinates
    const transformX = x => margin + (x - xMin) * scale;
    const transformY = y => canvas.height - margin - (y - yMin) * scale;
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(transformX(x1), transformY(y1));
    ctx.lineTo(transformX(x2), transformY(y2));
    ctx.strokeStyle = '#36a2eb';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw points
    ctx.beginPath();
    ctx.arc(transformX(x1), transformY(y1), 5, 0, 2 * Math.PI);
    ctx.arc(transformX(x2), transformY(y2), 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff6384';
    ctx.fill();
    
    // Add labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`(${x1}, ${y1})`, transformX(x1) + 10, transformY(y1) - 10);
    ctx.fillText(`(${x2}, ${y2})`, transformX(x2) + 10, transformY(y2) - 10);
}

function drawGrid(ctx, width, height) {
    const gridSize = 40;
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function showSlopeTypes() {
    alert(`Common Slope Types:

1. Horizontal Line
   • Slope = 0
   • y = constant
   • Parallel to x-axis
   • Angle = 0°

2. Vertical Line
   • Slope = undefined
   • x = constant
   • Parallel to y-axis
   • Angle = 90°

3. 45° Line
   • Slope = 1 or -1
   • y = x or y = -x
   • Equal rise and run
   • Angle = 45° or -45°

4. Common Grades
   • 100% = 45°
   • 50% = 26.6°
   • 33.3% = 18.4°
   • 25% = 14°
   • 10% = 5.7°
   • 5% = 2.9°

5. Special Cases
   • Perpendicular lines: m₁ × m₂ = -1
   • Parallel lines: m₁ = m₂
   • Rising line: Positive slope
   • Falling line: Negative slope`);
}

function showFormulas() {
    alert(`Slope Formulas and Conversions:

1. Basic Slope Formula:
   m = (y₂ - y₁)/(x₂ - x₁)
   where (x₁,y₁) and (x₂,y₂) are points

2. Angle Relationships:
   • θ = arctan(m)
   • m = tan(θ)
   where θ is angle with x-axis

3. Percentage Grade:
   Grade = |m| × 100%

4. Line Equations:
   • Point-slope: y - y₁ = m(x - x₁)
   • Slope-intercept: y = mx + b
   • Two-point: (y - y₁)/(y₂ - y₁) = (x - x₁)/(x₂ - x₁)

5. Special Relationships:
   • Perpendicular slopes: m₁ × m₂ = -1
   • Parallel slopes: m₁ = m₂
   • Distance: d = √[(x₂-x₁)² + (y₂-y₁)²]

6. Conversions:
   • Decimal to Percentage: % = decimal × 100
   • Percentage to Decimal: decimal = % ÷ 100
   • Degrees to Slope: m = tan(θ)
   • Slope to Degrees: θ = arctan(m)`);
}

function clearCalculator() {
    // Clear point inputs
    document.getElementById('x1').value = '';
    document.getElementById('y1').value = '';
    document.getElementById('x2').value = '';
    document.getElementById('y2').value = '';
    document.getElementById('slope-results').style.display = 'none';
    
    // Clear converter inputs
    document.getElementById('slope-input').value = '';
    document.getElementById('conversion-results').style.display = 'none';
    
    // Reset visualization
    drawLine();
}
