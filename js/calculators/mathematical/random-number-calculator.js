function loadRandomNumberCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Random Number Generator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Range Generator -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Number Range Generator</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Minimum</label>
                                <input type="number" class="form-control" id="range-min" value="1">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Maximum</label>
                                <input type="number" class="form-control" id="range-max" value="100">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Count</label>
                                <input type="number" class="form-control" id="range-count" value="1" min="1" max="100">
                            </div>
                            <div class="col-12">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="unique-numbers">
                                    <label class="form-check-label">Generate unique numbers only</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="generateRandomRange()">Generate</button>
                            </div>
                        </div>
                        <div class="mt-3" id="range-result" style="display: none;">
                            <label class="form-label">Generated Numbers:</label>
                            <div class="generated-numbers"></div>
                        </div>
                    </div>
                </div>

                <!-- Dice Roller -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Dice Roller</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Number of Dice</label>
                                <input type="number" class="form-control" id="dice-count" value="1" min="1" max="10">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Sides per Die</label>
                                <select class="form-select" id="dice-sides">
                                    <option value="4">4 sides (d4)</option>
                                    <option value="6" selected>6 sides (d6)</option>
                                    <option value="8">8 sides (d8)</option>
                                    <option value="10">10 sides (d10)</option>
                                    <option value="12">12 sides (d12)</option>
                                    <option value="20">20 sides (d20)</option>
                                    <option value="100">100 sides (d100)</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">&nbsp;</label>
                                <button class="btn btn-primary w-100" onclick="rollDice()">Roll Dice</button>
                            </div>
                        </div>
                        <div class="mt-3" id="dice-result" style="display: none;">
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label">Individual Results:</label>
                                    <div class="dice-numbers"></div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Total:</label>
                                    <div class="dice-total h4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- List Randomizer -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">List Randomizer</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">Enter items (one per line)</label>
                                <textarea class="form-control" id="list-items" rows="4" placeholder="Enter your items here&#10;One item per line"></textarea>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" onclick="randomizeList()">Randomize List</button>
                            </div>
                        </div>
                        <div class="mt-3" id="list-result" style="display: none;">
                            <label class="form-label">Randomized List:</label>
                            <div class="randomized-list"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Settings and Info -->
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Generator Settings</h5>
                    </div>
                    <div class="card-body">
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="include-decimals">
                            <label class="form-check-label">Include decimals in range</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="allow-negative">
                            <label class="form-check-label">Allow negative numbers</label>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Decimal places</label>
                            <input type="number" class="form-control" id="decimal-places" value="2" min="0" max="10">
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Quick Tools</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-secondary" onclick="generateCoinFlip()">Flip a Coin</button>
                            <button class="btn btn-outline-secondary" onclick="generateCard()">Draw a Card</button>
                            <button class="btn btn-outline-secondary" onclick="generatePassword()">Generate Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add custom styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .generated-numbers {
            font-family: monospace;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
            min-height: 38px;
        }
        .dice-numbers {
            font-family: monospace;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .randomized-list {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(styleElement);

    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);
}

function generateRandomRange() {
    let min = parseFloat(document.getElementById('range-min').value);
    let max = parseFloat(document.getElementById('range-max').value);
    const count = parseInt(document.getElementById('range-count').value);
    const unique = document.getElementById('unique-numbers').checked;
    const includeDecimals = document.getElementById('include-decimals').checked;
    const decimalPlaces = parseInt(document.getElementById('decimal-places').value);
    const allowNegative = document.getElementById('allow-negative').checked;

    if (!allowNegative) {
        min = Math.max(0, min);
        max = Math.max(0, max);
    }

    if (min > max) {
        [min, max] = [max, min];
    }

    const numbers = [];
    const maxPossibleNumbers = includeDecimals ? Infinity : Math.floor(max - min + 1);

    if (unique && count > maxPossibleNumbers) {
        alert('Cannot generate that many unique numbers in the given range');
        return;
    }

    while (numbers.length < count) {
        let number;
        if (includeDecimals) {
            number = min + Math.random() * (max - min);
            number = Number(number.toFixed(decimalPlaces));
        } else {
            number = Math.floor(min + Math.random() * (max - min + 1));
        }

        if (!unique || !numbers.includes(number)) {
            numbers.push(number);
        }
    }

    const resultContainer = document.getElementById('range-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.generated-numbers').textContent = numbers.join(', ');
}

function rollDice() {
    const count = parseInt(document.getElementById('dice-count').value);
    const sides = parseInt(document.getElementById('dice-sides').value);
    
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    const resultContainer = document.getElementById('dice-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.dice-numbers').textContent = rolls.join(', ');
    resultContainer.querySelector('.dice-total').textContent = total;
}

function randomizeList() {
    const items = document.getElementById('list-items').value
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    
    if (items.length === 0) {
        alert('Please enter at least one item');
        return;
    }
    
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const resultContainer = document.getElementById('list-result');
    resultContainer.style.display = 'block';
    resultContainer.querySelector('.randomized-list').innerHTML = 
        shuffled.map((item, index) => `${index + 1}. ${item}`).join('<br>');
}

function generateCoinFlip() {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    alert(`The coin landed on: ${result}`);
}

function generateCard() {
    const suits = ['♠️', '♥️', '♣️', '♦️'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    
    alert(`You drew: ${value}${suit}`);
}

function generatePassword() {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    alert(`Generated Password: ${password}`);
}
