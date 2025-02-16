function loadSurfaceAreaCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Surface Area Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="mb-0">Shape Selection</h5>
                    </div>
                    <div class="card-body">
                        <select class="form-select mb-3" id="shape-select" onchange="updateSurfaceAreaInputs()">
                            <option value="cube">Cube</option>
                            <option value="rectangular-prism">Rectangular Prism</option>
                            <option value="cylinder">Cylinder</option>
                            <option value="sphere">Sphere</option>
                            <option value="cone">Cone</option>
                        </select>
                        
                        <div id="surface-area-inputs">
                            <!-- Input fields will be dynamically updated based on shape selection -->
                        </div>
                        
                        <button class="btn btn-primary mt-3" onclick="calculateSurfaceArea()">Calculate</button>
                        <button class="btn btn-secondary mt-3" onclick="clearSurfaceAreaCalculator()">Clear</button>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Result</h5>
                    </div>
                    <div class="card-body">
                        <div id="surface-area-result">
                            <!-- Results will be shown here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML = calculatorHTML;
    container.appendChild(card);
    
    // Initialize the input fields
    updateSurfaceAreaInputs();
}

function updateSurfaceAreaInputs() {
    const shape = document.getElementById('shape-select').value;
    const inputsContainer = document.getElementById('surface-area-inputs');
    
    let inputsHTML = '';
    
    switch(shape) {
        case 'cube':
            inputsHTML = `
                <div class="mb-3">
                    <label for="cube-side" class="form-label">Side Length</label>
                    <input type="number" class="form-control" id="cube-side" step="any" min="0">
                </div>
            `;
            break;
            
        case 'rectangular-prism':
            inputsHTML = `
                <div class="mb-3">
                    <label for="rect-length" class="form-label">Length</label>
                    <input type="number" class="form-control" id="rect-length" step="any" min="0">
                </div>
                <div class="mb-3">
                    <label for="rect-width" class="form-label">Width</label>
                    <input type="number" class="form-control" id="rect-width" step="any" min="0">
                </div>
                <div class="mb-3">
                    <label for="rect-height" class="form-label">Height</label>
                    <input type="number" class="form-control" id="rect-height" step="any" min="0">
                </div>
            `;
            break;
            
        case 'cylinder':
            inputsHTML = `
                <div class="mb-3">
                    <label for="cylinder-radius" class="form-label">Radius</label>
                    <input type="number" class="form-control" id="cylinder-radius" step="any" min="0">
                </div>
                <div class="mb-3">
                    <label for="cylinder-height" class="form-label">Height</label>
                    <input type="number" class="form-control" id="cylinder-height" step="any" min="0">
                </div>
            `;
            break;
            
        case 'sphere':
            inputsHTML = `
                <div class="mb-3">
                    <label for="sphere-radius" class="form-label">Radius</label>
                    <input type="number" class="form-control" id="sphere-radius" step="any" min="0">
                </div>
            `;
            break;
            
        case 'cone':
            inputsHTML = `
                <div class="mb-3">
                    <label for="cone-radius" class="form-label">Radius</label>
                    <input type="number" class="form-control" id="cone-radius" step="any" min="0">
                </div>
                <div class="mb-3">
                    <label for="cone-height" class="form-label">Height</label>
                    <input type="number" class="form-control" id="cone-height" step="any" min="0">
                </div>
            `;
            break;
    }
    
    inputsContainer.innerHTML = inputsHTML;
}

function calculateSurfaceArea() {
    const shape = document.getElementById('shape-select').value;
    const resultContainer = document.getElementById('surface-area-result');
    let surfaceArea = 0;
    let formula = '';
    let values = '';
    let calculation = '';
    
    try {
        switch(shape) {
            case 'cube':
                const side = validateNumber(document.getElementById('cube-side').value);
                surfaceArea = 6 * Math.pow(side, 2);
                formula = 'SA = 6s²';
                values = `s = ${side}`;
                calculation = `SA = 6 × ${side}² = 6 × ${Math.pow(side, 2)} = ${surfaceArea}`;
                break;
                
            case 'rectangular-prism':
                const length = validateNumber(document.getElementById('rect-length').value);
                const width = validateNumber(document.getElementById('rect-width').value);
                const height = validateNumber(document.getElementById('rect-height').value);
                surfaceArea = 2 * (length * width + length * height + width * height);
                formula = 'SA = 2(lw + lh + wh)';
                values = `l = ${length}, w = ${width}, h = ${height}`;
                calculation = `SA = 2(${length}×${width} + ${length}×${height} + ${width}×${height})
                           = 2(${length*width} + ${length*height} + ${width*height})
                           = 2 × ${length*width + length*height + width*height}
                           = ${surfaceArea}`;
                break;
                
            case 'cylinder':
                const radius = validateNumber(document.getElementById('cylinder-radius').value);
                const cylHeight = validateNumber(document.getElementById('cylinder-height').value);
                surfaceArea = 2 * Math.PI * radius * (radius + cylHeight);
                formula = 'SA = 2πr(r + h)';
                values = `r = ${radius}, h = ${cylHeight}`;
                calculation = `SA = 2π × ${radius} × (${radius} + ${cylHeight})
                           = 2π × ${radius} × ${radius + cylHeight}
                           = ${surfaceArea}`;
                break;
                
            case 'sphere':
                const sphereRadius = validateNumber(document.getElementById('sphere-radius').value);
                surfaceArea = 4 * Math.PI * Math.pow(sphereRadius, 2);
                formula = 'SA = 4πr²';
                values = `r = ${sphereRadius}`;
                calculation = `SA = 4π × ${sphereRadius}²
                           = 4π × ${Math.pow(sphereRadius, 2)}
                           = ${surfaceArea}`;
                break;
                
            case 'cone':
                const coneRadius = validateNumber(document.getElementById('cone-radius').value);
                const coneHeight = validateNumber(document.getElementById('cone-height').value);
                const slantHeight = Math.sqrt(Math.pow(coneRadius, 2) + Math.pow(coneHeight, 2));
                surfaceArea = Math.PI * coneRadius * (coneRadius + slantHeight);
                formula = 'SA = πr(r + √(r² + h²))';
                values = `r = ${coneRadius}, h = ${coneHeight}`;
                calculation = `SA = π × ${coneRadius} × (${coneRadius} + √(${coneRadius}² + ${coneHeight}²))
                           = π × ${coneRadius} × (${coneRadius} + √(${Math.pow(coneRadius, 2)} + ${Math.pow(coneHeight, 2)}))
                           = π × ${coneRadius} × (${coneRadius} + ${slantHeight})
                           = ${surfaceArea}`;
                break;
        }
        
        resultContainer.innerHTML = `
            <div class="alert alert-success">
                <h6>Surface Area: ${formatNumber(surfaceArea)} square units</h6>
                <hr>
                <p class="mb-0"><strong>Formula:</strong> ${formula}</p>
                <p class="mb-0"><strong>Values:</strong> ${values}</p>
                <p class="mb-0"><strong>Calculation:</strong></p>
                <p class="mb-0">${calculation}</p>
            </div>
        `;
    } catch (error) {
        resultContainer.innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;
    }
}

function clearSurfaceAreaCalculator() {
    document.getElementById('surface-area-inputs').querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    document.getElementById('surface-area-result').innerHTML = '';
}
