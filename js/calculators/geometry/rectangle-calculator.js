function loadRectangleCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Rectangle/Square Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Basic Properties -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Basic Properties</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Shape Type</label>
                                <select class="form-select" id="shape-type" onchange="updateShapeInputs()">
                                    <option value="rectangle">Rectangle</option>
                                    <option value="square">Square</option>
                                </select>
                            </div>
                            <div class="col-md-6" id="length-input">
                                <label class="form-label">Length</label>
                                <input type="number" class="form-control" id="length" min="0" step="0.1">
                            </div>
                            <div class="col-md-6" id="width-input">
                                <label class="form-label">Width</label>
                                <input type="number" class="form-control" id="width" min="0" step="0.1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateBasicProperties()">Calculate</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="basic-results" style="display: none;">
                                    <div class="mb-2">Perimeter: <span id="perimeter">-</span></div>
                                    <div class="mb-2">Area: <span id="area">-</span></div>
                                    <div class="mb-2">Diagonal: <span id="diagonal">-</span></div>
                                    <div>Diagonal Angle: <span id="diagonal-angle">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Golden Ratio Properties -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Golden Ratio Properties</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Input Type</label>
                                <select class="form-select" id="golden-input-type">
                                    <option value="width">Width</option>
                                    <option value="length">Length</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Value</label>
                                <input type="number" class="form-control" id="golden-value" min="0" step="0.1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateGoldenRatio()">Calculate Golden Rectangle</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="golden-results" style="display: none;">
                                    <div class="mb-2">Length: <span id="golden-length">-</span></div>
                                    <div class="mb-2">Width: <span id="golden-width">-</span></div>
                                    <div class="mb-2">Ratio: <span id="golden-ratio">-</span></div>
                                    <div>Area: <span id="golden-area">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Inscribed/Circumscribed Circle -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Circle Properties</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Length</label>
                                <input type="number" class="form-control" id="circle-length" min="0" step="0.1">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Width</label>
                                <input type="number" class="form-control" id="circle-width" min="0" step="0.1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateCircleProperties()">Calculate</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="circle-results" style="display: none;">
                                    <div class="mb-2">Inscribed Circle Radius: <span id="inscribed-radius">-</span></div>
                                    <div class="mb-2">Inscribed Circle Area: <span id="inscribed-area">-</span></div>
                                    <div class="mb-2">Circumscribed Circle Radius: <span id="circumscribed-radius">-</span></div>
                                    <div>Circumscribed Circle Area: <span id="circumscribed-area">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Shape Visualization -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Shape Visualization</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="shape-canvas" height="300"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Interactive shape visualization
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
                            <button class="btn btn-outline-secondary" onclick="showProperties()">Show Properties</button>
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
                            <h6>Basic Properties</h6>
                            <p class="small text-muted">
                                • Perimeter = 2(l + w)
                                <br>• Area = l × w
                                <br>• Diagonal = √(l² + w²)
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Golden Ratio</h6>
                            <p class="small text-muted">
                                • φ ≈ 1.618033989
                                <br>• length/width = φ
                                <br>• Perfect aesthetic proportion
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Circle Properties</h6>
                            <p class="small text-muted">
                                • Inscribed: r = (l×w)/(2√(l²+w²))
                                <br>• Circumscribed: R = √(l²+w²)/2
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
    updateShapeInputs();
    drawShape();
}

function updateShapeInputs() {
    const shapeType = document.getElementById('shape-type').value;
    const widthInput = document.getElementById('width-input');
    
    if (shapeType === 'square') {
        widthInput.style.display = 'none';
        document.getElementById('width').value = document.getElementById('length').value;
    } else {
        widthInput.style.display = 'block';
    }
    
    drawShape();
}

function calculateBasicProperties() {
    const length = parseFloat(document.getElementById('length').value);
    let width = parseFloat(document.getElementById('width').value);
    
    if (document.getElementById('shape-type').value === 'square') {
        width = length;
    }
    
    if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
        alert('Please enter positive numbers for dimensions');
        return;
    }
    
    const perimeter = 2 * (length + width);
    const area = length * width;
    const diagonal = Math.sqrt(length * length + width * width);
    const diagonalAngle = Math.atan2(width, length) * (180 / Math.PI);
    
    document.getElementById('basic-results').style.display = 'block';
    document.getElementById('perimeter').textContent = perimeter.toFixed(4);
    document.getElementById('area').textContent = area.toFixed(4);
    document.getElementById('diagonal').textContent = diagonal.toFixed(4);
    document.getElementById('diagonal-angle').textContent = diagonalAngle.toFixed(2) + '°';
    
    drawShape(length, width);
}

function calculateGoldenRatio() {
    const inputType = document.getElementById('golden-input-type').value;
    const value = parseFloat(document.getElementById('golden-value').value);
    
    if (isNaN(value) || value <= 0) {
        alert('Please enter a positive number');
        return;
    }
    
    const goldenRatio = (1 + Math.sqrt(5)) / 2; // ≈ 1.618033989
    let length, width;
    
    if (inputType === 'width') {
        width = value;
        length = width * goldenRatio;
    } else {
        length = value;
        width = length / goldenRatio;
    }
    
    document.getElementById('golden-results').style.display = 'block';
    document.getElementById('golden-length').textContent = length.toFixed(4);
    document.getElementById('golden-width').textContent = width.toFixed(4);
    document.getElementById('golden-ratio').textContent = goldenRatio.toFixed(6);
    document.getElementById('golden-area').textContent = (length * width).toFixed(4);
    
    drawShape(length, width, true);
}

function calculateCircleProperties() {
    const length = parseFloat(document.getElementById('circle-length').value);
    const width = parseFloat(document.getElementById('circle-width').value);
    
    if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
        alert('Please enter positive numbers for dimensions');
        return;
    }
    
    // Calculate inscribed circle properties
    const inscribedRadius = (length * width) / (2 * Math.sqrt(length * length + width * width));
    const inscribedArea = Math.PI * inscribedRadius * inscribedRadius;
    
    // Calculate circumscribed circle properties
    const circumscribedRadius = Math.sqrt(length * length + width * width) / 2;
    const circumscribedArea = Math.PI * circumscribedRadius * circumscribedRadius;
    
    document.getElementById('circle-results').style.display = 'block';
    document.getElementById('inscribed-radius').textContent = inscribedRadius.toFixed(4);
    document.getElementById('inscribed-area').textContent = inscribedArea.toFixed(4);
    document.getElementById('circumscribed-radius').textContent = circumscribedRadius.toFixed(4);
    document.getElementById('circumscribed-area').textContent = circumscribedArea.toFixed(4);
    
    drawShape(length, width, false, true);
}

function drawShape(length = 100, width = 75, showGoldenSpiral = false, showCircles = false) {
    const canvas = document.getElementById('shape-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scale and center
    const scale = Math.min(canvas.width / (length * 1.5), canvas.height / (width * 1.5));
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const scaledLength = length * scale;
    const scaledWidth = width * scale;
    
    // Draw rectangle
    ctx.beginPath();
    ctx.rect(centerX - scaledLength/2, centerY - scaledWidth/2, scaledLength, scaledWidth);
    ctx.strokeStyle = '#36a2eb';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw diagonal
    ctx.beginPath();
    ctx.moveTo(centerX - scaledLength/2, centerY - scaledWidth/2);
    ctx.lineTo(centerX + scaledLength/2, centerY + scaledWidth/2);
    ctx.strokeStyle = '#ff6384';
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    if (showGoldenSpiral) {
        // Draw golden spiral (approximation)
        ctx.beginPath();
        let x = centerX - scaledLength/2;
        let y = centerY + scaledWidth/2;
        const steps = 50;
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const radius = Math.pow(goldenRatio, t * 4) * scale;
            const angle = t * 6.28;
            const newX = x + radius * Math.cos(angle);
            const newY = y + radius * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(newX, newY);
            }
            
            x = newX;
            y = newY;
        }
        
        ctx.strokeStyle = '#4bc0c0';
        ctx.stroke();
    }
    
    if (showCircles) {
        // Draw inscribed circle
        const inscribedRadius = (length * width) / (2 * Math.sqrt(length * length + width * width)) * scale;
        ctx.beginPath();
        ctx.arc(centerX, centerY, inscribedRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#4bc0c0';
        ctx.stroke();
        
        // Draw circumscribed circle
        const circumscribedRadius = Math.sqrt(length * length + width * width) / 2 * scale;
        ctx.beginPath();
        ctx.arc(centerX, centerY, circumscribedRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ff9f40';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Add labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(`l = ${length}`, centerX, centerY - scaledWidth/2 - 10);
    if (document.getElementById('shape-type').value !== 'square') {
        ctx.fillText(`w = ${width}`, centerX - scaledLength/2 - 20, centerY);
    }
}

function showProperties() {
    alert(`Rectangle/Square Properties:

1. Basic Properties:
   • Rectangle: Four right angles, opposite sides parallel
   • Square: Special rectangle with equal sides
   • Perimeter = 2(length + width)
   • Area = length × width
   • Diagonal = √(length² + width²)

2. Golden Rectangle:
   • Length:Width ratio = φ ≈ 1.618033989
   • Considered most aesthetically pleasing
   • Found in art, architecture, and nature
   • Successive golden rectangles form spiral

3. Circle Properties:
   • Inscribed circle: Touches all sides
   • Circumscribed circle: Contains all vertices
   • Inscribed radius = (l×w)/(2√(l²+w²))
   • Circumscribed radius = √(l²+w²)/2

4. Special Properties:
   • All angles = 90°
   • Diagonals bisect each other
   • Diagonals are equal
   • Opposite sides are parallel and equal`);
}

function showFormulas() {
    alert(`Rectangle/Square Formulas:

1. Basic Formulas:
   • Perimeter (P) = 2(l + w)
   • Area (A) = l × w
   • Diagonal (d) = √(l² + w²)
   • Diagonal Angle = tan⁻¹(w/l)

2. Golden Rectangle:
   • φ = (1 + √5)/2 ≈ 1.618033989
   • Length = Width × φ
   • Width = Length/φ
   • Successive ratio = φⁿ

3. Circle Properties:
   • Inscribed circle radius (r):
     r = (l×w)/(2√(l²+w²))
   • Circumscribed circle radius (R):
     R = √(l²+w²)/2
   • Inscribed circle area = πr²
   • Circumscribed circle area = πR²

4. Square Special Cases:
   • Side (s) = length = width
   • Perimeter = 4s
   • Area = s²
   • Diagonal = s√2
   • Diagonal Angle = 45°`);
}

function clearCalculator() {
    // Clear basic inputs
    document.getElementById('length').value = '';
    document.getElementById('width').value = '';
    document.getElementById('basic-results').style.display = 'none';
    
    // Clear golden ratio inputs
    document.getElementById('golden-value').value = '';
    document.getElementById('golden-results').style.display = 'none';
    
    // Clear circle inputs
    document.getElementById('circle-length').value = '';
    document.getElementById('circle-width').value = '';
    document.getElementById('circle-results').style.display = 'none';
    
    // Reset visualization
    drawShape();
}
