function loadVolumeCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Volume Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="mb-0">Shape Selection</h5>
                    </div>
                    <div class="card-body">
                        <select class="form-select mb-3" id="shape-select" onchange="updateVolumeInputs()">
                            <option value="cube">Cube</option>
                            <option value="rectangular-prism">Rectangular Prism</option>
                            <option value="cylinder">Cylinder</option>
                            <option value="sphere">Sphere</option>
                            <option value="cone">Cone</option>
                        </select>
                        
                        <div id="volume-inputs">
                            <!-- Input fields will be dynamically updated based on shape selection -->
                        </div>
                        
                        <button class="btn btn-primary mt-3" onclick="calculateVolume()">Calculate</button>
                        <button class="btn btn-secondary mt-3" onclick="clearVolumeCalculator()">Clear</button>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Result</h5>
                    </div>
                    <div class="card-body">
                        <div id="volume-result">
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
    updateVolumeInputs();
}

function updateVolumeInputs() {
    const shape = document.getElementById('shape-select').value;
    const inputsContainer = document.getElementById('volume-inputs');
    
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

function calculateVolume() {
    const shape = document.getElementById('shape-select').value;
    const resultContainer = document.getElementById('volume-result');
    let volume = 0;
    let formula = '';
    let values = '';
    
    try {
        switch(shape) {
            case 'cube':
                const side = validateNumber(document.getElementById('cube-side').value);
                volume = Math.pow(side, 3);
                formula = 'V = s³';
                values = `s = ${side}`;
                break;
                
            case 'rectangular-prism':
                const length = validateNumber(document.getElementById('rect-length').value);
                const width = validateNumber(document.getElementById('rect-width').value);
                const height = validateNumber(document.getElementById('rect-height').value);
                volume = length * width * height;
                formula = 'V = l × w × h';
                values = `l = ${length}, w = ${width}, h = ${height}`;
                break;
                
            case 'cylinder':
                const radius = validateNumber(document.getElementById('cylinder-radius').value);
                const cylHeight = validateNumber(document.getElementById('cylinder-height').value);
                volume = Math.PI * Math.pow(radius, 2) * cylHeight;
                formula = 'V = πr²h';
                values = `r = ${radius}, h = ${cylHeight}`;
                break;
                
            case 'sphere':
                const sphereRadius = validateNumber(document.getElementById('sphere-radius').value);
                volume = (4/3) * Math.PI * Math.pow(sphereRadius, 3);
                formula = 'V = (4/3)πr³';
                values = `r = ${sphereRadius}`;
                break;
                
            case 'cone':
                const coneRadius = validateNumber(document.getElementById('cone-radius').value);
                const coneHeight = validateNumber(document.getElementById('cone-height').value);
                volume = (1/3) * Math.PI * Math.pow(coneRadius, 2) * coneHeight;
                formula = 'V = (1/3)πr²h';
                values = `r = ${coneRadius}, h = ${coneHeight}`;
                break;
        }
        
        resultContainer.innerHTML = `
            <div class="alert alert-success">
                <h6>Volume: ${formatNumber(volume)} cubic units</h6>
                <hr>
                <p class="mb-0"><strong>Formula:</strong> ${formula}</p>
                <p class="mb-0"><strong>Values:</strong> ${values}</p>
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

function clearVolumeCalculator() {
    document.getElementById('volume-inputs').querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    document.getElementById('volume-result').innerHTML = '';
}
