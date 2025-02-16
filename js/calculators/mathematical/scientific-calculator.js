function loadScientificCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Scientific Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-12 mb-3">
                <input type="text" class="form-control form-control-lg text-end" id="display" readonly>
            </div>
            <div class="col-12">
                <div class="row g-2">
                    <!-- Memory and Clear buttons -->
                    <div class="col-3"><button class="btn btn-secondary w-100" onclick="scientificMemoryClear()">MC</button></div>
                    <div class="col-3"><button class="btn btn-secondary w-100" onclick="scientificMemoryRecall()">MR</button></div>
                    <div class="col-3"><button class="btn btn-secondary w-100" onclick="scientificMemoryAdd()">M+</button></div>
                    <div class="col-3"><button class="btn btn-secondary w-100" onclick="scientificMemorySubtract()">M-</button></div>
                    
                    <!-- Scientific Functions Row 1 -->
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificFunction('sin')">sin</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificFunction('cos')">cos</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificFunction('tan')">tan</button></div>
                    <div class="col-3"><button class="btn btn-danger w-100" onclick="scientificClear()">C</button></div>
                    
                    <!-- Scientific Functions Row 2 -->
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificFunction('asin')">sin⁻¹</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificFunction('acos')">cos⁻¹</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificFunction('atan')">tan⁻¹</button></div>
                    <div class="col-3"><button class="btn btn-warning w-100" onclick="scientificBackspace()">⌫</button></div>
                    
                    <!-- Scientific Functions Row 3 -->
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificFunction('log')">log</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificFunction('ln')">ln</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificFunction('sqrt')">√</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificOperator('^')">^</button></div>
                    
                    <!-- Numbers and Basic Operators -->
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('7')">7</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('8')">8</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('9')">9</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificOperator('/')">/</button></div>
                    
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('4')">4</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('5')">5</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('6')">6</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificOperator('*')">×</button></div>
                    
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('1')">1</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('2')">2</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('3')">3</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificOperator('-')">-</button></div>
                    
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('0')">0</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" onclick="scientificAppend('.')">.</button></div>
                    <div class="col-3"><button class="btn btn-success w-100" onclick="scientificCalculate()">=</button></div>
                    <div class="col-3"><button class="btn btn-info w-100" onclick="scientificOperator('+')">+</button></div>
                </div>
            </div>
        </div>
    `;
    
    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);
    
    // Initialize calculator state
    window.scientificState = {
        display: '',
        memory: 0,
        lastNumber: null,
        operator: null,
        newNumber: true
    };
}

// Calculator Functions
function scientificAppend(value) {
    const display = document.getElementById('display');
    if (window.scientificState.newNumber) {
        display.value = value;
        window.scientificState.newNumber = false;
    } else {
        display.value += value;
    }
}

function scientificOperator(op) {
    const display = document.getElementById('display');
    window.scientificState.lastNumber = parseFloat(display.value);
    window.scientificState.operator = op;
    window.scientificState.newNumber = true;
}

function scientificFunction(func) {
    const display = document.getElementById('display');
    const value = parseFloat(display.value);
    let result;
    
    switch(func) {
        case 'sin':
            result = Math.sin(value * Math.PI / 180);
            break;
        case 'cos':
            result = Math.cos(value * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(value * Math.PI / 180);
            break;
        case 'asin':
            result = Math.asin(value) * 180 / Math.PI;
            break;
        case 'acos':
            result = Math.acos(value) * 180 / Math.PI;
            break;
        case 'atan':
            result = Math.atan(value) * 180 / Math.PI;
            break;
        case 'log':
            result = Math.log10(value);
            break;
        case 'ln':
            result = Math.log(value);
            break;
        case 'sqrt':
            result = Math.sqrt(value);
            break;
    }
    
    display.value = result.toFixed(8).replace(/\.?0+$/, '');
    window.scientificState.newNumber = true;
}

function scientificCalculate() {
    const display = document.getElementById('display');
    const currentNumber = parseFloat(display.value);
    let result;
    
    if (window.scientificState.lastNumber !== null && window.scientificState.operator) {
        switch(window.scientificState.operator) {
            case '+':
                result = window.scientificState.lastNumber + currentNumber;
                break;
            case '-':
                result = window.scientificState.lastNumber - currentNumber;
                break;
            case '*':
                result = window.scientificState.lastNumber * currentNumber;
                break;
            case '/':
                result = window.scientificState.lastNumber / currentNumber;
                break;
            case '^':
                result = Math.pow(window.scientificState.lastNumber, currentNumber);
                break;
        }
        
        display.value = result.toFixed(8).replace(/\.?0+$/, '');
        window.scientificState.lastNumber = null;
        window.scientificState.operator = null;
        window.scientificState.newNumber = true;
    }
}

function scientificClear() {
    const display = document.getElementById('display');
    display.value = '';
    window.scientificState.lastNumber = null;
    window.scientificState.operator = null;
    window.scientificState.newNumber = true;
}

function scientificBackspace() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function scientificMemoryClear() {
    window.scientificState.memory = 0;
}

function scientificMemoryRecall() {
    const display = document.getElementById('display');
    display.value = window.scientificState.memory;
    window.scientificState.newNumber = true;
}

function scientificMemoryAdd() {
    const display = document.getElementById('display');
    window.scientificState.memory += parseFloat(display.value) || 0;
}

function scientificMemorySubtract() {
    const display = document.getElementById('display');
    window.scientificState.memory -= parseFloat(display.value) || 0;
}
