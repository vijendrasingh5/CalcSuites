function loadCircleCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Circle Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Basic Circle Properties -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Basic Circle Properties</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Input Type</label>
                                <select class="form-select" id="circle-input-type" onchange="updateCircleInputs()">
                                    <option value="radius">Radius</option>
                                    <option value="diameter">Diameter</option>
                                    <option value="circumference">Circumference</option>
                                    <option value="area">Area</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Value</label>
                                <input type="number" class="form-control" id="circle-input-value" min="0" step="0.1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateCircleProperties()">Calculate</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="circle-basic-results" style="display: none;">
                                    <div class="mb-2">Radius: <span id="circle-radius">-</span></div>
                                    <div class="mb-2">Diameter: <span id="circle-diameter">-</span></div>
                                    <div class="mb-2">Circumference: <span id="circle-circumference">-</span></div>
                                    <div>Area: <span id="circle-area">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Arc and Sector -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Arc and Sector Properties</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Radius</label>
                                <input type="number" class="form-control" id="arc-radius" min="0" step="0.1">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Central Angle (degrees)</label>
                                <input type="number" class="form-control" id="central-angle" 
                                    min="0" max="360" step="0.1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateArcSector()">Calculate</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="arc-sector-results" style="display: none;">
                                    <div class="mb-2">Arc Length: <span id="arc-length">-</span></div>
                                    <div class="mb-2">Sector Area: <span id="sector-area">-</span></div>
                                    <div class="mb-2">Chord Length: <span id="chord-length">-</span></div>
                                    <div>Segment Area: <span id="segment-area">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Inscribed and Circumscribed Shapes -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Related Shapes</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Circle Radius</label>
                                <input type="number" class="form-control" id="shape-radius" min="0" step="0.1">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Number of Sides (Regular Polygon)</label>
                                <input type="number" class="form-control" id="polygon-sides" 
                                    min="3" max="12" step="1" value="4">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateRelatedShapes()">Calculate</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="shape-results" style="display: none;">
                                    <div class="mb-2">Inscribed Square Side: <span id="inscribed-square">-</span></div>
                                    <div class="mb-2">Circumscribed Square Side: <span id="circumscribed-square">-</span></div>
                                    <div class="mb-2">Inscribed Regular Polygon Side: <span id="inscribed-polygon">-</span></div>
                                    <div>Circumscribed Regular Polygon Side: <span id="circumscribed-polygon">-</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Circle Visualization -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Circle Visualization</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="circle-canvas" height="300"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Interactive circle visualization
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
                            <button class="btn btn-outline-secondary" onclick="showCircleProperties()">Circle Properties</button>
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
                                • Diameter = 2 × Radius
                                <br>• Circumference = 2πr
                                <br>• Area = πr²
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Arc and Sector</h6>
                            <p class="small text-muted">
                                • Arc Length = (θ/360°) × 2πr
                                <br>• Sector Area = (θ/360°) × πr²
                                <br>where θ is the central angle
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Related Shapes</h6>
                            <p class="small text-muted">
                                • Inscribed Square Side = r√2
                                <br>• Circumscribed Square Side = 2r
                                <br>• Regular Polygon Side = 2r × sin(180°/n)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Draw initial circle
    drawCircle();
}

function calculateCircleProperties() {
    const type = document.getElementById('circle-input-type').value;
    const value = parseFloat(document.getElementById('circle-input-value').value);
    
    if (isNaN(value) || value <= 0) {
        alert('Please enter a positive number');
        return;
    }
    
    let radius, diameter, circumference, area;
    
    switch (type) {
        case 'radius':
            radius = value;
            diameter = 2 * radius;
            circumference = 2 * Math.PI * radius;
            area = Math.PI * radius * radius;
            break;
            
        case 'diameter':
            diameter = value;
            radius = diameter / 2;
            circumference = Math.PI * diameter;
            area = Math.PI * radius * radius;
            break;
            
        case 'circumference':
            circumference = value;
            radius = circumference / (2 * Math.PI);
            diameter = 2 * radius;
            area = Math.PI * radius * radius;
            break;
            
        case 'area':
            area = value;
            radius = Math.sqrt(area / Math.PI);
            diameter = 2 * radius;
            circumference = 2 * Math.PI * radius;
            break;
    }
    
    // Update results
    document.getElementById('circle-basic-results').style.display = 'block';
    document.getElementById('circle-radius').textContent = radius.toFixed(4);
    document.getElementById('circle-diameter').textContent = diameter.toFixed(4);
    document.getElementById('circle-circumference').textContent = circumference.toFixed(4);
    document.getElementById('circle-area').textContent = area.toFixed(4);
    
    // Update visualization
    drawCircle(radius);
}

function calculateArcSector() {
    const radius = parseFloat(document.getElementById('arc-radius').value);
    const angle = parseFloat(document.getElementById('central-angle').value);
    
    if (isNaN(radius) || radius <= 0) {
        alert('Please enter a positive radius');
        return;
    }
    
    if (isNaN(angle) || angle <= 0 || angle > 360) {
        alert('Please enter an angle between 0 and 360 degrees');
        return;
    }
    
    // Convert angle to radians
    const angleRad = angle * Math.PI / 180;
    
    // Calculate properties
    const arcLength = (angle / 360) * (2 * Math.PI * radius);
    const sectorArea = (angle / 360) * (Math.PI * radius * radius);
    const chordLength = 2 * radius * Math.sin(angleRad / 2);
    const segmentArea = sectorArea - (radius * radius * Math.sin(angleRad)) / 2;
    
    // Update results
    document.getElementById('arc-sector-results').style.display = 'block';
    document.getElementById('arc-length').textContent = arcLength.toFixed(4);
    document.getElementById('sector-area').textContent = sectorArea.toFixed(4);
    document.getElementById('chord-length').textContent = chordLength.toFixed(4);
    document.getElementById('segment-area').textContent = segmentArea.toFixed(4);
    
    // Update visualization
    drawCircle(radius, angle);
}

function calculateRelatedShapes() {
    const radius = parseFloat(document.getElementById('shape-radius').value);
    const sides = parseInt(document.getElementById('polygon-sides').value);
    
    if (isNaN(radius) || radius <= 0) {
        alert('Please enter a positive radius');
        return;
    }
    
    if (isNaN(sides) || sides < 3) {
        alert('Please enter at least 3 sides');
        return;
    }
    
    // Calculate inscribed and circumscribed square sides
    const inscribedSquare = radius * Math.sqrt(2);
    const circumscribedSquare = 2 * radius;
    
    // Calculate regular polygon sides
    const inscribedPolygon = 2 * radius * Math.sin(Math.PI / sides);
    const circumscribedPolygon = 2 * radius * Math.tan(Math.PI / sides);
    
    // Update results
    document.getElementById('shape-results').style.display = 'block';
    document.getElementById('inscribed-square').textContent = inscribedSquare.toFixed(4);
    document.getElementById('circumscribed-square').textContent = circumscribedSquare.toFixed(4);
    document.getElementById('inscribed-polygon').textContent = inscribedPolygon.toFixed(4);
    document.getElementById('circumscribed-polygon').textContent = circumscribedPolygon.toFixed(4);
    
    // Update visualization
    drawCircle(radius, 360, sides);
}

function drawCircle(radius = 100, angle = 360, sides = 0) {
    const canvas = document.getElementById('circle-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate center and scale
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / (3 * radius);
    const scaledRadius = radius * scale;
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, scaledRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#36a2eb';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw radius
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + scaledRadius, centerY);
    ctx.strokeStyle = '#ff6384';
    ctx.stroke();
    
    // Draw sector if angle < 360
    if (angle < 360) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, scaledRadius, 0, angle * Math.PI / 180);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = 'rgba(54, 162, 235, 0.2)';
        ctx.fill();
    }
    
    // Draw regular polygon if sides > 2
    if (sides > 2) {
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const x = centerX + scaledRadius * Math.cos(angle);
            const y = centerY + scaledRadius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.strokeStyle = '#4bc0c0';
        ctx.stroke();
    }
    
    // Add labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`r = ${radius}`, centerX + scaledRadius/2, centerY - 10);
    if (angle < 360) {
        ctx.fillText(`θ = ${angle}°`, centerX + 20, centerY + 20);
    }
}

function showCircleProperties() {
    alert(`Circle Properties:

1. Basic Properties:
   • Radius (r): Distance from center to any point on circle
   • Diameter (d): 2r, distance across circle through center
   • Circumference (C): 2πr, distance around circle
   • Area (A): πr², area enclosed by circle

2. Arc and Sector:
   • Arc Length: (θ/360°) × 2πr
   • Sector Area: (θ/360°) × πr²
   • Chord Length: 2r × sin(θ/2)
   • Segment Area: Sector Area - Triangle Area

3. Related Shapes:
   • Inscribed Square: Side = r√2
   • Circumscribed Square: Side = 2r
   • Regular n-gon: Side = 2r × sin(180°/n)
   • Inscribed Angle: Half the central angle

4. Special Properties:
   • All points equidistant from center
   • Circumference/Diameter = π
   • Area increases with square of radius
   • Circle has maximum area for given perimeter`);
}

function showFormulas() {
    alert(`Circle Formulas:

1. Basic Formulas:
   • Diameter (d) = 2r
   • Circumference (C) = 2πr = πd
   • Area (A) = πr²

2. Arc and Sector:
   • Arc Length (L) = (θ/360°) × 2πr
   • Sector Area (As) = (θ/360°) × πr²
   • Chord Length (c) = 2r × sin(θ/2)
   • Segment Area = r²(θ/2 - sin(θ)/2)
   where θ is in radians

3. Regular Polygons:
   • Inscribed n-gon side = 2r × sin(π/n)
   • Circumscribed n-gon side = 2r × tan(π/n)
   • n-gon area = (n/2) × r² × sin(2π/n)

4. Circle Relations:
   • Power of a Point: PA × PB = PC × PD
   • Tangent-Secant: PT² = PA × PB
   where P is external point, T is tangent point`);
}

function clearCalculator() {
    // Clear basic circle inputs
    document.getElementById('circle-input-value').value = '';
    document.getElementById('circle-basic-results').style.display = 'none';
    
    // Clear arc and sector inputs
    document.getElementById('arc-radius').value = '';
    document.getElementById('central-angle').value = '';
    document.getElementById('arc-sector-results').style.display = 'none';
    
    // Clear related shapes inputs
    document.getElementById('shape-radius').value = '';
    document.getElementById('polygon-sides').value = '4';
    document.getElementById('shape-results').style.display = 'none';
    
    // Reset visualization
    drawCircle();
}
