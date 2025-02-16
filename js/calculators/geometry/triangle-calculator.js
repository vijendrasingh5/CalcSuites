function loadTriangleCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Triangle Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Triangle Input -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Triangle Properties</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">Calculation Type</label>
                                <select class="form-select" id="triangle-type" onchange="updateTriangleInputs()">
                                    <option value="sss">Three Sides (SSS)</option>
                                    <option value="sas">Two Sides and Included Angle (SAS)</option>
                                    <option value="asa">Two Angles and Side (ASA)</option>
                                    <option value="aas">Two Angles and Non-included Side (AAS)</option>
                                    <option value="right">Right Triangle</option>
                                </select>
                            </div>
                            
                            <!-- Side Inputs -->
                            <div class="col-md-4 side-input">
                                <label class="form-label">Side a</label>
                                <input type="number" class="form-control" id="side-a" min="0" step="0.1">
                            </div>
                            <div class="col-md-4 side-input">
                                <label class="form-label">Side b</label>
                                <input type="number" class="form-control" id="side-b" min="0" step="0.1">
                            </div>
                            <div class="col-md-4 side-input">
                                <label class="form-label">Side c</label>
                                <input type="number" class="form-control" id="side-c" min="0" step="0.1">
                            </div>
                            
                            <!-- Angle Inputs -->
                            <div class="col-md-4 angle-input" style="display: none;">
                                <label class="form-label">Angle A (°)</label>
                                <input type="number" class="form-control" id="angle-a" min="0" max="180" step="0.1">
                            </div>
                            <div class="col-md-4 angle-input" style="display: none;">
                                <label class="form-label">Angle B (°)</label>
                                <input type="number" class="form-control" id="angle-b" min="0" max="180" step="0.1">
                            </div>
                            <div class="col-md-4 angle-input" style="display: none;">
                                <label class="form-label">Angle C (°)</label>
                                <input type="number" class="form-control" id="angle-c" min="0" max="180" step="0.1">
                            </div>
                            
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateTriangle()">Calculate</button>
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
                        <div id="triangle-results" style="display: none;">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>Basic Properties</h6>
                                    <div class="mb-2">Area: <span id="triangle-area">-</span></div>
                                    <div class="mb-2">Perimeter: <span id="triangle-perimeter">-</span></div>
                                    <div class="mb-2">Semi-perimeter: <span id="triangle-semi-perimeter">-</span></div>
                                </div>
                                <div class="col-md-6">
                                    <h6>Angles</h6>
                                    <div class="mb-2">Angle A: <span id="result-angle-a">-</span>°</div>
                                    <div class="mb-2">Angle B: <span id="result-angle-b">-</span>°</div>
                                    <div class="mb-2">Angle C: <span id="result-angle-c">-</span>°</div>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <h6>Special Lines</h6>
                                    <div class="mb-2">Median to a: <span id="median-a">-</span></div>
                                    <div class="mb-2">Median to b: <span id="median-b">-</span></div>
                                    <div class="mb-2">Median to c: <span id="median-c">-</span></div>
                                </div>
                                <div class="col-md-6">
                                    <h6>Circle Properties</h6>
                                    <div class="mb-2">Inscribed Circle Radius: <span id="inradius">-</span></div>
                                    <div class="mb-2">Circumscribed Circle Radius: <span id="circumradius">-</span></div>
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
                            <button class="btn btn-outline-secondary" onclick="showTriangleTypes()">Triangle Types</button>
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
                            <h6>Triangle Congruence</h6>
                            <p class="small text-muted">
                                SSS: Three sides equal
                                <br>SAS: Two sides and included angle equal
                                <br>ASA: Two angles and included side equal
                                <br>AAS: Two angles and non-included side equal
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Special Lines</h6>
                            <p class="small text-muted">
                                Median: Line from vertex to midpoint of opposite side
                                <br>Altitude: Perpendicular line from vertex to opposite side
                                <br>Angle Bisector: Line that divides an angle into two equal parts
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Circle Properties</h6>
                            <p class="small text-muted">
                                Inscribed Circle: Largest circle that fits inside the triangle
                                <br>Circumscribed Circle: Circle that passes through all vertices
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Initialize the triangle visualization
    drawTriangle();
}

function updateTriangleInputs() {
    const type = document.getElementById('triangle-type').value;
    const sideInputs = document.querySelectorAll('.side-input');
    const angleInputs = document.querySelectorAll('.angle-input');
    
    // Reset all inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
        input.required = false;
    });
    
    // Show/hide inputs based on type
    switch (type) {
        case 'sss':
            sideInputs.forEach(input => input.style.display = 'block');
            angleInputs.forEach(input => input.style.display = 'none');
            break;
            
        case 'sas':
            sideInputs.forEach(input => input.style.display = 'block');
            angleInputs.forEach(input => input.style.display = 'block');
            document.getElementById('angle-b').parentElement.style.display = 'none';
            document.getElementById('angle-c').parentElement.style.display = 'none';
            break;
            
        case 'asa':
        case 'aas':
            sideInputs.forEach(input => input.style.display = 'block');
            angleInputs.forEach(input => input.style.display = 'block');
            document.getElementById('side-b').parentElement.style.display = 'none';
            document.getElementById('side-c').parentElement.style.display = 'none';
            break;
            
        case 'right':
            sideInputs.forEach(input => input.style.display = 'block');
            angleInputs.forEach(input => input.style.display = 'none');
            document.getElementById('angle-c').value = '90';
            break;
    }
}

function calculateTriangle() {
    const type = document.getElementById('triangle-type').value;
    let a, b, c, A, B, C;
    
    // Get input values based on type
    switch (type) {
        case 'sss':
            a = parseFloat(document.getElementById('side-a').value);
            b = parseFloat(document.getElementById('side-b').value);
            c = parseFloat(document.getElementById('side-c').value);
            
            if (!isValidTriangle(a, b, c)) {
                alert('Invalid triangle sides. The sum of any two sides must be greater than the third side.');
                return;
            }
            
            // Calculate angles using law of cosines
            A = Math.acos((b*b + c*c - a*a)/(2*b*c)) * 180/Math.PI;
            B = Math.acos((a*a + c*c - b*b)/(2*a*c)) * 180/Math.PI;
            C = 180 - A - B;
            break;
            
        case 'sas':
            a = parseFloat(document.getElementById('side-a').value);
            b = parseFloat(document.getElementById('side-b').value);
            C = parseFloat(document.getElementById('angle-a').value);
            
            if (C >= 180) {
                alert('Angle must be less than 180 degrees.');
                return;
            }
            
            // Calculate third side using law of cosines
            c = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(C * Math.PI/180));
            
            // Calculate remaining angles
            A = Math.asin(a * Math.sin(C * Math.PI/180) / c) * 180/Math.PI;
            B = 180 - A - C;
            break;
            
        case 'asa':
            a = parseFloat(document.getElementById('side-a').value);
            B = parseFloat(document.getElementById('angle-b').value);
            C = parseFloat(document.getElementById('angle-c').value);
            
            if (B + C >= 180) {
                alert('Sum of angles must be less than 180 degrees.');
                return;
            }
            
            // Calculate third angle
            A = 180 - B - C;
            
            // Calculate remaining sides using law of sines
            b = a * Math.sin(B * Math.PI/180) / Math.sin(A * Math.PI/180);
            c = a * Math.sin(C * Math.PI/180) / Math.sin(A * Math.PI/180);
            break;
            
        case 'aas':
            a = parseFloat(document.getElementById('side-a').value);
            A = parseFloat(document.getElementById('angle-a').value);
            B = parseFloat(document.getElementById('angle-b').value);
            
            if (A + B >= 180) {
                alert('Sum of angles must be less than 180 degrees.');
                return;
            }
            
            // Calculate third angle
            C = 180 - A - B;
            
            // Calculate remaining sides using law of sines
            b = a * Math.sin(B * Math.PI/180) / Math.sin(A * Math.PI/180);
            c = a * Math.sin(C * Math.PI/180) / Math.sin(A * Math.PI/180);
            break;
            
        case 'right':
            a = parseFloat(document.getElementById('side-a').value);
            b = parseFloat(document.getElementById('side-b').value);
            
            // Pythagorean theorem
            c = Math.sqrt(a*a + b*b);
            
            // Calculate angles
            A = Math.atan(a/b) * 180/Math.PI;
            B = 90 - A;
            C = 90;
            break;
    }
    
    // Calculate additional properties
    const perimeter = a + b + c;
    const s = perimeter / 2; // semi-perimeter
    const area = Math.sqrt(s * (s-a) * (s-b) * (s-c)); // Heron's formula
    
    // Calculate medians
    const medianA = Math.sqrt((2*b*b + 2*c*c - a*a) / 4);
    const medianB = Math.sqrt((2*a*a + 2*c*c - b*b) / 4);
    const medianC = Math.sqrt((2*a*a + 2*b*b - c*c) / 4);
    
    // Calculate circle properties
    const inradius = area / s;
    const circumradius = (a * b * c) / (4 * area);
    
    // Update results
    document.getElementById('triangle-results').style.display = 'block';
    document.getElementById('triangle-area').textContent = area.toFixed(2);
    document.getElementById('triangle-perimeter').textContent = perimeter.toFixed(2);
    document.getElementById('triangle-semi-perimeter').textContent = s.toFixed(2);
    document.getElementById('result-angle-a').textContent = A.toFixed(2);
    document.getElementById('result-angle-b').textContent = B.toFixed(2);
    document.getElementById('result-angle-c').textContent = C.toFixed(2);
    document.getElementById('median-a').textContent = medianA.toFixed(2);
    document.getElementById('median-b').textContent = medianB.toFixed(2);
    document.getElementById('median-c').textContent = medianC.toFixed(2);
    document.getElementById('inradius').textContent = inradius.toFixed(2);
    document.getElementById('circumradius').textContent = circumradius.toFixed(2);
    
    // Update visualization
    drawTriangle(a, b, c, A, B, C);
}

function isValidTriangle(a, b, c) {
    return (a + b > c) && (b + c > a) && (a + c > b);
}

function drawTriangle(a = 3, b = 4, c = 5, A = 36.87, B = 53.13, C = 90) {
    const canvas = document.getElementById('triangle-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scale triangle to fit canvas
    const maxSide = Math.max(a, b, c);
    const scale = (canvas.width * 0.8) / maxSide;
    
    // Calculate vertices
    const vertices = calculateVertices(a * scale, b * scale, c * scale);
    
    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(vertices.x1, vertices.y1);
    ctx.lineTo(vertices.x2, vertices.y2);
    ctx.lineTo(vertices.x3, vertices.y3);
    ctx.closePath();
    
    // Style triangle
    ctx.strokeStyle = '#36a2eb';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add labels
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';
    
    // Side labels
    ctx.fillText(`a = ${a.toFixed(1)}`, (vertices.x2 + vertices.x3)/2 - 20, (vertices.y2 + vertices.y3)/2 + 20);
    ctx.fillText(`b = ${b.toFixed(1)}`, (vertices.x1 + vertices.x3)/2 - 20, (vertices.y1 + vertices.y3)/2);
    ctx.fillText(`c = ${c.toFixed(1)}`, (vertices.x1 + vertices.x2)/2 - 20, (vertices.y1 + vertices.y2)/2 - 10);
    
    // Angle labels
    ctx.fillText(`A = ${A.toFixed(1)}°`, vertices.x1 - 40, vertices.y1);
    ctx.fillText(`B = ${B.toFixed(1)}°`, vertices.x2 + 20, vertices.y2);
    ctx.fillText(`C = ${C.toFixed(1)}°`, vertices.x3 - 10, vertices.y3 + 20);
}

function calculateVertices(a, b, c) {
    // Place first vertex at origin
    const x1 = 50;
    const y1 = 50;
    
    // Place second vertex along x-axis
    const x2 = x1 + c;
    const y2 = y1;
    
    // Calculate third vertex using law of cosines
    const cosA = (b*b + c*c - a*a)/(2*b*c);
    const sinA = Math.sqrt(1 - cosA*cosA);
    
    const x3 = x1 + b*cosA;
    const y3 = y1 + b*sinA;
    
    return {x1, y1, x2, y2, x3, y3};
}

function showTriangleTypes() {
    alert(`Triangle Types:

1. By Sides:
   • Equilateral: All sides equal
   • Isosceles: Two sides equal
   • Scalene: No sides equal

2. By Angles:
   • Acute: All angles < 90°
   • Right: One angle = 90°
   • Obtuse: One angle > 90°

3. Special Properties:
   • 30-60-90 Triangle
   • 45-45-90 Triangle
   • 3-4-5 Triangle (Pythagorean Triple)

4. Congruence Cases:
   • SSS (Side-Side-Side)
   • SAS (Side-Angle-Side)
   • ASA (Angle-Side-Angle)
   • AAS (Angle-Angle-Side)`);
}

function showFormulas() {
    alert(`Triangle Formulas:

1. Area:
   • Basic: A = ½bh
   • Heron's: A = √(s(s-a)(s-b)(s-c))
   where s = (a+b+c)/2 (semi-perimeter)

2. Law of Sines:
   a/sin(A) = b/sin(B) = c/sin(C)

3. Law of Cosines:
   c² = a² + b² - 2ab·cos(C)

4. Medians:
   ma = ½√(2b² + 2c² - a²)

5. Circle Properties:
   • Inradius: r = A/s
   • Circumradius: R = abc/(4A)

6. Right Triangle:
   • a² + b² = c²
   • sin(A) = opposite/hypotenuse
   • cos(A) = adjacent/hypotenuse
   • tan(A) = opposite/adjacent`);
}

function clearCalculator() {
    // Clear all inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    // Reset results
    document.getElementById('triangle-results').style.display = 'none';
    
    // Reset visualization
    drawTriangle();
}
