function loadScientificCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Scientific Calculator');
    
    const calculatorHTML = `
        <div class="calculator-grid">
            <div class="calculator-display">
                <input type="text" id="display" class="form-control" readonly>
            </div>
            <div class="calculator-buttons">
                <div class="row g-1">
                    <div class="col"><button class="btn btn-secondary w-100" onclick="appendToDisplay('(')">(</button></div>
                    <div class="col"><button class="btn btn-secondary w-100" onclick="appendToDisplay(')')">)</button></div>
                    <div class="col"><button class="btn btn-danger w-100" onclick="clearDisplay()">C</button></div>
                    <div class="col"><button class="btn btn-danger w-100" onclick="backspace()">⌫</button></div>
                </div>
                <div class="row g-1 mt-1">
                    <div class="col"><button class="btn btn-info w-100" onclick="appendToDisplay('sin(')">sin</button></div>
                    <div class="col"><button class="btn btn-info w-100" onclick="appendToDisplay('cos(')">cos</button></div>
                    <div class="col"><button class="btn btn-info w-100" onclick="appendToDisplay('tan(')">tan</button></div>
                    <div class="col"><button class="btn btn-info w-100" onclick="appendToDisplay('^')">^</button></div>
                </div>
                <div class="row g-1 mt-1">
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('7')">7</button></div>
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('8')">8</button></div>
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('9')">9</button></div>
                    <div class="col"><button class="btn btn-warning w-100" onclick="appendToDisplay('/')">/</button></div>
                </div>
                <div class="row g-1 mt-1">
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('4')">4</button></div>
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('5')">5</button></div>
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('6')">6</button></div>
                    <div class="col"><button class="btn btn-warning w-100" onclick="appendToDisplay('*')">×</button></div>
                </div>
                <div class="row g-1 mt-1">
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('1')">1</button></div>
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('2')">2</button></div>
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('3')">3</button></div>
                    <div class="col"><button class="btn btn-warning w-100" onclick="appendToDisplay('-')">-</button></div>
                </div>
                <div class="row g-1 mt-1">
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('0')">0</button></div>
                    <div class="col"><button class="btn btn-light w-100" onclick="appendToDisplay('.')">.</button></div>
                    <div class="col"><button class="btn btn-primary w-100" onclick="calculate()">=</button></div>
                    <div class="col"><button class="btn btn-warning w-100" onclick="appendToDisplay('+')">+</button></div>
                </div>
                <div class="row g-1 mt-1">
                    <div class="col"><button class="btn btn-info w-100" onclick="appendToDisplay('sqrt(')">√</button></div>
                    <div class="col"><button class="btn btn-info w-100" onclick="appendToDisplay('log(')">log</button></div>
                    <div class="col"><button class="btn btn-info w-100" onclick="appendToDisplay('π')">π</button></div>
                    <div class="col"><button class="btn btn-info w-100" onclick="appendToDisplay('e')">e</button></div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);

    // Add custom styles for the calculator
    const style = document.createElement('style');
    style.textContent = `
        .calculator-grid {
            max-width: 400px;
            margin: 0 auto;
        }
        .calculator-display {
            margin-bottom: 1rem;
        }
        .calculator-display input {
            text-align: right;
            font-size: 1.5rem;
            padding: 0.5rem;
        }
        .calculator-buttons .btn {
            font-size: 1.2rem;
            padding: 0.75rem;
        }
    `;
    document.head.appendChild(style);
}

let display;

function appendToDisplay(value) {
    display = document.getElementById('display');
    display.value += value;
}

function clearDisplay() {
    display = document.getElementById('display');
    display.value = '';
}

function backspace() {
    display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function calculate() {
    display = document.getElementById('display');
    try {
        let expression = display.value
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/\^/g, '**');
        
        const result = Function('"use strict";return (' + expression + ')')();
        display.value = Number.isInteger(result) ? result : result.toFixed(8).replace(/\.?0+$/, '');
    } catch (error) {
        display.value = 'Error';
        setTimeout(() => display.value = '', 1000);
    }
}
