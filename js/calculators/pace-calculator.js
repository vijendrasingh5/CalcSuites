function loadPaceCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Pace Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculate By</label>
                    <select class="form-select" id="pace-calc-type" onchange="updatePaceInputs()">
                        <option value="pace">Find Pace (using distance and time)</option>
                        <option value="time">Find Time (using distance and pace)</option>
                        <option value="distance">Find Distance (using time and pace)</option>
                    </select>
                </div>
                
                <div id="pace-distance-input" class="mb-3">
                    <label class="form-label">Distance</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="pace-distance" step="0.01">
                        <select class="form-select" id="pace-distance-unit">
                            <option value="km">Kilometers</option>
                            <option value="mi">Miles</option>
                            <option value="m">Meters</option>
                        </select>
                    </div>
                </div>
                
                <div id="pace-time-input" class="mb-3">
                    <label class="form-label">Time</label>
                    <div class="row">
                        <div class="col">
                            <input type="number" class="form-control" id="pace-hours" placeholder="Hours" min="0">
                        </div>
                        <div class="col">
                            <input type="number" class="form-control" id="pace-minutes" placeholder="Minutes" min="0" max="59">
                        </div>
                        <div class="col">
                            <input type="number" class="form-control" id="pace-seconds" placeholder="Seconds" min="0" max="59">
                        </div>
                    </div>
                </div>
                
                <div id="pace-speed-input" class="mb-3">
                    <label class="form-label">Pace</label>
                    <div class="row">
                        <div class="col">
                            <input type="number" class="form-control" id="pace-pace-minutes" placeholder="Minutes" min="0">
                        </div>
                        <div class="col">
                            <input type="number" class="form-control" id="pace-pace-seconds" placeholder="Seconds" min="0" max="59">
                        </div>
                        <div class="col">
                            <select class="form-select" id="pace-pace-unit">
                                <option value="km">per km</option>
                                <option value="mi">per mile</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculatePace()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="pace-result" class="result-box mt-3" style="display: none;">
                    <h4>Results</h4>
                    <div class="mb-3">
                        <div id="pace-result-distance"></div>
                        <div id="pace-result-time"></div>
                        <div id="pace-result-pace"></div>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Speed Conversions</h5>
                        <div id="pace-result-speed"></div>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Split Times</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <tbody id="pace-splits"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    updatePaceInputs();
}

function updatePaceInputs() {
    const calcType = document.getElementById('pace-calc-type').value;
    
    document.getElementById('pace-distance-input').style.display = 
        calcType === 'distance' ? 'none' : 'block';
    document.getElementById('pace-time-input').style.display = 
        calcType === 'time' ? 'none' : 'block';
    document.getElementById('pace-speed-input').style.display = 
        calcType === 'pace' ? 'none' : 'block';
}

function calculatePace() {
    const calcType = document.getElementById('pace-calc-type').value;
    let distance, timeInSeconds, paceInSeconds;
    
    // Get distance if needed
    if (calcType !== 'distance') {
        distance = parseFloat(document.getElementById('pace-distance').value);
        const distanceUnit = document.getElementById('pace-distance-unit').value;
        // Convert to kilometers for calculations
        distance = distanceUnit === 'mi' ? distance * 1.60934 : 
                  distanceUnit === 'm' ? distance / 1000 : distance;
    }
    
    // Get time if needed
    if (calcType !== 'time') {
        const hours = parseInt(document.getElementById('pace-hours').value) || 0;
        const minutes = parseInt(document.getElementById('pace-minutes').value) || 0;
        const seconds = parseInt(document.getElementById('pace-seconds').value) || 0;
        timeInSeconds = (hours * 3600) + (minutes * 60) + seconds;
    }
    
    // Get pace if needed
    if (calcType !== 'pace') {
        const paceMinutes = parseInt(document.getElementById('pace-pace-minutes').value) || 0;
        const paceSeconds = parseInt(document.getElementById('pace-pace-seconds').value) || 0;
        const paceUnit = document.getElementById('pace-pace-unit').value;
        paceInSeconds = (paceMinutes * 60) + paceSeconds;
        // Convert to per km if needed
        if (paceUnit === 'mi') {
            paceInSeconds = paceInSeconds / 1.60934;
        }
    }
    
    // Calculate the missing value
    switch(calcType) {
        case 'pace':
            paceInSeconds = timeInSeconds / distance;
            break;
        case 'time':
            timeInSeconds = distance * paceInSeconds;
            break;
        case 'distance':
            distance = timeInSeconds / paceInSeconds;
            break;
    }
    
    // Display results
    document.getElementById('pace-result').style.display = 'block';
    
    // Format and display distance
    const kmDistance = distance;
    const miDistance = distance / 1.60934;
    document.getElementById('pace-result-distance').innerHTML = 
        `<strong>Distance:</strong> ${formatNumber(kmDistance, 2)} km (${formatNumber(miDistance, 2)} miles)`;
    
    // Format and display time
    const timeStr = formatTime(timeInSeconds);
    document.getElementById('pace-result-time').innerHTML = 
        `<strong>Total Time:</strong> ${timeStr}`;
    
    // Format and display pace
    const kmPace = formatTime(paceInSeconds);
    const miPace = formatTime(paceInSeconds * 1.60934);
    document.getElementById('pace-result-pace').innerHTML = 
        `<strong>Pace:</strong><br>` +
        `${kmPace} per km<br>` +
        `${miPace} per mile`;
    
    // Calculate and display speed
    const kph = (kmDistance / timeInSeconds) * 3600;
    const mph = (miDistance / timeInSeconds) * 3600;
    document.getElementById('pace-result-speed').innerHTML = 
        `${formatNumber(kph, 2)} km/h<br>` +
        `${formatNumber(mph, 2)} mph`;
    
    // Calculate and display splits
    const splitDistance = document.getElementById('pace-distance-unit').value === 'mi' ? 1.60934 : 1;
    let splitHTML = '';
    for (let i = 1; i <= Math.ceil(kmDistance / splitDistance); i++) {
        const splitTime = formatTime(paceInSeconds * i);
        splitHTML += `
            <tr>
                <td>${i} ${document.getElementById('pace-distance-unit').value}</td>
                <td>${splitTime}</td>
            </tr>
        `;
    }
    document.getElementById('pace-splits').innerHTML = splitHTML;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${padZero(minutes)}:${padZero(secs)}`;
    }
    return `${minutes}:${padZero(secs)}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}
