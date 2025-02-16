function loadMeanMedianModeCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Mean, Median, Mode & Range Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <div class="mb-3">
                    <label class="form-label">Enter Numbers</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="number-input" placeholder="Enter a number">
                        <button class="btn btn-secondary" onclick="addNumberToList()">Add</button>
                    </div>
                    <small class="text-muted">Press Enter or click Add to add numbers to the list</small>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Numbers List</label>
                    <div class="card">
                        <div class="card-body" id="numbers-list">
                            <!-- Numbers will be displayed here -->
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <button class="btn btn-primary" onclick="calculateStatistics()">Calculate</button>
                    <button class="btn btn-danger" onclick="clearNumbersList()">Clear List</button>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        Results
                    </div>
                    <div class="card-body">
                        <div class="mb-2">
                            <label class="fw-bold">Mean:</label>
                            <div id="mean-result">-</div>
                        </div>
                        <div class="mb-2">
                            <label class="fw-bold">Median:</label>
                            <div id="median-result">-</div>
                        </div>
                        <div class="mb-2">
                            <label class="fw-bold">Mode:</label>
                            <div id="mode-result">-</div>
                        </div>
                        <div class="mb-2">
                            <label class="fw-bold">Range:</label>
                            <div id="range-result">-</div>
                        </div>
                        <div class="mb-2">
                            <label class="fw-bold">Count:</label>
                            <div id="count-result">-</div>
                        </div>
                        <div class="mb-2">
                            <label class="fw-bold">Sum:</label>
                            <div id="sum-result">-</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);
    
    // Initialize the numbers array
    window.numbersList = [];
    
    // Add enter key listener
    document.getElementById('number-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNumberToList();
        }
    });
}

function addNumberToList() {
    const input = document.getElementById('number-input');
    const number = parseFloat(input.value);
    
    if (!isNaN(number)) {
        window.numbersList.push(number);
        updateNumbersList();
        input.value = '';
    } else {
        alert('Please enter a valid number');
    }
    
    input.focus();
}

function updateNumbersList() {
    const listContainer = document.getElementById('numbers-list');
    listContainer.innerHTML = window.numbersList
        .map((num, index) => `
            <span class="badge bg-primary me-2 mb-2" style="font-size: 1em;">
                ${num}
                <button type="button" class="btn-close btn-close-white ms-2" 
                    style="font-size: 0.5em;" 
                    onclick="removeNumber(${index})"
                    aria-label="Remove"></button>
            </span>
        `)
        .join('');
}

function removeNumber(index) {
    window.numbersList.splice(index, 1);
    updateNumbersList();
}

function clearNumbersList() {
    window.numbersList = [];
    updateNumbersList();
    resetResults();
}

function resetResults() {
    document.getElementById('mean-result').textContent = '-';
    document.getElementById('median-result').textContent = '-';
    document.getElementById('mode-result').textContent = '-';
    document.getElementById('range-result').textContent = '-';
    document.getElementById('count-result').textContent = '-';
    document.getElementById('sum-result').textContent = '-';
}

function calculateStatistics() {
    if (window.numbersList.length === 0) {
        alert('Please add some numbers to the list first');
        return;
    }
    
    const numbers = [...window.numbersList].sort((a, b) => a - b);
    
    // Calculate mean
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    
    // Calculate median
    const middle = Math.floor(numbers.length / 2);
    const median = numbers.length % 2 === 0
        ? (numbers[middle - 1] + numbers[middle]) / 2
        : numbers[middle];
    
    // Calculate mode
    const frequency = {};
    numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });
    
    let maxFreq = 0;
    let modes = [];
    for (const num in frequency) {
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
            modes = [num];
        } else if (frequency[num] === maxFreq) {
            modes.push(num);
        }
    }
    
    // Calculate range
    const range = numbers[numbers.length - 1] - numbers[0];
    
    // Display results
    document.getElementById('mean-result').textContent = mean.toFixed(2);
    document.getElementById('median-result').textContent = median.toFixed(2);
    document.getElementById('mode-result').textContent = modes.length === numbers.length 
        ? 'No mode (all numbers appear once)' 
        : modes.map(n => parseFloat(n).toFixed(2)).join(', ');
    document.getElementById('range-result').textContent = range.toFixed(2);
    document.getElementById('count-result').textContent = numbers.length;
    document.getElementById('sum-result').textContent = sum.toFixed(2);
}
