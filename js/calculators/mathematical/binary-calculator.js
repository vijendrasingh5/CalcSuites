function loadBinaryCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Binary Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Number System Converter -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Number System Converter</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Input Number</label>
                                <input type="text" class="form-control" id="number-input" placeholder="Enter a number">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Input Base</label>
                                <select class="form-select" id="input-base">
                                    <option value="2">Binary (Base-2)</option>
                                    <option value="8">Octal (Base-8)</option>
                                    <option value="10" selected>Decimal (Base-10)</option>
                                    <option value="16">Hexadecimal (Base-16)</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="convertNumber()">Convert</button>
                            </div>
                        </div>
                        
                        <div class="mt-4" id="conversion-results" style="display: none;">
                            <h6>Results:</h6>
                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th>Binary</th>
                                            <td id="binary-result">-</td>
                                        </tr>
                                        <tr>
                                            <th>Octal</th>
                                            <td id="octal-result">-</td>
                                        </tr>
                                        <tr>
                                            <th>Decimal</th>
                                            <td id="decimal-result">-</td>
                                        </tr>
                                        <tr>
                                            <th>Hexadecimal</th>
                                            <td id="hex-result">-</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Binary Operations -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Binary Operations</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-5">
                                <label class="form-label">First Binary Number</label>
                                <input type="text" class="form-control" id="binary-num1" placeholder="Enter binary number">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Operation</label>
                                <select class="form-select" id="binary-operation">
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                    <option value="XOR">XOR</option>
                                    <option value="NOT">NOT</option>
                                </select>
                            </div>
                            <div class="col-md-5" id="second-binary-container">
                                <label class="form-label">Second Binary Number</label>
                                <input type="text" class="form-control" id="binary-num2" placeholder="Enter binary number">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="performBinaryOperation()">Calculate</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="binary-operation-result" style="display: none;">
                                    Result: <span class="result-value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bit Manipulation -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Bit Manipulation</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Binary Number</label>
                                <input type="text" class="form-control" id="bit-manipulation-input" placeholder="Enter binary number">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Operation</label>
                                <select class="form-select" id="bit-operation">
                                    <option value="LEFT">Left Shift</option>
                                    <option value="RIGHT">Right Shift</option>
                                    <option value="ROTATE-LEFT">Rotate Left</option>
                                    <option value="ROTATE-RIGHT">Rotate Right</option>
                                    <option value="COMPLEMENT">One's Complement</option>
                                </select>
                            </div>
                            <div class="col-md-6" id="shift-amount-container">
                                <label class="form-label">Shift Amount</label>
                                <input type="number" class="form-control" id="shift-amount" value="1" min="1">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="performBitManipulation()">Manipulate</button>
                            </div>
                            <div class="col-12">
                                <div class="alert alert-info mb-0" id="bit-manipulation-result" style="display: none;">
                                    Result: <span class="result-value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Panel -->
            <div class="col-md-4">
                <!-- Quick Tools -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Quick Tools</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Byte Calculator</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="byte-input" placeholder="Enter bytes">
                                <button class="btn btn-outline-secondary" onclick="calculateByteUnits()">Convert</button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">ASCII to Binary</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="ascii-input" placeholder="Enter text">
                                <button class="btn btn-outline-secondary" onclick="convertASCIItoBinary()">Convert</button>
                            </div>
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
                            <h6>Binary Operations</h6>
                            <ul class="list-unstyled small text-muted">
                                <li>AND: 1 if both bits are 1</li>
                                <li>OR: 1 if either bit is 1</li>
                                <li>XOR: 1 if bits are different</li>
                                <li>NOT: Inverts all bits</li>
                            </ul>
                        </div>
                        <div class="mb-3">
                            <h6>Common Units</h6>
                            <ul class="list-unstyled small text-muted">
                                <li>8 bits = 1 byte</li>
                                <li>1 KB = 1024 bytes</li>
                                <li>1 MB = 1024 KB</li>
                                <li>1 GB = 1024 MB</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);

    // Add event listener for operation change
    document.getElementById('binary-operation').addEventListener('change', function() {
        const secondInput = document.getElementById('second-binary-container');
        secondInput.style.display = this.value === 'NOT' ? 'none' : 'block';
    });

    // Add event listener for bit operation change
    document.getElementById('bit-operation').addEventListener('change', function() {
        const shiftContainer = document.getElementById('shift-amount-container');
        shiftContainer.style.display = ['LEFT', 'RIGHT', 'ROTATE-LEFT', 'ROTATE-RIGHT'].includes(this.value) ? 'block' : 'none';
    });
}

function convertNumber() {
    const input = document.getElementById('number-input').value.trim();
    const inputBase = parseInt(document.getElementById('input-base').value);
    
    if (!input) {
        alert('Please enter a number');
        return;
    }
    
    try {
        // Convert input to decimal first
        const decimal = parseInt(input, inputBase);
        if (isNaN(decimal)) throw new Error('Invalid number for selected base');
        
        // Convert decimal to other bases
        document.getElementById('conversion-results').style.display = 'block';
        document.getElementById('binary-result').textContent = decimal.toString(2);
        document.getElementById('octal-result').textContent = decimal.toString(8);
        document.getElementById('decimal-result').textContent = decimal.toString(10);
        document.getElementById('hex-result').textContent = decimal.toString(16).toUpperCase();
    } catch (e) {
        alert('Invalid number format for the selected base');
    }
}

function performBinaryOperation() {
    const num1 = document.getElementById('binary-num1').value.trim();
    const operation = document.getElementById('binary-operation').value;
    const num2 = document.getElementById('binary-num2').value.trim();
    
    // Validate binary numbers
    const validateBinary = (num) => /^[01]+$/.test(num);
    
    if (!validateBinary(num1) || (operation !== 'NOT' && !validateBinary(num2))) {
        alert('Please enter valid binary numbers (0s and 1s only)');
        return;
    }
    
    let result;
    const n1 = parseInt(num1, 2);
    const n2 = parseInt(num2, 2);
    
    switch(operation) {
        case 'AND':
            result = (n1 & n2).toString(2);
            break;
        case 'OR':
            result = (n1 | n2).toString(2);
            break;
        case 'XOR':
            result = (n1 ^ n2).toString(2);
            break;
        case 'NOT':
            // Create a mask of 1s the same length as the input
            const mask = parseInt('1'.repeat(num1.length), 2);
            result = ((~n1) & mask).toString(2);
            break;
    }
    
    // Pad result with leading zeros to match input length
    result = result.padStart(Math.max(num1.length, operation !== 'NOT' ? num2.length : 0), '0');
    
    const resultContainer = document.getElementById('binary-operation-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.result-value').textContent = result;
}

function performBitManipulation() {
    const input = document.getElementById('bit-manipulation-input').value.trim();
    const operation = document.getElementById('bit-operation').value;
    const shiftAmount = parseInt(document.getElementById('shift-amount').value);
    
    if (!/^[01]+$/.test(input)) {
        alert('Please enter a valid binary number (0s and 1s only)');
        return;
    }
    
    let result;
    const num = parseInt(input, 2);
    const length = input.length;
    
    switch(operation) {
        case 'LEFT':
            result = (num << shiftAmount).toString(2);
            break;
        case 'RIGHT':
            result = (num >> shiftAmount).toString(2);
            break;
        case 'ROTATE-LEFT':
            result = ((num << shiftAmount) | (num >>> (length - shiftAmount))).toString(2);
            break;
        case 'ROTATE-RIGHT':
            result = ((num >>> shiftAmount) | (num << (length - shiftAmount))).toString(2);
            break;
        case 'COMPLEMENT':
            const mask = parseInt('1'.repeat(length), 2);
            result = ((~num) & mask).toString(2);
            break;
    }
    
    // Pad result with leading zeros
    result = result.padStart(length, '0');
    
    const resultContainer = document.getElementById('bit-manipulation-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.result-value').textContent = result;
}

function calculateByteUnits() {
    const bytes = parseFloat(document.getElementById('byte-input').value);
    
    if (isNaN(bytes) || bytes < 0) {
        alert('Please enter a valid number of bytes');
        return;
    }
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    alert(`${bytes} bytes = ${size.toFixed(2)} ${units[unitIndex]}`);
}

function convertASCIItoBinary() {
    const text = document.getElementById('ascii-input').value;
    
    if (!text) {
        alert('Please enter some text');
        return;
    }
    
    const binary = text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
    
    alert(`Binary representation:\n${binary}`);
}
