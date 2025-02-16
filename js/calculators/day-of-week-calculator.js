function loadDayOfWeekCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Day of the Week Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="dayofweek-type" onchange="toggleDayOfWeekInputs()">
                        <option value="findDay">Find Day of Week</option>
                        <option value="findDate">Find Next/Previous Date</option>
                        <option value="pattern">Find Date Pattern</option>
                    </select>
                </div>
                
                <div id="dayofweek-find-input">
                    <div class="mb-3">
                        <label class="form-label">Date</label>
                        <input type="date" class="form-control" id="dayofweek-date">
                    </div>
                </div>
                
                <div id="dayofweek-nextprev-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Day of Week</label>
                        <select class="form-select" id="dayofweek-day">
                            <option value="0">Sunday</option>
                            <option value="1">Monday</option>
                            <option value="2">Tuesday</option>
                            <option value="3">Wednesday</option>
                            <option value="4">Thursday</option>
                            <option value="5">Friday</option>
                            <option value="6">Saturday</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Start From</label>
                        <input type="date" class="form-control" id="dayofweek-start">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Direction</label>
                        <select class="form-select" id="dayofweek-direction">
                            <option value="next">Next Occurrence</option>
                            <option value="previous">Previous Occurrence</option>
                            <option value="both">Both Directions</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Number of Occurrences</label>
                        <input type="number" class="form-control" id="dayofweek-occurrences" value="5" min="1" max="52">
                    </div>
                </div>
                
                <div id="dayofweek-pattern-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Pattern Type</label>
                        <select class="form-select" id="dayofweek-pattern-type">
                            <option value="same">Same Day Each Month</option>
                            <option value="nth">Nth Day of Week</option>
                            <option value="last">Last Day of Week</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Day of Week</label>
                        <select class="form-select" id="dayofweek-pattern-day">
                            <option value="0">Sunday</option>
                            <option value="1">Monday</option>
                            <option value="2">Tuesday</option>
                            <option value="3">Wednesday</option>
                            <option value="4">Thursday</option>
                            <option value="5">Friday</option>
                            <option value="6">Saturday</option>
                        </select>
                    </div>
                    
                    <div class="mb-3" id="dayofweek-nth-input">
                        <label class="form-label">Occurrence</label>
                        <select class="form-select" id="dayofweek-nth">
                            <option value="1">First</option>
                            <option value="2">Second</option>
                            <option value="3">Third</option>
                            <option value="4">Fourth</option>
                            <option value="5">Fifth</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Year</label>
                        <input type="number" class="form-control" id="dayofweek-year" min="1900" max="2100">
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateDayOfWeek()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="dayofweek-result" class="result-box mt-3" style="display: none;">
                    <h4>Day of Week Results</h4>
                    
                    <div class="mb-3">
                        <h5>Result</h5>
                        <p id="dayofweek-main-result" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Details</h5>
                        <ul class="list-unstyled" id="dayofweek-details"></ul>
                    </div>
                    
                    <div id="dayofweek-calendar" class="mb-3">
                        <h5>Calendar View</h5>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered" id="dayofweek-calendar-table">
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
    document.getElementById('dayofweek-date').value = today;
    document.getElementById('dayofweek-start').value = today;
    document.getElementById('dayofweek-year').value = new Date().getFullYear();
}

function toggleDayOfWeekInputs() {
    const type = document.getElementById('dayofweek-type').value;
    const findInput = document.getElementById('dayofweek-find-input');
    const nextPrevInput = document.getElementById('dayofweek-nextprev-input');
    const patternInput = document.getElementById('dayofweek-pattern-input');
    
    findInput.style.display = type === 'findDay' ? 'block' : 'none';
    nextPrevInput.style.display = type === 'findDate' ? 'block' : 'none';
    patternInput.style.display = type === 'pattern' ? 'block' : 'none';
}

function calculateDayOfWeek() {
    const type = document.getElementById('dayofweek-type').value;
    
    switch(type) {
        case 'findDay':
            calculateSingleDate();
            break;
        case 'findDate':
            calculateNextPrevious();
            break;
        case 'pattern':
            calculatePattern();
            break;
    }
}

function calculateSingleDate() {
    const dateStr = document.getElementById('dayofweek-date').value;
    
    if (!dateStr) {
        alert('Please enter a date');
        return;
    }
    
    const date = new Date(dateStr);
    showDayOfWeekResult(date);
}

function calculateNextPrevious() {
    const targetDay = parseInt(document.getElementById('dayofweek-day').value);
    const startStr = document.getElementById('dayofweek-start').value;
    const direction = document.getElementById('dayofweek-direction').value;
    const occurrences = parseInt(document.getElementById('dayofweek-occurrences').value);
    
    if (!startStr) {
        alert('Please enter a start date');
        return;
    }
    
    const startDate = new Date(startStr);
    const results = [];
    
    if (direction === 'previous' || direction === 'both') {
        let date = new Date(startDate);
        let count = 0;
        
        while (count < occurrences) {
            if (date.getDay() === targetDay) {
                results.unshift(new Date(date));
                count++;
            }
            date.setDate(date.getDate() - 1);
        }
    }
    
    if (direction === 'next' || direction === 'both') {
        let date = new Date(startDate);
        let count = 0;
        
        while (count < occurrences) {
            if (date.getDay() === targetDay) {
                results.push(new Date(date));
                count++;
            }
            date.setDate(date.getDate() + 1);
        }
    }
    
    // Display results
    document.getElementById('dayofweek-result').style.display = 'block';
    
    const dayName = new Date(2024, 0, targetDay + 7).toLocaleDateString('en-US', { weekday: 'long' });
    
    document.getElementById('dayofweek-main-result').textContent = 
        `Found ${results.length} ${dayName}(s)`;
    
    const detailsHTML = results.map(date => 
        `<li>${date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}</li>`
    ).join('');
    
    document.getElementById('dayofweek-details').innerHTML = `
        <li><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</li>
        <li><strong>Direction:</strong> ${direction.charAt(0).toUpperCase() + direction.slice(1)}</li>
        <li><strong>Occurrences Found:</strong></li>
        <ul>${detailsHTML}</ul>
    `;
    
    // Show calendar for the month of the first result
    showCalendar(results[0], results);
}

function calculatePattern() {
    const patternType = document.getElementById('dayofweek-pattern-type').value;
    const targetDay = parseInt(document.getElementById('dayofweek-pattern-day').value);
    const year = parseInt(document.getElementById('dayofweek-year').value);
    
    if (!year || year < 1900 || year > 2100) {
        alert('Please enter a valid year between 1900 and 2100');
        return;
    }
    
    const results = [];
    const dayName = new Date(2024, 0, targetDay + 7).toLocaleDateString('en-US', { weekday: 'long' });
    
    for (let month = 0; month < 12; month++) {
        let date;
        
        switch(patternType) {
            case 'same':
                // Find the first occurrence of the day in the month
                date = new Date(year, month, 1);
                while (date.getDay() !== targetDay) {
                    date.setDate(date.getDate() + 1);
                }
                results.push(new Date(date));
                break;
                
            case 'nth':
                const nth = parseInt(document.getElementById('dayofweek-nth').value);
                date = new Date(year, month, 1);
                let count = 0;
                
                while (date.getMonth() === month) {
                    if (date.getDay() === targetDay) {
                        count++;
                        if (count === nth) {
                            results.push(new Date(date));
                            break;
                        }
                    }
                    date.setDate(date.getDate() + 1);
                }
                break;
                
            case 'last':
                date = new Date(year, month + 1, 0); // Last day of month
                while (date.getDay() !== targetDay) {
                    date.setDate(date.getDate() - 1);
                }
                results.push(new Date(date));
                break;
        }
    }
    
    // Display results
    document.getElementById('dayofweek-result').style.display = 'block';
    
    let patternDesc;
    switch(patternType) {
        case 'same':
            patternDesc = `First ${dayName}`;
            break;
        case 'nth':
            const nthText = ['First', 'Second', 'Third', 'Fourth', 'Fifth'][
                parseInt(document.getElementById('dayofweek-nth').value) - 1
            ];
            patternDesc = `${nthText} ${dayName}`;
            break;
        case 'last':
            patternDesc = `Last ${dayName}`;
            break;
    }
    
    document.getElementById('dayofweek-main-result').textContent = 
        `${patternDesc} of each month in ${year}`;
    
    const detailsHTML = results.map(date => 
        `<li>${date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}</li>`
    ).join('');
    
    document.getElementById('dayofweek-details').innerHTML = `
        <li><strong>Pattern:</strong> ${patternDesc}</li>
        <li><strong>Year:</strong> ${year}</li>
        <li><strong>Dates Found:</strong></li>
        <ul>${detailsHTML}</ul>
    `;
    
    // Show calendar for the current month
    const currentMonth = new Date().getMonth();
    showCalendar(results[currentMonth], results);
}

function showDayOfWeekResult(date) {
    document.getElementById('dayofweek-result').style.display = 'block';
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('dayofweek-main-result').textContent = dayName;
    
    document.getElementById('dayofweek-details').innerHTML = `
        <li><strong>Full Date:</strong> ${fullDate}</li>
        <li><strong>Day of Week:</strong> ${dayName}</li>
        <li><strong>Day Number:</strong> ${date.getDay()} (0 = Sunday)</li>
        <li><strong>Day of Month:</strong> ${date.getDate()}</li>
        <li><strong>Month:</strong> ${date.toLocaleDateString('en-US', { month: 'long' })}</li>
        <li><strong>Year:</strong> ${date.getFullYear()}</li>
    `;
    
    showCalendar(date, [date]);
}

function showCalendar(date, highlightDates) {
    const tbody = document.querySelector('#dayofweek-calendar-table tbody');
    tbody.innerHTML = '';
    
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    let currentWeek = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        currentWeek.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
        currentWeek.push(currentDate);
        
        if (currentWeek.length === 7) {
            tbody.appendChild(createCalendarRow(currentWeek, highlightDates));
            currentWeek = [];
        }
    }
    
    // Add empty cells for days after the last of the month
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        tbody.appendChild(createCalendarRow(currentWeek, highlightDates));
    }
}

function createCalendarRow(days, highlightDates) {
    const tr = document.createElement('tr');
    
    days.forEach(day => {
        const td = document.createElement('td');
        
        if (day) {
            td.textContent = day.getDate();
            
            // Highlight weekends
            if (day.getDay() === 0 || day.getDay() === 6) {
                td.classList.add('table-secondary');
            }
            
            // Highlight matching dates
            if (highlightDates.some(d => d.getTime() === day.getTime())) {
                td.classList.add('table-primary');
            }
        }
        
        tr.appendChild(td);
    });
    
    return tr;
}
