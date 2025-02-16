function loadAreaCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Area Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="mb-3">
                    <label class="form-label">Select Shape</label>
                    <select class="form-select" id="shape-select" onchange="updateAreaInputs()">
                        <option value="rectangle">Rectangle</option>
                        <option value="circle">Circle</option>
                        <option value="triangle">Triangle</option>
                        <option value="trapezoid">Trapezoid</option>
                        <option value="ellipse">Ellipse</option>
                        <option value="parallelogram">Parallelogram</option>
                        <option value="regular-polygon">Regular Polygon</option>
                    </select>
                </div>
                
                <div id="shape-inputs">
                    <!-- Dynamic inputs will be added here -->
                </div>
                
                <div class="mb-3">
                    <button class="btn btn-primary" onclick="calculateArea()">Calculate Area</button>
                </div>
            </div>
            
            <div class="col-md-8">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body text-center">
                                <h5 class="card-title">Area</h5>
                                <p class="display-4" id="area-result">-</p>
                                <p class="text-muted" id="area-unit">square units</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Shape Preview</h5>
                                <canvas id="shape-preview" width="200" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Formula</h5>
                        <p id="area-formula" class="mb-0">-</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);
    
    // Initialize with rectangle inputs
    updateAreaInputs();
}

function updateAreaInputs() {
    const shape = document.getElementById('shape-select').value;
    const inputsContainer = document.getElementById('shape-inputs');
    let inputsHTML = '';
    
    switch(shape) {
        case 'rectangle':
            inputsHTML = `
                <div class="mb-3">
                    <label class="form-label">Length</label>
                    <input type="number" class="form-control" id="length" step="0.1" min="0">
                </div>
                <div class="mb-3">
                    <label class="form-label">Width</label>
                    <input type="number" class="form-control" id="width" step="0.1" min="0">
                </div>
            `;
            updateFormula('A = l × w');
            break;
            
        case 'circle':
            inputsHTML = `
                <div class="mb-3">
                    <label class="form-label">Radius</label>
                    <input type="number" class="form-control" id="radius" step="0.1" min="0">
                </div>
            `;
            updateFormula('A = πr²');
            break;
            
        case 'triangle':
            inputsHTML = `
                <div class="mb-3">
                    <label class="form-label">Base</label>
                    <input type="number" class="form-control" id="base" step="0.1" min="0">
                </div>
                <div class="mb-3">
                    <label class="form-label">Height</label>
                    <input type="number" class="form-control" id="height" step="0.1" min="0">
                </div>
            `;
            updateFormula('A = ½ × b × h');
            break;
            
        case 'trapezoid':
            inputsHTML = `
                <div class="mb-3">
                    <label class="form-label">Top Base (a)</label>
                    <input type="number" class="form-control" id="top-base" step="0.1" min="0">
                </div>
                <div class="mb-3">
                    <label class="form-label">Bottom Base (b)</label>
                    <input type="number" class="form-control" id="bottom-base" step="0.1" min="0">
                </div>
                <div class="mb-3">
                    <label class="form-label">Height</label>
                    <input type="number" class="form-control" id="height" step="0.1" min="0">
                </div>
            `;
            updateFormula('A = ½(a + b)h');
            break;
            
        case 'ellipse':
            inputsHTML = `
                <div class="mb-3">
                    <label class="form-label">Semi-major Axis (a)</label>
                    <input type="number" class="form-control" id="semi-major" step="0.1" min="0">
                </div>
                <div class="mb-3">
                    <label class="form-label">Semi-minor Axis (b)</label>
                    <input type="number" class="form-control" id="semi-minor" step="0.1" min="0">
                </div>
            `;
            updateFormula('A = πab');
            break;
            
        case 'parallelogram':
            inputsHTML = `
                <div class="mb-3">
                    <label class="form-label">Base</label>
                    <input type="number" class="form-control" id="base" step="0.1" min="0">
                </div>
                <div class="mb-3">
                    <label class="form-label">Height</label>
                    <input type="number" class="form-control" id="height" step="0.1" min="0">
                </div>
            `;
            updateFormula('A = b × h');
            break;
            
        case 'regular-polygon':
            inputsHTML = `
                <div class="mb-3">
                    <label class="form-label">Number of Sides</label>
                    <input type="number" class="form-control" id="sides" step="1" min="3">
                </div>
                <div class="mb-3">
                    <label class="form-label">Side Length</label>
                    <input type="number" class="form-control" id="side-length" step="0.1" min="0">
                </div>
            `;
            updateFormula('A = (n × s²) / (4 × tan(π/n))');
            break;
    }
    
    inputsContainer.innerHTML = inputsHTML;
    drawShapePreview();
}

function calculateArea() {
    const shape = document.getElementById('shape-select').value;
    let area = 0;
    
    try {
        switch(shape) {
            case 'rectangle':
                const length = parseFloat(document.getElementById('length').value);
                const width = parseFloat(document.getElementById('width').value);
                area = length * width;
                break;
                
            case 'circle':
                const radius = parseFloat(document.getElementById('radius').value);
                area = Math.PI * radius * radius;
                break;
                
            case 'triangle':
                const base = parseFloat(document.getElementById('base').value);
                const height = parseFloat(document.getElementById('height').value);
                area = 0.5 * base * height;
                break;
                
            case 'trapezoid':
                const a = parseFloat(document.getElementById('top-base').value);
                const b = parseFloat(document.getElementById('bottom-base').value);
                const h = parseFloat(document.getElementById('height').value);
                area = 0.5 * (a + b) * h;
                break;
                
            case 'ellipse':
                const semiMajor = parseFloat(document.getElementById('semi-major').value);
                const semiMinor = parseFloat(document.getElementById('semi-minor').value);
                area = Math.PI * semiMajor * semiMinor;
                break;
                
            case 'parallelogram':
                const pBase = parseFloat(document.getElementById('base').value);
                const pHeight = parseFloat(document.getElementById('height').value);
                area = pBase * pHeight;
                break;
                
            case 'regular-polygon':
                const n = parseInt(document.getElementById('sides').value);
                const s = parseFloat(document.getElementById('side-length').value);
                area = (n * s * s) / (4 * Math.tan(Math.PI / n));
                break;
        }
        
        document.getElementById('area-result').textContent = area.toFixed(2);
        drawShapePreview();
        
    } catch(e) {
        alert('Please fill in all required measurements');
    }
}

function updateFormula(formula) {
    document.getElementById('area-formula').textContent = formula;
}

function drawShapePreview() {
    const canvas = document.getElementById('shape-preview');
    const ctx = canvas.getContext('2d');
    const shape = document.getElementById('shape-select').value;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set drawing styles
    ctx.strokeStyle = '#007bff';
    ctx.fillStyle = '#007bff20';
    ctx.lineWidth = 2;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 80; // Base size for shapes
    
    ctx.beginPath();
    
    switch(shape) {
        case 'rectangle':
            ctx.rect(centerX - size, centerY - size/2, size*2, size);
            break;
            
        case 'circle':
            ctx.arc(centerX, centerY, size, 0, 2 * Math.PI);
            break;
            
        case 'triangle':
            ctx.moveTo(centerX - size, centerY + size/2);
            ctx.lineTo(centerX + size, centerY + size/2);
            ctx.lineTo(centerX, centerY - size);
            ctx.closePath();
            break;
            
        case 'trapezoid':
            ctx.moveTo(centerX - size/2, centerY - size/2);
            ctx.lineTo(centerX + size/2, centerY - size/2);
            ctx.lineTo(centerX + size, centerY + size/2);
            ctx.lineTo(centerX - size, centerY + size/2);
            ctx.closePath();
            break;
            
        case 'ellipse':
            ctx.ellipse(centerX, centerY, size, size/2, 0, 0, 2 * Math.PI);
            break;
            
        case 'parallelogram':
            ctx.moveTo(centerX - size + 20, centerY - size/2);
            ctx.lineTo(centerX + size, centerY - size/2);
            ctx.lineTo(centerX + size - 20, centerY + size/2);
            ctx.lineTo(centerX - size, centerY + size/2);
            ctx.closePath();
            break;
            
        case 'regular-polygon':
            const sides = parseInt(document.getElementById('sides')?.value) || 6;
            for (let i = 0; i < sides; i++) {
                const angle = (i * 2 * Math.PI / sides) - Math.PI/2;
                const x = centerX + size * Math.cos(angle);
                const y = centerY + size * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            break;
    }
    
    ctx.fill();
    ctx.stroke();
}
