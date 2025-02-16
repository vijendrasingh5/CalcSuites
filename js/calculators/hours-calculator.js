function loadHoursCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Hours Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="hours-calc-type" onchange="toggleHoursCalculatorInputs()">
                        <option value="decimal">Decimal to Hours:Minutes</option>
                        <option value="time">Hours:Minutes to Decimal</option>
                        <option value="add">Add/Subtract Hours</option>
                    </select>
                </div>
                
                <div id="hours-decimal-input">
                    <div class="mb-3">
                        <label for="hours-decimal" class="form-label">Decimal Hours</label>
                        <input type="number" class="form-control" id="hours-decimal" step="0.01" placeholder="e.g., 1.5">
                    </div>
                </div>
                
                <div id="hours-time-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Hours and Minutes</label>
                        <div class="row">
                            <div class="col">
                                <input type="number" class="form-control" id="hours-hours" placeholder="Hours" min="0">
                            </div>
                            <div class="col">
                                <input type="number" class="form-control" id="hours-minutes" placeholder="Minutes" min="0" max="59">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="hours-add-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Time Entries</label>
                        <div id="hours-entries">
                            <div class="row mb-2">
                                <div class="col">
                                    <input type="number" class="form-control hours-entry-hours" placeholder="Hours" min="0">
                                </div>
                                <div class="col">
                                    <input type="number" class="form-control hours-entry-minutes" placeholder="Minutes" min="0" max="59">
                                </div>
                                <div class="col-auto">
                                    <button class="btn btn-danger" onclick="removeHoursEntry(this)">×</button>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm mt-2" onclick="addHoursEntry()">Add Entry</button>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateHours()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="hours-result" class="result-box mt-3" style="display: none;">
                    <h4>Hours Results</h4>
                    
                    <div class="mb-3">
                        <h5>Result</h5>
                        <p id="hours-main-result" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Alternative Formats</h5>
                        <ul class="list-unstyled" id="hours-formats"></ul>
                    </div>
                    
                    <div id="hours-breakdown" class="mb-3" style="display: none;">
                        <h5>Time Breakdown</h5>
                        <ul class="list-unstyled" id="hours-entries-breakdown"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function toggleHoursCalculatorInputs() {
    const calcType = document.getElementById('hours-calc-type').value;
    const decimalInput = document.getElementById('hours-decimal-input');
    const timeInput = document.getElementById('hours-time-input');
    const addInput = document.getElementById('hours-add-input');
    
    decimalInput.style.display = calcType === 'decimal' ? 'block' : 'none';
    timeInput.style.display = calcType === 'time' ? 'block' : 'none';
    addInput.style.display = calcType === 'add' ? 'block' : 'none';
}

function addHoursEntry() {
    const entries = document.getElementById('hours-entries');
    const newEntry = document.createElement('div');
    newEntry.className = 'row mb-2';
    newEntry.innerHTML = `
        <div class="col">
            <input type="number" class="form-control hours-entry-hours" placeholder="Hours" min="0">
        </div>
        <div class="col">
            <input type="number" class="form-control hours-entry-minutes" placeholder="Minutes" min="0" max="59">
        </div>
        <div class="col-auto">
            <button class="btn btn-danger" onclick="removeHoursEntry(this)">×</button>
        </div>
    `;
    entries.appendChild(newEntry);
}

function removeHoursEntry(button) {
    const entries = document.getElementById('hours-entries');
    if (entries.children.length > 1) {
        button.closest('.row').remove();
    }
}

function calculateHours() {
    const calcType = document.getElementById('hours-calc-type').value;
    
    switch(calcType) {
        case 'decimal':
            calculateDecimalToTime();
            break;
        case 'time':
            calculateTimeToDecimal();
            break;
        case 'add':
            calculateAddHours();
            break;
    }
}

function calculateDecimalToTime() {
    const decimal = parseFloat(document.getElementById('hours-decimal').value);
    
    if (isNaN(decimal)) {
        alert('Please enter a valid decimal number');
        return;
    }
    
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    
    // Display results
    document.getElementById('hours-result').style.display = 'block';
    document.getElementById('hours-breakdown').style.display = 'none';
    
    document.getElementById('hours-main-result').textContent = 
        `${hours}:${padZero(minutes)}`;
    
    // Show alternative formats
    document.getElementById('hours-formats').innerHTML = `
        <li><strong>Decimal Hours:</strong> ${decimal.toFixed(2)}</li>
        <li><strong>Hours and Minutes:</strong> ${hours} hours, ${minutes} minutes</li>
        <li><strong>Total Minutes:</strong> ${Math.round(decimal * 60)}</li>
        <li><strong>Total Seconds:</strong> ${Math.round(decimal * 3600)}</li>
    `;
}

function calculateTimeToDecimal() {
    const hours = parseInt(document.getElementById('hours-hours').value) || 0;
    const minutes = parseInt(document.getElementById('hours-minutes').value) || 0;
    
    if (hours === 0 && minutes === 0) {
        alert('Please enter hours or minutes');
        return;
    }
    
    const decimal = hours + (minutes / 60);
    
    // Display results
    document.getElementById('hours-result').style.display = 'block';
    document.getElementById('hours-breakdown').style.display = 'none';
    
    document.getElementById('hours-main-result').textContent = 
        decimal.toFixed(2);
    
    // Show alternative formats
    document.getElementById('hours-formats').innerHTML = `
        <li><strong>Hours and Minutes:</strong> ${hours}:${padZero(minutes)}</li>
        <li><strong>Total Minutes:</strong> ${(hours * 60) + minutes}</li>
        <li><strong>Total Seconds:</strong> ${((hours * 60) + minutes) * 60}</li>
        <li><strong>Percentage of Day:</strong> ${((decimal / 24) * 100).toFixed(1)}%</li>
    `;
}

function calculateAddHours() {
    const entries = document.getElementsByClassName('row mb-2');
    let totalMinutes = 0;
    const breakdown = [];
    
    for (const entry of entries) {
        const hours = parseInt(entry.querySelector('.hours-entry-hours').value) || 0;
        const minutes = parseInt(entry.querySelector('.hours-entry-minutes').value) || 0;
        
        if (hours === 0 && minutes === 0) continue;
        
        const entryMinutes = (hours * 60) + minutes;
        totalMinutes += entryMinutes;
        
        breakdown.push({
            hours,
            minutes,
            totalMinutes: entryMinutes
        });
    }
    
    if (totalMinutes === 0) {
        alert('Please enter at least one valid time entry');
        return;
    }
    
    const resultHours = Math.floor(totalMinutes / 60);
    const resultMinutes = totalMinutes % 60;
    const decimal = totalMinutes / 60;
    
    // Display results
    document.getElementById('hours-result').style.display = 'block';
    document.getElementById('hours-breakdown').style.display = 'block';
    
    document.getElementById('hours-main-result').textContent = 
        `${resultHours}:${padZero(resultMinutes)}`;
    
    // Show alternative formats
    document.getElementById('hours-formats').innerHTML = `
        <li><strong>Decimal Hours:</strong> ${decimal.toFixed(2)}</li>
        <li><strong>Hours and Minutes:</strong> ${resultHours} hours, ${resultMinutes} minutes</li>
        <li><strong>Total Minutes:</strong> ${totalMinutes}</li>
        <li><strong>Total Seconds:</strong> ${totalMinutes * 60}</li>
    `;
    
    // Show breakdown
    const breakdownHTML = breakdown.map((entry, index) => `
        <li>Entry ${index + 1}: ${entry.hours}:${padZero(entry.minutes)} 
        (${entry.totalMinutes} minutes)</li>
    `).join('');
    
    document.getElementById('hours-entries-breakdown').innerHTML = breakdownHTML;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}
