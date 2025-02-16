function loadDistanceCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Distance Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="mb-0">Distance Between Two Points</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <h6>Point 1</h6>
                            <div class="row">
                                <div class="col">
                                    <label for="x1" class="form-label">X₁</label>
                                    <input type="number" class="form-control" id="x1" step="any">
                                </div>
                                <div class="col">
                                    <label for="y1" class="form-label">Y₁</label>
                                    <input type="number" class="form-control" id="y1" step="any">
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <h6>Point 2</h6>
                            <div class="row">
                                <div class="col">
                                    <label for="x2" class="form-label">X₂</label>
                                    <input type="number" class="form-control" id="x2" step="any">
                                </div>
                                <div class="col">
                                    <label for="y2" class="form-label">Y₂</label>
                                    <input type="number" class="form-control" id="y2" step="any">
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" onclick="calculateDistance()">Calculate Distance</button>
                            <button class="btn btn-secondary" onclick="clearDistanceCalculator()">Clear</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Result</h5>
                    </div>
                    <div class="card-body">
                        <div id="distance-result">
                            <!-- Results will be shown here -->
                        </div>
                    </div>
                </div>
                
                <div class="card mt-3">
                    <div class="card-header">
                        <h5 class="mb-0">Visual Representation</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="distance-plot" width="400" height="400"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML = calculatorHTML;
    container.appendChild(card);
    
    // Initialize the plot
    drawDistancePlot();
}

function calculateDistance() {
    try {
        // Get input values
        const x1 = validateNumber(document.getElementById('x1').value);
        const y1 = validateNumber(document.getElementById('y1').value);
        const x2 = validateNumber(document.getElementById('x2').value);
        const y2 = validateNumber(document.getElementById('y2').value);
        
        // Calculate distance using the distance formula
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        
        // Display result
        const resultContainer = document.getElementById('distance-result');
        resultContainer.innerHTML = `
            <div class="alert alert-success">
                <h6>Distance: ${formatNumber(distance)} units</h6>
                <hr>
                <p class="mb-0"><strong>Formula:</strong> d = √[(x₂ - x₁)² + (y₂ - y₁)²]</p>
                <p class="mb-0"><strong>Calculation:</strong></p>
                <p class="mb-0">d = √[(${x2} - ${x1})² + (${y2} - ${y1})²]</p>
                <p class="mb-0">d = √[${deltaX}² + ${deltaY}²]</p>
                <p class="mb-0">d = √[${Math.pow(deltaX, 2)} + ${Math.pow(deltaY, 2)}]</p>
                <p class="mb-0">d = √${Math.pow(deltaX, 2) + Math.pow(deltaY, 2)}</p>
                <p class="mb-0">d = ${formatNumber(distance)}</p>
            </div>
        `;
        
        // Update the plot
        drawDistancePlot(x1, y1, x2, y2);
        
    } catch (error) {
        document.getElementById('distance-result').innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;
    }
}

function drawDistancePlot(x1 = 0, y1 = 0, x2 = 1, y2 = 1) {
    const canvas = document.getElementById('distance-plot');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate plot bounds
    const points = [[x1, y1], [x2, y2]];
    const xValues = points.map(p => p[0]);
    const yValues = points.map(p => p[1]);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    // Add some padding to the bounds
    const xRange = Math.max(1, xMax - xMin) * 1.2;
    const yRange = Math.max(1, yMax - yMin) * 1.2;
    const xCenter = (xMax + xMin) / 2;
    const yCenter = (yMax + yMin) / 2;
    
    // Scale factors
    const xScale = (width - 2 * padding) / xRange;
    const yScale = (height - 2 * padding) / yRange;
    
    // Transform coordinates
    function transformX(x) {
        return padding + (x - (xCenter - xRange/2)) * xScale;
    }
    
    function transformY(y) {
        return height - (padding + (y - (yCenter - yRange/2)) * yScale);
    }
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Draw grid
    ctx.strokeStyle = '#eee';
    ctx.beginPath();
    for(let x = Math.floor(xCenter - xRange/2); x <= Math.ceil(xCenter + xRange/2); x++) {
        const screenX = transformX(x);
        ctx.moveTo(screenX, padding);
        ctx.lineTo(screenX, height - padding);
    }
    for(let y = Math.floor(yCenter - yRange/2); y <= Math.ceil(yCenter + yRange/2); y++) {
        const screenY = transformY(y);
        ctx.moveTo(padding, screenY);
        ctx.lineTo(width - padding, screenY);
    }
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#007bff';
    const pointRadius = 5;
    const x1Screen = transformX(x1);
    const y1Screen = transformY(y1);
    const x2Screen = transformX(x2);
    const y2Screen = transformY(y2);
    
    ctx.beginPath();
    ctx.arc(x1Screen, y1Screen, pointRadius, 0, 2 * Math.PI);
    ctx.arc(x2Screen, y2Screen, pointRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw line between points
    ctx.beginPath();
    ctx.strokeStyle = '#007bff';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x1Screen, y1Screen);
    ctx.lineTo(x2Screen, y2Screen);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Label points
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText(`P₁(${formatNumber(x1)}, ${formatNumber(y1)})`, x1Screen + 10, y1Screen - 10);
    ctx.fillText(`P₂(${formatNumber(x2)}, ${formatNumber(y2)})`, x2Screen + 10, y2Screen - 10);
}

function clearDistanceCalculator() {
    // Clear inputs
    document.getElementById('x1').value = '';
    document.getElementById('y1').value = '';
    document.getElementById('x2').value = '';
    document.getElementById('y2').value = '';
    
    // Clear result
    document.getElementById('distance-result').innerHTML = '';
    
    // Reset plot
    drawDistancePlot();
}
