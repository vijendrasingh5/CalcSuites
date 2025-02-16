function loadTimeDurationCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Time Duration Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="duration-calc-type" onchange="toggleDurationInputs()">
                        <option value="add">Add/Subtract Durations</option>
                        <option value="convert">Convert Duration</option>
                        <option value="distribute">Distribute Duration</option>
                    </select>
                </div>
                
                <div id="duration-add-input">
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="form-label mb-0">Duration Entries</label>
                            <button class="btn btn-secondary btn-sm" onclick="addDurationEntry()">Add Entry</button>
                        </div>
                        <div id="duration-entries">
                            <!-- Duration entries will be added here -->
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <select class="form-select" id="duration-operation">
                            <option value="add">Add Durations</option>
                            <option value="subtract">Subtract from First Duration</option>
                        </select>
                    </div>
                </div>
                
                <div id="duration-convert-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Duration</label>
                        <div class="row g-2">
                            <div class="col">
                                <input type="number" class="form-control" id="duration-value" placeholder="Value">
                            </div>
                            <div class="col">
                                <select class="form-select" id="duration-unit">
                                    <option value="seconds">Seconds</option>
                                    <option value="minutes">Minutes</option>
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                    <option value="weeks">Weeks</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="duration-distribute-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Total Duration</label>
                        <div class="row g-2">
                            <div class="col-md-3">
                                <input type="number" class="form-control" id="distribute-hours" placeholder="Hours" min="0">
                            </div>
                            <div class="col-md-3">
                                <input type="number" class="form-control" id="distribute-minutes" placeholder="Minutes" min="0" max="59">
                            </div>
                            <div class="col-md-3">
                                <input type="number" class="form-control" id="distribute-seconds" placeholder="Seconds" min="0" max="59">
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Number of Parts</label>
                        <input type="number" class="form-control" id="distribute-parts" min="2" value="2">
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateDuration()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="duration-result" class="result-box mt-3" style="display: none;">
                    <h4>Duration Results</h4>
                    
                    <div class="mb-3">
                        <h5>Result</h5>
                        <p id="duration-main-result" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Alternative Formats</h5>
                        <ul class="list-unstyled" id="duration-formats"></ul>
                    </div>
                    
                    <div id="duration-parts" class="mb-3" style="display: none;">
                        <h5>Distribution</h5>
                        <ul class="list-unstyled" id="duration-distribution"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add initial duration entry
    addDurationEntry();
}

function toggleDurationInputs() {
    const calcType = document.getElementById('duration-calc-type').value;
    const addInput = document.getElementById('duration-add-input');
    const convertInput = document.getElementById('duration-convert-input');
    const distributeInput = document.getElementById('duration-distribute-input');
    
    addInput.style.display = calcType === 'add' ? 'block' : 'none';
    convertInput.style.display = calcType === 'convert' ? 'block' : 'none';
    distributeInput.style.display = calcType === 'distribute' ? 'block' : 'none';
}

function addDurationEntry() {
    const entries = document.getElementById('duration-entries');
    const entryCount = entries.children.length + 1;
    
    const entry = document.createElement('div');
    entry.className = 'card mb-2 duration-entry';
    entry.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="card-title mb-0">Duration ${entryCount}</h6>
                ${entryCount > 1 ? '<button class="btn btn-danger btn-sm" onclick="removeDurationEntry(this)">Remove</button>' : ''}
            </div>
            <div class="row g-2">
                <div class="col-md-4">
                    <input type="number" class="form-control duration-hours" placeholder="Hours" min="0">
                </div>
                <div class="col-md-4">
                    <input type="number" class="form-control duration-minutes" placeholder="Minutes" min="0" max="59">
                </div>
                <div class="col-md-4">
                    <input type="number" class="form-control duration-seconds" placeholder="Seconds" min="0" max="59">
                </div>
            </div>
        </div>
    `;
    
    entries.appendChild(entry);
}

function removeDurationEntry(button) {
    const entry = button.closest('.duration-entry');
    entry.remove();
    
    // Renumber remaining entries
    const entries = document.getElementsByClassName('duration-entry');
    Array.from(entries).forEach((entry, index) => {
        entry.querySelector('.card-title').textContent = `Duration ${index + 1}`;
    });
}

function calculateDuration() {
    const calcType = document.getElementById('duration-calc-type').value;
    
    switch(calcType) {
        case 'add':
            calculateDurationAddSubtract();
            break;
        case 'convert':
            calculateDurationConvert();
            break;
        case 'distribute':
            calculateDurationDistribute();
            break;
    }
}

function calculateDurationAddSubtract() {
    const operation = document.getElementById('duration-operation').value;
    const entries = document.getElementsByClassName('duration-entry');
    let totalSeconds = 0;
    
    Array.from(entries).forEach((entry, index) => {
        const hours = parseInt(entry.querySelector('.duration-hours').value) || 0;
        const minutes = parseInt(entry.querySelector('.duration-minutes').value) || 0;
        const seconds = parseInt(entry.querySelector('.duration-seconds').value) || 0;
        
        const entrySeconds = (hours * 3600) + (minutes * 60) + seconds;
        
        if (operation === 'add' || index === 0) {
            totalSeconds += entrySeconds;
        } else {
            totalSeconds -= entrySeconds;
        }
    });
    
    displayDurationResult(totalSeconds);
}

function calculateDurationConvert() {
    const value = parseFloat(document.getElementById('duration-value').value);
    const unit = document.getElementById('duration-unit').value;
    
    if (!value) {
        alert('Please enter a value to convert');
        return;
    }
    
    let totalSeconds;
    switch(unit) {
        case 'seconds':
            totalSeconds = value;
            break;
        case 'minutes':
            totalSeconds = value * 60;
            break;
        case 'hours':
            totalSeconds = value * 3600;
            break;
        case 'days':
            totalSeconds = value * 86400;
            break;
        case 'weeks':
            totalSeconds = value * 604800;
            break;
    }
    
    displayDurationResult(totalSeconds);
}

function calculateDurationDistribute() {
    const hours = parseInt(document.getElementById('distribute-hours').value) || 0;
    const minutes = parseInt(document.getElementById('distribute-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('distribute-seconds').value) || 0;
    const parts = parseInt(document.getElementById('distribute-parts').value) || 2;
    
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    
    if (totalSeconds === 0) {
        alert('Please enter a duration to distribute');
        return;
    }
    
    const secondsPerPart = Math.floor(totalSeconds / parts);
    const remainder = totalSeconds % parts;
    
    displayDurationResult(totalSeconds);
    
    // Show distribution
    document.getElementById('duration-parts').style.display = 'block';
    
    let distributionHTML = '';
    for (let i = 0; i < parts; i++) {
        const partSeconds = secondsPerPart + (i < remainder ? 1 : 0);
        const { hours, minutes, seconds } = secondsToTime(partSeconds);
        distributionHTML += `
            <li><strong>Part ${i + 1}:</strong> 
            ${formatDuration(hours, minutes, seconds)}</li>
        `;
    }
    
    document.getElementById('duration-distribution').innerHTML = distributionHTML;
}

function displayDurationResult(totalSeconds) {
    const { hours, minutes, seconds } = secondsToTime(Math.abs(totalSeconds));
    
    // Display results
    document.getElementById('duration-result').style.display = 'block';
    
    // Show main result
    document.getElementById('duration-main-result').textContent = 
        formatDuration(hours, minutes, seconds);
    
    // Show alternative formats
    const days = Math.floor(Math.abs(totalSeconds) / 86400);
    const weeks = Math.floor(days / 7);
    
    document.getElementById('duration-formats').innerHTML = `
        <li><strong>Total Weeks:</strong> ${weeks} weeks, ${days % 7} days</li>
        <li><strong>Total Days:</strong> ${days} days, ${hours % 24} hours</li>
        <li><strong>Total Hours:</strong> ${Math.floor(Math.abs(totalSeconds) / 3600)}</li>
        <li><strong>Total Minutes:</strong> ${Math.floor(Math.abs(totalSeconds) / 60)}</li>
        <li><strong>Total Seconds:</strong> ${Math.abs(totalSeconds)}</li>
    `;
}

function secondsToTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
}

function formatDuration(hours, minutes, seconds) {
    return `${hours}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}
