function loadDateCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Date Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="date-calc-type" onchange="toggleDateCalculatorInputs()">
                        <option value="add">Add/Subtract Time</option>
                        <option value="difference">Date Difference</option>
                        <option value="workdays">Business Days</option>
                    </select>
                </div>
                
                <div id="date-single-input">
                    <div class="mb-3">
                        <label for="date-start" class="form-label">Start Date</label>
                        <div class="input-group">
                            <input type="date" class="form-control" id="date-start">
                            <button class="btn btn-outline-secondary" type="button" onclick="setCurrentDate('date-start')">Today</button>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Add/Subtract</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="date-amount" value="1">
                            <select class="form-select" id="date-unit">
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </select>
                            <select class="form-select" id="date-operation">
                                <option value="add">Add</option>
                                <option value="subtract">Subtract</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div id="date-range-input" style="display: none;">
                    <div class="mb-3">
                        <label for="date-from" class="form-label">From Date</label>
                        <div class="input-group">
                            <input type="date" class="form-control" id="date-from">
                            <button class="btn btn-outline-secondary" type="button" onclick="setCurrentDate('date-from')">Today</button>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="date-to" class="form-label">To Date</label>
                        <div class="input-group">
                            <input type="date" class="form-control" id="date-to">
                            <button class="btn btn-outline-secondary" type="button" onclick="setCurrentDate('date-to')">Today</button>
                        </div>
                    </div>
                    
                    <div class="mb-3" id="date-workdays-options" style="display: none;">
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="date-exclude-weekends" checked>
                            <label class="form-check-label" for="date-exclude-weekends">
                                Exclude Weekends
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="date-exclude-holidays" checked>
                            <label class="form-check-label" for="date-exclude-holidays">
                                Exclude Common Holidays
                            </label>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateDate()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="date-result" class="result-box mt-3" style="display: none;">
                    <h4>Date Results</h4>
                    
                    <div class="mb-3">
                        <h5>Result</h5>
                        <p id="date-main-result" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3" id="date-difference-details" style="display: none;">
                        <h5>Time Span</h5>
                        <ul class="list-unstyled" id="date-span-details"></ul>
                    </div>
                    
                    <div class="mb-3" id="date-workdays-details" style="display: none;">
                        <h5>Business Days Details</h5>
                        <ul class="list-unstyled" id="date-workdays-breakdown"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Set default dates
    setCurrentDate('date-start');
    setCurrentDate('date-from');
    setCurrentDate('date-to');
}

function toggleDateCalculatorInputs() {
    const calcType = document.getElementById('date-calc-type').value;
    const singleInput = document.getElementById('date-single-input');
    const rangeInput = document.getElementById('date-range-input');
    const workdaysOptions = document.getElementById('date-workdays-options');
    
    if (calcType === 'add') {
        singleInput.style.display = 'block';
        rangeInput.style.display = 'none';
        workdaysOptions.style.display = 'none';
    } else {
        singleInput.style.display = 'none';
        rangeInput.style.display = 'block';
        workdaysOptions.style.display = calcType === 'workdays' ? 'block' : 'none';
    }
}

const commonHolidays = [
    { month: 1, day: 1, name: "New Year's Day" },
    { month: 7, day: 4, name: "Independence Day" },
    { month: 12, day: 25, name: "Christmas Day" },
    // Add more holidays as needed
];

function calculateDate() {
    const calcType = document.getElementById('date-calc-type').value;
    
    switch(calcType) {
        case 'add':
            calculateDateAddSubtract();
            break;
        case 'difference':
            calculateDateDifference();
            break;
        case 'workdays':
            calculateWorkdays();
            break;
    }
}

function calculateDateAddSubtract() {
    const startDate = new Date(document.getElementById('date-start').value);
    const amount = parseInt(document.getElementById('date-amount').value);
    const unit = document.getElementById('date-unit').value;
    const operation = document.getElementById('date-operation').value;
    
    if (!startDate.getTime() || !amount) {
        alert('Please enter valid values');
        return;
    }
    
    const resultDate = new Date(startDate);
    const multiplier = operation === 'add' ? 1 : -1;
    
    switch(unit) {
        case 'days':
            resultDate.setDate(resultDate.getDate() + (amount * multiplier));
            break;
        case 'weeks':
            resultDate.setDate(resultDate.getDate() + (amount * 7 * multiplier));
            break;
        case 'months':
            resultDate.setMonth(resultDate.getMonth() + (amount * multiplier));
            break;
        case 'years':
            resultDate.setFullYear(resultDate.getFullYear() + (amount * multiplier));
            break;
    }
    
    // Display results
    document.getElementById('date-result').style.display = 'block';
    document.getElementById('date-difference-details').style.display = 'none';
    document.getElementById('date-workdays-details').style.display = 'none';
    
    document.getElementById('date-main-result').innerHTML = 
        `${resultDate.toLocaleDateString()}<br>
        <small class="text-muted">${resultDate.toLocaleString('en-US', { weekday: 'long' })}</small>`;
}

function calculateDateDifference() {
    const fromDate = new Date(document.getElementById('date-from').value);
    const toDate = new Date(document.getElementById('date-to').value);
    
    if (!fromDate.getTime() || !toDate.getTime()) {
        alert('Please enter valid dates');
        return;
    }
    
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;
    
    let years = toDate.getFullYear() - fromDate.getFullYear();
    let months = toDate.getMonth() - fromDate.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Display results
    document.getElementById('date-result').style.display = 'block';
    document.getElementById('date-difference-details').style.display = 'block';
    document.getElementById('date-workdays-details').style.display = 'none';
    
    document.getElementById('date-main-result').textContent = 
        `${diffDays} days`;
    
    document.getElementById('date-span-details').innerHTML = `
        <li><strong>Years and Months:</strong> ${years} years, ${months} months</li>
        <li><strong>Weeks and Days:</strong> ${diffWeeks} weeks, ${remainingDays} days</li>
        <li><strong>Total Weeks:</strong> ${(diffDays / 7).toFixed(1)}</li>
        <li><strong>Total Days:</strong> ${diffDays}</li>
        <li><strong>Total Hours:</strong> ${diffDays * 24}</li>
        <li><strong>Total Minutes:</strong> ${diffDays * 24 * 60}</li>
    `;
}

function calculateWorkdays() {
    const fromDate = new Date(document.getElementById('date-from').value);
    const toDate = new Date(document.getElementById('date-to').value);
    const excludeWeekends = document.getElementById('date-exclude-weekends').checked;
    const excludeHolidays = document.getElementById('date-exclude-holidays').checked;
    
    if (!fromDate.getTime() || !toDate.getTime()) {
        alert('Please enter valid dates');
        return;
    }
    
    let workdays = 0;
    let weekends = 0;
    let holidays = 0;
    const current = new Date(fromDate);
    const excludedDates = [];
    
    while (current <= toDate) {
        const isWeekend = current.getDay() === 0 || current.getDay() === 6;
        const isHoliday = commonHolidays.some(h => 
            h.month === (current.getMonth() + 1) && h.day === current.getDate());
        
        if (excludeWeekends && isWeekend) {
            weekends++;
            excludedDates.push({
                date: new Date(current),
                reason: 'Weekend'
            });
        } else if (excludeHolidays && isHoliday) {
            holidays++;
            excludedDates.push({
                date: new Date(current),
                reason: 'Holiday'
            });
        } else {
            workdays++;
        }
        
        current.setDate(current.getDate() + 1);
    }
    
    // Display results
    document.getElementById('date-result').style.display = 'block';
    document.getElementById('date-difference-details').style.display = 'none';
    document.getElementById('date-workdays-details').style.display = 'block';
    
    document.getElementById('date-main-result').textContent = 
        `${workdays} business days`;
    
    let breakdownHTML = `
        <li><strong>Total Days:</strong> ${workdays + weekends + holidays}</li>
        <li><strong>Business Days:</strong> ${workdays}</li>
    `;
    
    if (excludeWeekends) {
        breakdownHTML += `<li><strong>Weekends:</strong> ${weekends}</li>`;
    }
    if (excludeHolidays) {
        breakdownHTML += `<li><strong>Holidays:</strong> ${holidays}</li>`;
    }
    
    if (excludedDates.length > 0) {
        breakdownHTML += '<li><strong>Excluded Dates:</strong><ul>';
        excludedDates.forEach(({ date, reason }) => {
            breakdownHTML += `<li>${date.toLocaleDateString()} (${reason})</li>`;
        });
        breakdownHTML += '</ul></li>';
    }
    
    document.getElementById('date-workdays-breakdown').innerHTML = breakdownHTML;
}
