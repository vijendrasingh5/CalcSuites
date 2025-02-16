function loadPythagoreanCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Pythagorean Theorem Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Input Section -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Find Missing Side</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">What to Find?</label>
                                <select class="form-select" id="find-side" onchange="updatePythagoreanInputs()">
                                    <option value="c">Hypotenuse (c)</option>
                                    <option value="a">Leg a</option>
                                    <option value="b">Leg b</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info">
                                    <small id="pythagorean-description">Enter the lengths of both legs to find the hypotenuse</small>
                                </div>
                            </div>
                            <div class="col-md-6" id="side-a-input">
                                <label class="form-label">Leg a</label>
                                <input type="number" class="form-control" id="side-a" min="0" step="0.1">
                            </div>
                            <div class="col-md-6" id="side-b-input">
                                <label class="form-label">Leg b</label>
                                <input type="number" class="form-control" id="side-b" min="0" step="0.1">
                            </div>
                            <div class="col-md-6" id="side-c-input" style="display: none;">
                                <label class="form-label">Hypotenuse c</label>
                                <input type="number" class="form-control" id="side-c" min="0" step="0.1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculatePythagorean()">Calculate</button>
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
                        <div class="alert alert-info mb-0" id="pythagorean-results" style="display: none;">
                            <div class="mb-2" id="calculation-steps"></div>
                            <div class="mb-2">Leg a: <span id="result-a">-</span></div>
                            <div class="mb-2">Leg b: <span id="result-b">-</span></div>
                            <div class="mb-2">Hypotenuse c: <span id="result-c">-</span></div>
                            <div class="mb-2">Triangle Area: <span id="result-area">-</span></div>
                            <div>Triangle Perimeter: <span id="result-perimeter">-</span></div>
                        </div>
                    </div>
                </div>

                <!-- Verification -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Verify Pythagorean Triple</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Side 1</label>
                                <input type="number" class="form-control" id="verify-a" min="0" step="1">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Side 2</label>
                                <input type="number" class="form-control" id="verify-b" min="0" step="1">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Side 3</label>
                                <input type="number" class="form-control" id="verify-c" min="0" step="1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="verifyPythagoreanTriple()">Verify Triple</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="verify-results" style="display: none;">
                                    <div id="verify-steps"></div>
                                    <div id="verify-conclusion"></div>
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
                        <canvas id="pythagorean-canvas" height="300"></canvas>
                        <div class="text-center mt-2 small text-muted">
                            Interactive visualization of the right triangle
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
                            <button class="btn btn-outline-secondary" onclick="showCommonTriples()">Common Triples</button>
                            <button class="btn btn-outline-secondary" onclick="clearCalculator()">Clear Calculator</button>
                            <button class="btn btn-outline-secondary" onclick="showTheorem()">Show Theorem</button>
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
                            <h6>The Theorem</h6>
                            <p class="small text-muted">
                                In a right triangle:
                                <br>a² + b² = c²
                                <br>where c is the hypotenuse
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Applications</h6>
                            <p class="small text-muted">
                                • Distance calculations
                                <br>• Construction and engineering
                                <br>• Navigation and surveying
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Historical Note</h6>
                            <p class="small text-muted">
                                Known to ancient civilizations:
                                <br>• Babylonians (1900-1600 BC)
                                <br>• Ancient Egyptians
                                <br>• Greeks (Pythagoras ~570-495 BC)
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
    updatePythagoreanInputs();
    drawPythagoreanTriangle();
}

function updatePythagoreanInputs() {
    const findSide = document.getElementById('find-side').value;
    const sideAInput = document.getElementById('side-a-input');
    const sideBInput = document.getElementById('side-b-input');
    const sideCInput = document.getElementById('side-c-input');
    const description = document.getElementById('pythagorean-description');
    
    // Show/hide inputs based on what we're finding
    switch (findSide) {
        case 'c':
            sideAInput.style.display = 'block';
            sideBInput.style.display = 'block';
            sideCInput.style.display = 'none';
            description.textContent = 'Enter the lengths of both legs to find the hypotenuse';
            break;
            
        case 'a':
            sideAInput.style.display = 'none';
            sideBInput.style.display = 'block';
            sideCInput.style.display = 'block';
            description.textContent = 'Enter leg b and hypotenuse c to find leg a';
            break;
            
        case 'b':
            sideAInput.style.display = 'block';
            sideBInput.style.display = 'none';
            sideCInput.style.display = 'block';
            description.textContent = 'Enter leg a and hypotenuse c to find leg b';
            break;
    }
}

function calculatePythagorean() {
    const findSide = document.getElementById('find-side').value;
    let a, b, c, steps = '';
    
    try {
        switch (findSide) {
            case 'c':
                a = parseFloat(document.getElementById('side-a').value);
                b = parseFloat(document.getElementById('side-b').value);
                if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
                    throw new Error('Please enter positive numbers for both legs');
                }
                steps = `Finding hypotenuse c:
                        <br>c² = a² + b²
                        <br>c² = ${a}² + ${b}²
                        <br>c² = ${a*a} + ${b*b}
                        <br>c² = ${a*a + b*b}
                        <br>c = √${a*a + b*b}
                        <br>c = ${Math.sqrt(a*a + b*b).toFixed(4)}`;
                c = Math.sqrt(a*a + b*b);
                break;
                
            case 'a':
                b = parseFloat(document.getElementById('side-b').value);
                c = parseFloat(document.getElementById('side-c').value);
                if (isNaN(b) || isNaN(c) || b <= 0 || c <= 0 || b >= c) {
                    throw new Error('Please enter valid measurements (leg must be less than hypotenuse)');
                }
                steps = `Finding leg a:
                        <br>a² = c² - b²
                        <br>a² = ${c}² - ${b}²
                        <br>a² = ${c*c} - ${b*b}
                        <br>a² = ${c*c - b*b}
                        <br>a = √${c*c - b*b}
                        <br>a = ${Math.sqrt(c*c - b*b).toFixed(4)}`;
                a = Math.sqrt(c*c - b*b);
                break;
                
            case 'b':
                a = parseFloat(document.getElementById('side-a').value);
                c = parseFloat(document.getElementById('side-c').value);
                if (isNaN(a) || isNaN(c) || a <= 0 || c <= 0 || a >= c) {
                    throw new Error('Please enter valid measurements (leg must be less than hypotenuse)');
                }
                steps = `Finding leg b:
                        <br>b² = c² - a²
                        <br>b² = ${c}² - ${a}²
                        <br>b² = ${c*c} - ${a*a}
                        <br>b² = ${c*c - a*a}
                        <br>b = √${c*c - a*a}
                        <br>b = ${Math.sqrt(c*c - a*a).toFixed(4)}`;
                b = Math.sqrt(c*c - a*a);
                break;
        }
        
        // Calculate area and perimeter
        const area = (a * b) / 2;
        const perimeter = a + b + c;
        
        // Update results
        document.getElementById('pythagorean-results').style.display = 'block';
        document.getElementById('calculation-steps').innerHTML = steps;
        document.getElementById('result-a').textContent = a.toFixed(4);
        document.getElementById('result-b').textContent = b.toFixed(4);
        document.getElementById('result-c').textContent = c.toFixed(4);
        document.getElementById('result-area').textContent = area.toFixed(4);
        document.getElementById('result-perimeter').textContent = perimeter.toFixed(4);
        
        // Update visualization
        drawPythagoreanTriangle(a, b, c);
        
    } catch (error) {
        alert(error.message);
    }
}

function verifyPythagoreanTriple() {
    const a = parseInt(document.getElementById('verify-a').value);
    const b = parseInt(document.getElementById('verify-b').value);
    const c = parseInt(document.getElementById('verify-c').value);
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
        alert('Please enter positive integers for all sides');
        return;
    }
    
    // Sort sides to ensure largest is compared as hypotenuse
    const sides = [a, b, c].sort((x, y) => x - y);
    const [s1, s2, s3] = sides;
    
    const leftSide = s1*s1 + s2*s2;
    const rightSide = s3*s3;
    
    const steps = `Verification steps:
                  <br>1. Checking if ${s1}² + ${s2}² = ${s3}²
                  <br>2. Left side: ${s1}² + ${s2}² = ${s1*s1} + ${s2*s2} = ${leftSide}
                  <br>3. Right side: ${s3}² = ${rightSide}`;
    
    const conclusion = leftSide === rightSide
        ? `<br><br>✓ This is a Pythagorean triple! ${s1}² + ${s2}² = ${s3}²`
        : `<br><br>✗ This is not a Pythagorean triple. ${leftSide} ≠ ${rightSide}`;
    
    document.getElementById('verify-results').style.display = 'block';
    document.getElementById('verify-steps').innerHTML = steps;
    document.getElementById('verify-conclusion').innerHTML = conclusion;
    
    // Update visualization if it's a valid triple
    if (leftSide === rightSide) {
        drawPythagoreanTriangle(s1, s2, s3);
    }
}

function drawPythagoreanTriangle(a = 3, b = 4, c = 5) {
    const canvas = document.getElementById('pythagorean-canvas');
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
    
    // Draw squares on each side
    // Square on a
    ctx.beginPath();
    ctx.rect(x1, y1, a * scale, a * scale);
    ctx.strokeStyle = '#ff6384';
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 99, 132, 0.1)';
    ctx.fill();
    
    // Square on b
    ctx.beginPath();
    ctx.rect(x1 - b * scale, y1 - b * scale, b * scale, b * scale);
    ctx.strokeStyle = '#4bc0c0';
    ctx.stroke();
    ctx.fillStyle = 'rgba(75, 192, 192, 0.1)';
    ctx.fill();
    
    // Square on c (hypotenuse)
    const angle = Math.atan2(b, a);
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(-angle);
    ctx.beginPath();
    ctx.rect(0, 0, c * scale, c * scale);
    ctx.strokeStyle = '#ff9f40';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 159, 64, 0.1)';
    ctx.fill();
    ctx.restore();
    ctx.setLineDash([]);
    
    // Add labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    
    // Side labels
    ctx.fillText(`a = ${a}`, (x1 + x2) / 2, y1 + 20);
    ctx.fillText(`b = ${b}`, x1 - 20, (y1 + y3) / 2);
    ctx.fillText(`c = ${c}`, (x2 + x3) / 2 - 20, (y2 + y3) / 2 + 20);
    
    // Square areas
    ctx.fillText(`a² = ${a*a}`, x1 + (a * scale) / 2, y1 + (a * scale) / 2);
    ctx.fillText(`b² = ${b*b}`, x1 - (b * scale) / 2, y1 - (b * scale) / 2);
    ctx.fillText(`c² = ${c*c}`, x1 + (c * scale) / 2, y1 - (c * scale) / 4);
}

function showCommonTriples() {
    alert(`Common Pythagorean Triples:

1. (3, 4, 5) - Most basic triple
2. (5, 12, 13)
3. (6, 8, 10) - Multiple of (3, 4, 5)
4. (8, 15, 17)
5. (9, 12, 15) - Multiple of (3, 4, 5)
6. (10, 24, 26)
7. (12, 16, 20) - Multiple of (3, 4, 5)
8. (15, 36, 39)
9. (18, 24, 30) - Multiple of (3, 4, 5)
10. (20, 21, 29)

Note: Any multiple of a Pythagorean triple is also a Pythagorean triple.
For example: If (a, b, c) is a triple, then (ka, kb, kc) is also a triple for any positive integer k.`);
}

function showTheorem() {
    alert(`Pythagorean Theorem:

1. Statement:
   In a right triangle, the square of the hypotenuse (c)
   is equal to the sum of squares of the other two sides (a and b).
   
   a² + b² = c²

2. Algebraic Forms:
   • Finding hypotenuse: c = √(a² + b²)
   • Finding leg a: a = √(c² - b²)
   • Finding leg b: b = √(c² - a²)

3. Important Properties:
   • Works only for right triangles
   • Hypotenuse is always the longest side
   • All sides must be positive
   • Converse is also true: if a² + b² = c²,
     then the triangle is right-angled

4. Historical Significance:
   • One of the oldest mathematical theorems
   • Used in ancient architecture and construction
   • Foundation for trigonometry and geometry
   • Applications in modern navigation and engineering`);
}

function clearCalculator() {
    // Clear calculation inputs
    document.getElementById('side-a').value = '';
    document.getElementById('side-b').value = '';
    document.getElementById('side-c').value = '';
    document.getElementById('pythagorean-results').style.display = 'none';
    
    // Clear verification inputs
    document.getElementById('verify-a').value = '';
    document.getElementById('verify-b').value = '';
    document.getElementById('verify-c').value = '';
    document.getElementById('verify-results').style.display = 'none';
    
    // Reset visualization
    drawPythagoreanTriangle();
}
