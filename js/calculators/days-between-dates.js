function loadDaysBetweenDatesCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Day Counter');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Counting Method</label>
                    <select class="form-select" id="counter-method" onchange="toggleCounterInputs()">
                        <option value="fromDate">Count from Date</option>
                        <option value="betweenDates">Count between Dates</option>
                        <option value="addSubtract">Add/Subtract Days</option>
                    </select>
                </div>
                
                <div id="counter-fromdate-input">
                    <div class="mb-3">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="form-control" id="counter-start-date">
                    </div>
                    
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="counter-include-end">
                            <label class="form-check-label">Include End Date</label>
                        </div>
                    </div>
                </div>
                
                <div id="counter-between-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="form-control" id="counter-between-start">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">End Date</label>
                        <input type="date" class="form-control" id="counter-between-end">
                    </div>
                    
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="counter-exclude-weekends">
                            <label class="form-check-label">Exclude Weekends</label>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="counter-exclude-holidays" onchange="toggleHolidayInput()">
                            <label class="form-check-label">Exclude Holidays</label>
                        </div>
                    </div>
                    
                    <div id="counter-holidays-input" style="display: none;">
                        <div class="mb-3">
                            <label class="form-label">Holidays (one per line, YYYY-MM-DD format)</label>
                            <textarea class="form-control" id="counter-holidays" rows="3"></textarea>
                        </div>
                    </div>
                </div>
                
                <div id="counter-addsubtract-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="form-control" id="counter-calc-start">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Days to Add/Subtract</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="counter-days" value="1">
                            <select class="form-select" id="counter-operation">
                                <option value="add">Add Days</option>
                                <option value="subtract">Subtract Days</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="counter-skip-weekends">
                            <label class="form-check-label">Skip Weekends</label>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateDays()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="counter-result" class="result-box mt-3" style="display: none;">
                    <h4>Day Count Results</h4>
                    
                    <div class="mb-3">
                        <h5>Result</h5>
                        <p id="counter-main-result" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Details</h5>
                        <ul class="list-unstyled" id="counter-details"></ul>
                    </div>
                    
                    <div id="counter-calendar" class="mb-3" style="display: none;">
                        <h5>Calendar View</h5>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered" id="counter-calendar-table">
                                <thead>
                                    <tr>
                                        <th>Sun</th>
                                        <th>Mon</th>
                                        <th>Tue</th>
                                        <th>Wed</th>
                                        <th>Thu</th>
                                        <th>Fri</th>
                                        <th>Sat</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('counter-start-date').value = today;
    document.getElementById('counter-between-start').value = today;
    document.getElementById('counter-between-end').value = today;
    document.getElementById('counter-calc-start').value = today;
}

function toggleCounterInputs() {
    const method = document.getElementById('counter-method').value;
    const fromDateInput = document.getElementById('counter-fromdate-input');
    const betweenInput = document.getElementById('counter-between-input');
    const addSubtractInput = document.getElementById('counter-addsubtract-input');
    
    fromDateInput.style.display = method === 'fromDate' ? 'block' : 'none';
    betweenInput.style.display = method === 'betweenDates' ? 'block' : 'none';
    addSubtractInput.style.display = method === 'addSubtract' ? 'block' : 'none';
}

function toggleHolidayInput() {
    const holidaysInput = document.getElementById('counter-holidays-input');
    const excludeHolidays = document.getElementById('counter-exclude-holidays').checked;
    holidaysInput.style.display = excludeHolidays ? 'block' : 'none';
}

function calculateDays() {
    const method = document.getElementById('counter-method').value;
    
    switch(method) {
        case 'fromDate':
            calculateFromDate();
            break;
        case 'betweenDates':
            calculateBetweenDates();
            break;
        case 'addSubtract':
            calculateAddSubtractDays();
            break;
    }
}

function calculateFromDate() {
    const startDate = new Date(document.getElementById('counter-start-date').value);
    const includeEnd = document.getElementById('counter-include-end').checked;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(startDate.getTime())) {
        alert('Please enter a valid start date');
        return;
    }
    
    const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const adjustedDays = includeEnd ? days + 1 : days;
    
    // Display results
    document.getElementById('counter-result').style.display = 'block';
    document.getElementById('counter-calendar').style.display = 'none';
    
    document.getElementById('counter-main-result').textContent = 
        `${adjustedDays} days`;
    
    const weeks = Math.floor(adjustedDays / 7);
    const remainingDays = adjustedDays % 7;
    
    document.getElementById('counter-details').innerHTML = `
        <li><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</li>
        <li><strong>End Date:</strong> ${today.toLocaleDateString()}</li>
        <li><strong>Total Days:</strong> ${adjustedDays}</li>
        <li><strong>Complete Weeks:</strong> ${weeks}</li>
        <li><strong>Remaining Days:</strong> ${remainingDays}</li>
    `;
}

function calculateBetweenDates() {
    const startDate = new Date(document.getElementById('counter-between-start').value);
    const endDate = new Date(document.getElementById('counter-between-end').value);
    const excludeWeekends = document.getElementById('counter-exclude-weekends').checked;
    const excludeHolidays = document.getElementById('counter-exclude-holidays').checked;
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('Please enter valid dates');
        return;
    }
    
    let holidays = [];
    if (excludeHolidays) {
        const holidayInput = document.getElementById('counter-holidays').value;
        holidays = holidayInput.split('\n')
            .map(date => date.trim())
            .filter(date => date && !isNaN(new Date(date).getTime()))
            .map(date => new Date(date));
    }
    
    let totalDays = 0;
    let businessDays = 0;
    let weekends = 0;
    let holidayCount = 0;
    
    const current = new Date(startDate);
    const calendarDays = [];
    
    while (current <= endDate) {
        const isWeekend = current.getDay() === 0 || current.getDay() === 6;
        const isHoliday = holidays.some(holiday => 
            holiday.getFullYear() === current.getFullYear() &&
            holiday.getMonth() === current.getMonth() &&
            holiday.getDate() === current.getDate()
        );
        
        totalDays++;
        if (isWeekend) weekends++;
        if (isHoliday) holidayCount++;
        
        if (!isWeekend && !isHoliday) businessDays++;
        
        calendarDays.push({
            date: new Date(current),
            isWeekend,
            isHoliday
        });
        
        current.setDate(current.getDate() + 1);
    }
    
    // Display results
    document.getElementById('counter-result').style.display = 'block';
    document.getElementById('counter-calendar').style.display = 'block';
    
    const finalDays = excludeWeekends ? 
        (excludeHolidays ? businessDays : totalDays - weekends) : 
        totalDays;
    
    document.getElementById('counter-main-result').textContent = 
        `${finalDays} days`;
    
    document.getElementById('counter-details').innerHTML = `
        <li><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</li>
        <li><strong>End Date:</strong> ${endDate.toLocaleDateString()}</li>
        <li><strong>Total Calendar Days:</strong> ${totalDays}</li>
        <li><strong>Weekends:</strong> ${weekends} days</li>
        ${excludeHolidays ? `<li><strong>Holidays:</strong> ${holidayCount} days</li>` : ''}
        <li><strong>Business Days:</strong> ${businessDays}</li>
    `;
    
    // Generate calendar
    const tbody = document.querySelector('#counter-calendar-table tbody');
    tbody.innerHTML = '';
    
    let currentWeek = [];
    calendarDays.forEach(day => {
        if (day.date.getDay() === 0) {
            if (currentWeek.length > 0) {
                tbody.appendChild(createCalendarRow(currentWeek));
                currentWeek = [];
            }
        }
        
        currentWeek.push(day);
        
        if (day.date.getDay() === 6) {
            tbody.appendChild(createCalendarRow(currentWeek));
            currentWeek = [];
        }
    });
    
    if (currentWeek.length > 0) {
        tbody.appendChild(createCalendarRow(currentWeek));
    }
}

function calculateAddSubtractDays() {
    const startDate = new Date(document.getElementById('counter-calc-start').value);
    const days = parseInt(document.getElementById('counter-days').value) || 0;
    const operation = document.getElementById('counter-operation').value;
    const skipWeekends = document.getElementById('counter-skip-weekends').checked;
    
    if (isNaN(startDate.getTime())) {
        alert('Please enter a valid start date');
        return;
    }
    
    if (days === 0) {
        alert('Please enter the number of days');
        return;
    }
    
    let resultDate = new Date(startDate);
    let daysAdded = 0;
    let direction = operation === 'add' ? 1 : -1;
    
    while (daysAdded < days) {
        resultDate.setDate(resultDate.getDate() + direction);
        
        if (!skipWeekends || (resultDate.getDay() !== 0 && resultDate.getDay() !== 6)) {
            daysAdded++;
        }
    }
    
    // Display results
    document.getElementById('counter-result').style.display = 'block';
    document.getElementById('counter-calendar').style.display = 'none';
    
    document.getElementById('counter-main-result').textContent = 
        resultDate.toLocaleDateString();
    
    const totalDays = Math.abs(Math.floor((resultDate - startDate) / (1000 * 60 * 60 * 24)));
    
    document.getElementById('counter-details').innerHTML = `
        <li><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</li>
        <li><strong>Operation:</strong> ${operation === 'add' ? 'Added' : 'Subtracted'} ${days} days</li>
        <li><strong>Result Date:</strong> ${resultDate.toLocaleDateString()}</li>
        <li><strong>Total Calendar Days:</strong> ${totalDays}</li>
        <li><strong>Day of Week:</strong> ${resultDate.toLocaleDateString(undefined, { weekday: 'long' })}</li>
    `;
}

function createCalendarRow(days) {
    const tr = document.createElement('tr');
    
    // Fill empty cells at start of week
    for (let i = 0; i < days[0].date.getDay(); i++) {
        tr.appendChild(document.createElement('td'));
    }
    
    // Add days
    days.forEach(day => {
        const td = document.createElement('td');
        td.textContent = day.date.getDate();
        
        if (day.isWeekend) td.classList.add('table-secondary');
        if (day.isHoliday) td.classList.add('table-danger');
        
        tr.appendChild(td);
    });
    
    // Fill empty cells at end of week
    const lastDay = days[days.length - 1].date.getDay();
    for (let i = lastDay; i < 6; i++) {
        tr.appendChild(document.createElement('td'));
    }
    
    return tr;
}
