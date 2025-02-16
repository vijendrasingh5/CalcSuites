function loadFractionCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Fraction Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <div class="mb-4">
                    <div class="row g-3">
                        <!-- First Fraction -->
                        <div class="col-md-4">
                            <div class="fraction-input">
                                <input type="number" class="form-control mb-2" id="numerator1" placeholder="Numerator">
                                <div class="fraction-line"></div>
                                <input type="number" class="form-control mt-2" id="denominator1" placeholder="Denominator">
                            </div>
                        </div>
                        
                        <!-- Operator -->
                        <div class="col-md-2">
                            <select class="form-select h-100" id="operator">
                                <option value="+">+</option>
                                <option value="-">−</option>
                                <option value="*">×</option>
                                <option value="/">÷</option>
                            </select>
                        </div>
                        
                        <!-- Second Fraction -->
                        <div class="col-md-4">
                            <div class="fraction-input">
                                <input type="number" class="form-control mb-2" id="numerator2" placeholder="Numerator">
                                <div class="fraction-line"></div>
                                <input type="number" class="form-control mt-2" id="denominator2" placeholder="Denominator">
                            </div>
                        </div>
                        
                        <!-- Calculate Button -->
                        <div class="col-md-2">
                            <button class="btn btn-primary h-100" onclick="calculateFraction()">Calculate</button>
                        </div>
                    </div>
                </div>
                
                <!-- Result -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Result</h5>
                        <div class="row align-items-center">
                            <div class="col-md-4">
                                <div class="fraction-result">
                                    <span id="result-fraction">-</span>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="decimal-result">
                                    <span class="text-muted">Decimal: </span>
                                    <span id="result-decimal">-</span>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mixed-number">
                                    <span class="text-muted">Mixed Number: </span>
                                    <span id="result-mixed">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Additional Tools -->
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Simplify Fraction</h5>
                                <div class="row g-2">
                                    <div class="col-5">
                                        <input type="number" class="form-control" id="simplify-numerator" placeholder="Numerator">
                                    </div>
                                    <div class="col-5">
                                        <input type="number" class="form-control" id="simplify-denominator" placeholder="Denominator">
                                    </div>
                                    <div class="col-2">
                                        <button class="btn btn-secondary w-100" onclick="simplifyFraction()">→</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Decimal to Fraction</h5>
                                <div class="row g-2">
                                    <div class="col-10">
                                        <input type="number" class="form-control" id="decimal-input" placeholder="Enter decimal" step="0.000001">
                                    </div>
                                    <div class="col-2">
                                        <button class="btn btn-secondary w-100" onclick="decimalToFraction()">→</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tips and Help -->
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Tips</h5>
                        <ul class="list-unstyled mb-0">
                            <li class="mb-2">• Enter whole numbers as fractions by using 1 as denominator</li>
                            <li class="mb-2">• Simplify your results automatically</li>
                            <li class="mb-2">• Convert decimals to fractions for precise calculations</li>
                            <li class="mb-2">• View results in multiple formats</li>
                            <li>• Use mixed numbers for easier reading</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add custom styles for fraction display
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .fraction-input {
            text-align: center;
        }
        .fraction-line {
            height: 2px;
            background-color: #000;
            margin: 5px 0;
        }
        .fraction-result {
            font-size: 1.5rem;
            font-weight: bold;
        }
    `;
    document.head.appendChild(styleElement);
    
    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);
}

function calculateFraction() {
    const n1 = parseInt(document.getElementById('numerator1').value);
    const d1 = parseInt(document.getElementById('denominator1').value);
    const n2 = parseInt(document.getElementById('numerator2').value);
    const d2 = parseInt(document.getElementById('denominator2').value);
    const operator = document.getElementById('operator').value;
    
    if (!n1 || !d1 || !n2 || !d2) {
        alert('Please fill in all fraction values');
        return;
    }
    
    if (d1 === 0 || d2 === 0) {
        alert('Denominators cannot be zero');
        return;
    }
    
    let resultNum, resultDen;
    
    switch(operator) {
        case '+':
            resultNum = n1 * d2 + n2 * d1;
            resultDen = d1 * d2;
            break;
        case '-':
            resultNum = n1 * d2 - n2 * d1;
            resultDen = d1 * d2;
            break;
        case '*':
            resultNum = n1 * n2;
            resultDen = d1 * d2;
            break;
        case '/':
            if (n2 === 0) {
                alert('Cannot divide by zero');
                return;
            }
            resultNum = n1 * d2;
            resultDen = d1 * n2;
            break;
    }
    
    // Simplify the result
    const gcd = findGCD(Math.abs(resultNum), Math.abs(resultDen));
    resultNum = resultNum / gcd;
    resultDen = resultDen / gcd;
    
    // Handle negative denominators
    if (resultDen < 0) {
        resultNum = -resultNum;
        resultDen = -resultDen;
    }
    
    // Display results
    document.getElementById('result-fraction').textContent = `${resultNum}/${resultDen}`;
    document.getElementById('result-decimal').textContent = (resultNum / resultDen).toFixed(6);
    document.getElementById('result-mixed').textContent = toMixedNumber(resultNum, resultDen);
}

function simplifyFraction() {
    const num = parseInt(document.getElementById('simplify-numerator').value);
    const den = parseInt(document.getElementById('simplify-denominator').value);
    
    if (!num || !den) {
        alert('Please enter both numerator and denominator');
        return;
    }
    
    if (den === 0) {
        alert('Denominator cannot be zero');
        return;
    }
    
    const gcd = findGCD(Math.abs(num), Math.abs(den));
    let simplifiedNum = num / gcd;
    let simplifiedDen = den / gcd;
    
    // Handle negative denominators
    if (simplifiedDen < 0) {
        simplifiedNum = -simplifiedNum;
        simplifiedDen = -simplifiedDen;
    }
    
    document.getElementById('result-fraction').textContent = `${simplifiedNum}/${simplifiedDen}`;
    document.getElementById('result-decimal').textContent = (simplifiedNum / simplifiedDen).toFixed(6);
    document.getElementById('result-mixed').textContent = toMixedNumber(simplifiedNum, simplifiedDen);
}

function decimalToFraction() {
    const decimal = parseFloat(document.getElementById('decimal-input').value);
    
    if (isNaN(decimal)) {
        alert('Please enter a valid decimal number');
        return;
    }
    
    const tolerance = 1.0E-6;
    let h1 = 1;
    let h2 = 0;
    let k1 = 0;
    let k2 = 1;
    let b = decimal;
    
    do {
        let a = Math.floor(b);
        let aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
    
    document.getElementById('result-fraction').textContent = `${h1}/${k1}`;
    document.getElementById('result-decimal').textContent = (h1 / k1).toFixed(6);
    document.getElementById('result-mixed').textContent = toMixedNumber(h1, k1);
}

function findGCD(a, b) {
    return b === 0 ? a : findGCD(b, a % b);
}

function toMixedNumber(num, den) {
    if (den === 0) return 'undefined';
    if (num === 0) return '0';
    
    const whole = Math.floor(Math.abs(num) / Math.abs(den));
    const remainder = Math.abs(num) % Math.abs(den);
    
    if (remainder === 0) return (num < 0 ? '-' : '') + whole.toString();
    if (whole === 0) return `${num}/${den}`;
    
    return `${num < 0 ? '-' : ''}${whole} ${remainder}/${Math.abs(den)}`;
}
