function loadTimeCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Time Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="time-calc-type" onchange="toggleTimeCalculatorInputs()">
                        <option value="add">Add/Subtract Time</option>
                        <option value="difference">Time Difference</option>
                    </select>
                </div>
                
                <div id="time-single-input">
                    <div class="mb-3">
                        <label for="time-start" class="form-label">Start Time</label>
                        <input type="time" class="form-control" id="time-start" step="1">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Add/Subtract</label>
                        <div class="row">
                            <div class="col">
                                <input type="number" class="form-control" id="time-hours" placeholder="Hours" min="0">
                            </div>
                            <div class="col">
                                <input type="number" class="form-control" id="time-minutes" placeholder="Minutes" min="0" max="59">
                            </div>
                            <div class="col">
                                <input type="number" class="form-control" id="time-seconds" placeholder="Seconds" min="0" max="59">
                            </div>
                            <div class="col">
                                <select class="form-select" id="time-operation">
                                    <option value="add">Add</option>
                                    <option value="subtract">Subtract</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="time-range-input" style="display: none;">
                    <div class="mb-3">
                        <label for="time-from" class="form-label">From Time</label>
                        <input type="time" class="form-control" id="time-from" step="1">
                    </div>
                    
                    <div class="mb-3">
                        <label for="time-to" class="form-label">To Time</label>
                        <input type="time" class="form-control" id="time-to" step="1">
                    </div>
                    
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="time-next-day">
                        <label class="form-check-label" for="time-next-day">
                            End time is on the next day
                        </label>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateTime()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="time-result" class="result-box mt-3" style="display: none;">
                    <h4>Time Results</h4>
                    
                    <div class="mb-3">
                        <h5>Result</h5>
                        <p id="time-main-result" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Alternative Formats</h5>
                        <ul class="list-unstyled" id="time-formats"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Set default time to current time
    const now = new Date();
    const timeString = now.toTimeString().substring(0, 8);
    document.getElementById('time-start').value = timeString;
    document.getElementById('time-from').value = timeString;
    document.getElementById('time-to').value = timeString;
}

function toggleTimeCalculatorInputs() {
    const calcType = document.getElementById('time-calc-type').value;
    const singleInput = document.getElementById('time-single-input');
    const rangeInput = document.getElementById('time-range-input');
    
    if (calcType === 'add') {
        singleInput.style.display = 'block';
        rangeInput.style.display = 'none';
    } else {
        singleInput.style.display = 'none';
        rangeInput.style.display = 'block';
    }
}

function calculateTime() {
    const calcType = document.getElementById('time-calc-type').value;
    
    if (calcType === 'add') {
        calculateTimeAddSubtract();
    } else {
        calculateTimeDifference();
    }
}

function calculateTimeAddSubtract() {
    const startTime = document.getElementById('time-start').value;
    const hours = parseInt(document.getElementById('time-hours').value) || 0;
    const minutes = parseInt(document.getElementById('time-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('time-seconds').value) || 0;
    const operation = document.getElementById('time-operation').value;
    
    if (!startTime) {
        alert('Please enter a valid start time');
        return;
    }
    
    if (hours === 0 && minutes === 0 && seconds === 0) {
        alert('Please enter a time duration to add or subtract');
        return;
    }
    
    // Convert start time to Date object
    const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(startHours, startMinutes, startSeconds);
    
    // Calculate total seconds to add/subtract
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    const multiplier = operation === 'add' ? 1 : -1;
    
    // Add/subtract seconds
    date.setSeconds(date.getSeconds() + (totalSeconds * multiplier));
    
    // Format result
    const resultTime = date.toTimeString().substring(0, 8);
    const days = Math.floor(Math.abs(totalSeconds) / (24 * 3600));
    
    // Display results
    document.getElementById('time-result').style.display = 'block';
    
    let resultText = resultTime;
    if (days > 0) {
        const dayWord = days === 1 ? 'day' : 'days';
        resultText += `<br><small class="text-muted">(${operation === 'add' ? '+' : '-'}${days} ${dayWord})</small>`;
    }
    
    document.getElementById('time-main-result').innerHTML = resultText;
    
    // Show alternative formats
    const totalMinutes = Math.abs(totalSeconds) / 60;
    const totalHours = totalMinutes / 60;
    
    document.getElementById('time-formats').innerHTML = `
        <li><strong>Total Hours:</strong> ${totalHours.toFixed(2)}</li>
        <li><strong>Total Minutes:</strong> ${totalMinutes.toFixed(0)}</li>
        <li><strong>Total Seconds:</strong> ${Math.abs(totalSeconds)}</li>
    `;
}

function calculateTimeDifference() {
    const fromTime = document.getElementById('time-from').value;
    const toTime = document.getElementById('time-to').value;
    const isNextDay = document.getElementById('time-next-day').checked;
    
    if (!fromTime || !toTime) {
        alert('Please enter valid times');
        return;
    }
    
    // Convert times to Date objects
    const [fromHours, fromMinutes, fromSeconds] = fromTime.split(':').map(Number);
    const [toHours, toMinutes, toSeconds] = toTime.split(':').map(Number);
    
    const fromDate = new Date();
    fromDate.setHours(fromHours, fromMinutes, fromSeconds);
    
    const toDate = new Date();
    toDate.setHours(toHours, toMinutes, toSeconds);
    
    if (isNextDay) {
        toDate.setDate(toDate.getDate() + 1);
    }
    
    // Calculate difference in seconds
    let diffSeconds = (toDate - fromDate) / 1000;
    
    // Ensure positive difference
    if (diffSeconds < 0 && !isNextDay) {
        diffSeconds += 24 * 3600; // Add 24 hours
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = Math.floor(diffSeconds % 60);
    
    // Display results
    document.getElementById('time-result').style.display = 'block';
    
    document.getElementById('time-main-result').textContent = 
        `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    
    // Show alternative formats
    const totalMinutes = diffSeconds / 60;
    const totalHours = totalMinutes / 60;
    
    document.getElementById('time-formats').innerHTML = `
        <li><strong>Hours:Minutes:Seconds:</strong> ${hours}:${padZero(minutes)}:${padZero(seconds)}</li>
        <li><strong>Total Hours:</strong> ${totalHours.toFixed(2)}</li>
        <li><strong>Total Minutes:</strong> ${totalMinutes.toFixed(0)}</li>
        <li><strong>Total Seconds:</strong> ${diffSeconds.toFixed(0)}</li>
    `;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}
