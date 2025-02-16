function loadMatrixCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Matrix Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Matrix Input Section -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Matrix Operations</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <!-- Matrix A -->
                            <div class="col-md-5">
                                <label class="form-label">Matrix A</label>
                                <div class="mb-2">
                                    <div class="input-group">
                                        <span class="input-group-text">Rows</span>
                                        <input type="number" class="form-control" id="matrix-a-rows" value="2" min="1" max="5">
                                        <span class="input-group-text">Columns</span>
                                        <input type="number" class="form-control" id="matrix-a-cols" value="2" min="1" max="5">
                                    </div>
                                </div>
                                <div id="matrix-a-container" class="matrix-container"></div>
                            </div>

                            <!-- Operation -->
                            <div class="col-md-2">
                                <label class="form-label">Operation</label>
                                <select class="form-select" id="matrix-operation">
                                    <option value="add">Add (+)</option>
                                    <option value="subtract">Subtract (-)</option>
                                    <option value="multiply">Multiply (×)</option>
                                    <option value="determinant">Determinant</option>
                                    <option value="transpose">Transpose</option>
                                    <option value="inverse">Inverse</option>
                                </select>
                            </div>

                            <!-- Matrix B -->
                            <div class="col-md-5" id="matrix-b-section">
                                <label class="form-label">Matrix B</label>
                                <div class="mb-2">
                                    <div class="input-group">
                                        <span class="input-group-text">Rows</span>
                                        <input type="number" class="form-control" id="matrix-b-rows" value="2" min="1" max="5">
                                        <span class="input-group-text">Columns</span>
                                        <input type="number" class="form-control" id="matrix-b-cols" value="2" min="1" max="5">
                                    </div>
                                </div>
                                <div id="matrix-b-container" class="matrix-container"></div>
                            </div>

                            <!-- Calculate Button -->
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="calculateMatrix()">Calculate</button>
                            </div>

                            <!-- Result -->
                            <div class="col-12">
                                <div id="matrix-result" style="display: none;">
                                    <h6>Result:</h6>
                                    <div id="result-container" class="matrix-container"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Matrix Properties -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Matrix Properties</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <select class="form-select" id="matrix-select">
                                    <option value="A">Matrix A</option>
                                    <option value="B">Matrix B</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <button class="btn btn-secondary w-100" onclick="calculateProperties()">Calculate Properties</button>
                            </div>
                            <div class="col-12">
                                <div id="properties-result" style="display: none;">
                                    <div class="table-responsive">
                                        <table class="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <th>Rank</th>
                                                    <td id="matrix-rank">-</td>
                                                </tr>
                                                <tr>
                                                    <th>Trace</th>
                                                    <td id="matrix-trace">-</td>
                                                </tr>
                                                <tr>
                                                    <th>Type</th>
                                                    <td id="matrix-type">-</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tools and Info -->
            <div class="col-md-4">
                <!-- Quick Tools -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Quick Tools</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-secondary" onclick="createIdentityMatrix()">Create Identity Matrix</button>
                            <button class="btn btn-outline-secondary" onclick="createZeroMatrix()">Create Zero Matrix</button>
                            <button class="btn btn-outline-secondary" onclick="transposeMatrix()">Quick Transpose</button>
                        </div>
                    </div>
                </div>

                <!-- Information -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Matrix Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <h6>Matrix Types</h6>
                            <ul class="list-unstyled small text-muted">
                                <li>• Square Matrix: Rows = Columns</li>
                                <li>• Identity Matrix: 1's on diagonal, 0's elsewhere</li>
                                <li>• Symmetric Matrix: Equal to its transpose</li>
                                <li>• Triangular Matrix: All zeros above/below diagonal</li>
                            </ul>
                        </div>
                        <div class="mb-3">
                            <h6>Properties</h6>
                            <ul class="list-unstyled small text-muted">
                                <li>• Trace: Sum of diagonal elements</li>
                                <li>• Rank: Number of linearly independent rows/columns</li>
                                <li>• Determinant: Scalar value of square matrix</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add custom styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .matrix-container {
            display: inline-block;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .matrix-row {
            display: flex;
            gap: 5px;
            margin-bottom: 5px;
        }
        .matrix-row:last-child {
            margin-bottom: 0;
        }
        .matrix-cell {
            width: 60px;
        }
        .matrix-cell input {
            width: 100%;
            padding: 4px;
            text-align: center;
            border: 1px solid #dee2e6;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(styleElement);

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Initialize matrix inputs
    createMatrixInputs('A');
    createMatrixInputs('B');

    // Add event listeners for matrix dimension changes
    ['a', 'b'].forEach(matrix => {
        document.getElementById(`matrix-${matrix}-rows`).addEventListener('change', () => createMatrixInputs(matrix.toUpperCase()));
        document.getElementById(`matrix-${matrix}-cols`).addEventListener('change', () => createMatrixInputs(matrix.toUpperCase()));
    });

    // Add event listener for operation change
    document.getElementById('matrix-operation').addEventListener('change', function() {
        const matrixB = document.getElementById('matrix-b-section');
        matrixB.style.display = ['determinant', 'transpose', 'inverse'].includes(this.value) ? 'none' : 'block';
    });
}

function createMatrixInputs(matrix) {
    const rows = parseInt(document.getElementById(`matrix-${matrix.toLowerCase()}-rows`).value);
    const cols = parseInt(document.getElementById(`matrix-${matrix.toLowerCase()}-cols`).value);
    const container = document.getElementById(`matrix-${matrix.toLowerCase()}-container`);
    
    let html = '';
    for (let i = 0; i < rows; i++) {
        html += '<div class="matrix-row">';
        for (let j = 0; j < cols; j++) {
            html += `
                <div class="matrix-cell">
                    <input type="number" step="any" value="0" 
                           id="matrix-${matrix.toLowerCase()}-${i}-${j}">
                </div>`;
        }
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function getMatrixValues(matrix) {
    const rows = parseInt(document.getElementById(`matrix-${matrix.toLowerCase()}-rows`).value);
    const cols = parseInt(document.getElementById(`matrix-${matrix.toLowerCase()}-cols`).value);
    const values = [];
    
    for (let i = 0; i < rows; i++) {
        values[i] = [];
        for (let j = 0; j < cols; j++) {
            values[i][j] = parseFloat(document.getElementById(`matrix-${matrix.toLowerCase()}-${i}-${j}`).value);
        }
    }
    
    return values;
}

function displayResult(result) {
    const container = document.getElementById('result-container');
    const resultDiv = document.getElementById('matrix-result');
    resultDiv.style.display = 'block';
    
    if (typeof result === 'number') {
        container.innerHTML = `<div class="h4 text-center">${result}</div>`;
        return;
    }
    
    let html = '';
    for (let i = 0; i < result.length; i++) {
        html += '<div class="matrix-row">';
        for (let j = 0; j < result[i].length; j++) {
            html += `
                <div class="matrix-cell">
                    <input type="number" value="${result[i][j].toFixed(2)}" readonly>
                </div>`;
        }
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function calculateMatrix() {
    const operation = document.getElementById('matrix-operation').value;
    const matrixA = getMatrixValues('A');
    let result;
    
    try {
        switch(operation) {
            case 'determinant':
                if (matrixA.length !== matrixA[0].length) {
                    throw new Error('Matrix must be square for determinant');
                }
                result = calculateDeterminant(matrixA);
                break;
                
            case 'transpose':
                result = transposeMatrix(matrixA);
                break;
                
            case 'inverse':
                if (matrixA.length !== matrixA[0].length) {
                    throw new Error('Matrix must be square for inverse');
                }
                const det = calculateDeterminant(matrixA);
                if (det === 0) {
                    throw new Error('Matrix is not invertible (determinant = 0)');
                }
                result = calculateInverse(matrixA);
                break;
                
            default:
                const matrixB = getMatrixValues('B');
                if (operation === 'add' || operation === 'subtract') {
                    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
                        throw new Error('Matrices must have same dimensions for addition/subtraction');
                    }
                    result = operation === 'add' ? addMatrices(matrixA, matrixB) : subtractMatrices(matrixA, matrixB);
                } else if (operation === 'multiply') {
                    if (matrixA[0].length !== matrixB.length) {
                        throw new Error('Number of columns in first matrix must equal number of rows in second matrix');
                    }
                    result = multiplyMatrices(matrixA, matrixB);
                }
        }
        
        displayResult(result);
    } catch (e) {
        alert(e.message);
    }
}

function calculateDeterminant(matrix) {
    if (matrix.length === 1) return matrix[0][0];
    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
        det += Math.pow(-1, i) * matrix[0][i] * calculateDeterminant(getMinor(matrix, 0, i));
    }
    return det;
}

function getMinor(matrix, row, col) {
    return matrix
        .filter((_, index) => index !== row)
        .map(row => row.filter((_, index) => index !== col));
}

function transposeMatrix(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function calculateInverse(matrix) {
    const det = calculateDeterminant(matrix);
    const cofactors = [];
    
    for (let i = 0; i < matrix.length; i++) {
        cofactors[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            const minor = getMinor(matrix, i, j);
            cofactors[i][j] = Math.pow(-1, i + j) * calculateDeterminant(minor) / det;
        }
    }
    
    return transposeMatrix(cofactors);
}

function addMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

function subtractMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

function multiplyMatrices(a, b) {
    return a.map(row => {
        return b[0].map((_, j) => {
            return row.reduce((sum, val, i) => sum + val * b[i][j], 0);
        });
    });
}

function calculateProperties() {
    const matrix = document.getElementById('matrix-select').value;
    const values = getMatrixValues(matrix);
    const rows = values.length;
    const cols = values[0].length;
    
    // Calculate rank (simplified)
    let rank = Math.min(rows, cols);
    
    // Calculate trace
    let trace = 0;
    const minDim = Math.min(rows, cols);
    for (let i = 0; i < minDim; i++) {
        trace += values[i][i];
    }
    
    // Determine matrix type
    let type = [];
    if (rows === cols) {
        type.push('Square');
        
        // Check if identity
        let isIdentity = true;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if ((i === j && values[i][j] !== 1) || (i !== j && values[i][j] !== 0)) {
                    isIdentity = false;
                    break;
                }
            }
        }
        if (isIdentity) type.push('Identity');
        
        // Check if symmetric
        let isSymmetric = true;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < i; j++) {
                if (values[i][j] !== values[j][i]) {
                    isSymmetric = false;
                    break;
                }
            }
        }
        if (isSymmetric) type.push('Symmetric');
    }
    
    document.getElementById('properties-result').style.display = 'block';
    document.getElementById('matrix-rank').textContent = rank;
    document.getElementById('matrix-trace').textContent = trace;
    document.getElementById('matrix-type').textContent = type.join(', ') || 'Rectangular';
}

function createIdentityMatrix() {
    const size = prompt('Enter size of identity matrix (1-5):', '3');
    if (size && !isNaN(size) && size > 0 && size <= 5) {
        document.getElementById('matrix-a-rows').value = size;
        document.getElementById('matrix-a-cols').value = size;
        createMatrixInputs('A');
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                document.getElementById(`matrix-a-${i}-${j}`).value = i === j ? 1 : 0;
            }
        }
    }
}

function createZeroMatrix() {
    const rows = document.getElementById('matrix-a-rows').value;
    const cols = document.getElementById('matrix-a-cols').value;
    createMatrixInputs('A');
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            document.getElementById(`matrix-a-${i}-${j}`).value = 0;
        }
    }
}

function transposeMatrix() {
    const matrix = document.getElementById('matrix-select').value;
    const values = getMatrixValues(matrix);
    const transposed = transposeMatrix(values);
    
    // Update dimensions
    document.getElementById(`matrix-${matrix.toLowerCase()}-rows`).value = transposed.length;
    document.getElementById(`matrix-${matrix.toLowerCase()}-cols`).value = transposed[0].length;
    
    // Recreate matrix and fill values
    createMatrixInputs(matrix);
    for (let i = 0; i < transposed.length; i++) {
        for (let j = 0; j < transposed[0].length; j++) {
            document.getElementById(`matrix-${matrix.toLowerCase()}-${i}-${j}`).value = transposed[i][j];
        }
    }
}
