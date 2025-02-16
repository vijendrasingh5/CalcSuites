function loadTimeCardCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Time Card Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Pay Period Settings</label>
                    <div class="row g-2">
                        <div class="col-md-6">
                            <select class="form-select" id="timecard-period">
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <input type="number" class="form-control" id="timecard-rate" placeholder="Hourly Rate ($)" step="0.01">
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Overtime Settings</label>
                    <div class="row g-2">
                        <div class="col-md-6">
                            <div class="input-group">
                                <span class="input-group-text">Regular Hours</span>
                                <input type="number" class="form-control" id="timecard-regular-limit" value="40">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="input-group">
                                <span class="input-group-text">OT Rate</span>
                                <input type="number" class="form-control" id="timecard-ot-rate" value="1.5" step="0.1">
                                <span class="input-group-text">×</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="form-label mb-0">Time Entries</label>
                        <button class="btn btn-secondary btn-sm" onclick="addTimeCardDay()">Add Day</button>
                    </div>
                    <div id="timecard-entries">
                        <!-- Days will be added here -->
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateTimeCard()">Calculate Pay</button>
            </div>
            
            <div class="col-md-6">
                <div id="timecard-result" class="result-box mt-3" style="display: none;">
                    <h4>Time Card Summary</h4>
                    
                    <div class="mb-3">
                        <h5>Hours Breakdown</h5>
                        <ul class="list-unstyled" id="timecard-hours"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Earnings Breakdown</h5>
                        <ul class="list-unstyled" id="timecard-earnings"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Daily Summary</h5>
                        <div class="table-responsive">
                            <table class="table table-sm" id="timecard-daily">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Hours</th>
                                        <th>Regular</th>
                                        <th>Overtime</th>
                                        <th>Earnings</th>
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
    
    // Add initial day
    addTimeCardDay();
}

function addTimeCardDay() {
    const entries = document.getElementById('timecard-entries');
    const dayCount = entries.children.length + 1;
    
    const dayEntry = document.createElement('div');
    dayEntry.className = 'card mb-2 timecard-day';
    dayEntry.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="card-title mb-0">Day ${dayCount}</h6>
                ${dayCount > 1 ? '<button class="btn btn-danger btn-sm" onclick="removeTimeCardDay(this)">Remove</button>' : ''}
            </div>
            <div class="row g-2">
                <div class="col-md-6">
                    <input type="date" class="form-control timecard-date">
                </div>
                <div class="col-md-6">
                    <select class="form-select timecard-day-type" onchange="toggleBreakInputs(this)">
                        <option value="regular">Regular Day</option>
                        <option value="holiday">Holiday (1.5×)</option>
                        <option value="double">Double Time (2×)</option>
                    </select>
                </div>
            </div>
            <div class="row g-2 mt-1">
                <div class="col-md-3">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">In</span>
                        <input type="time" class="form-control timecard-in" value="09:00">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">Out</span>
                        <input type="time" class="form-control timecard-out" value="17:00">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">Break</span>
                        <input type="number" class="form-control timecard-break" value="30" min="0">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">Total</span>
                        <input type="text" class="form-control timecard-total" readonly>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    entries.appendChild(dayEntry);
    updateTimeCardTotals(dayEntry);
    
    // Set default date
    const dateInput = dayEntry.querySelector('.timecard-date');
    const today = new Date();
    today.setDate(today.getDate() - entries.children.length + 1);
    dateInput.value = today.toISOString().split('T')[0];
    
    // Add event listeners
    const inputs = dayEntry.querySelectorAll('input[type="time"], input.timecard-break');
    inputs.forEach(input => {
        input.addEventListener('change', () => updateTimeCardTotals(dayEntry));
    });
}

function removeTimeCardDay(button) {
    const day = button.closest('.timecard-day');
    day.remove();
    
    // Renumber remaining days
    const days = document.getElementsByClassName('timecard-day');
    Array.from(days).forEach((day, index) => {
        day.querySelector('.card-title').textContent = `Day ${index + 1}`;
    });
}

function toggleBreakInputs(select) {
    const dayCard = select.closest('.timecard-day');
    const breakInput = dayCard.querySelector('.timecard-break');
    breakInput.disabled = select.value !== 'regular';
    if (breakInput.disabled) {
        breakInput.value = '0';
    } else {
        breakInput.value = '30';
    }
    updateTimeCardTotals(dayCard);
}

function updateTimeCardTotals(dayCard) {
    const timeIn = dayCard.querySelector('.timecard-in').value;
    const timeOut = dayCard.querySelector('.timecard-out').value;
    const breakMinutes = parseInt(dayCard.querySelector('.timecard-break').value) || 0;
    
    if (!timeIn || !timeOut) return;
    
    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);
    
    let totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes) - breakMinutes;
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight shifts
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    dayCard.querySelector('.timecard-total').value = 
        `${hours}:${minutes.toString().padStart(2, '0')}`;
}

function calculateTimeCard() {
    const hourlyRate = parseFloat(document.getElementById('timecard-rate').value);
    const regularLimit = parseFloat(document.getElementById('timecard-regular-limit').value);
    const otRate = parseFloat(document.getElementById('timecard-ot-rate').value);
    
    if (!hourlyRate) {
        alert('Please enter an hourly rate');
        return;
    }
    
    const days = document.getElementsByClassName('timecard-day');
    let totalRegularHours = 0;
    let totalOvertimeHours = 0;
    let totalEarnings = 0;
    const dailyBreakdown = [];
    
    Array.from(days).forEach(day => {
        const date = day.querySelector('.timecard-date').value;
        const dayType = day.querySelector('.timecard-day-type').value;
        const totalTime = day.querySelector('.timecard-total').value;
        
        if (!date || !totalTime) return;
        
        const [hours, minutes] = totalTime.split(':').map(Number);
        const totalHours = hours + (minutes / 60);
        
        let dayRegularHours = 0;
        let dayOvertimeHours = 0;
        let dayEarnings = 0;
        
        if (dayType === 'regular') {
            if (totalRegularHours + totalHours <= regularLimit) {
                dayRegularHours = totalHours;
                totalRegularHours += totalHours;
            } else {
                dayRegularHours = regularLimit - totalRegularHours;
                dayOvertimeHours = totalHours - dayRegularHours;
                totalRegularHours = regularLimit;
                totalOvertimeHours += dayOvertimeHours;
            }
            
            dayEarnings = (dayRegularHours * hourlyRate) + 
                         (dayOvertimeHours * hourlyRate * otRate);
        } else {
            const rate = dayType === 'holiday' ? 1.5 : 2;
            dayRegularHours = totalHours;
            dayEarnings = totalHours * hourlyRate * rate;
        }
        
        totalEarnings += dayEarnings;
        
        dailyBreakdown.push({
            date,
            totalHours,
            regularHours: dayRegularHours,
            overtimeHours: dayOvertimeHours,
            earnings: dayEarnings,
            type: dayType
        });
    });
    
    // Display results
    document.getElementById('timecard-result').style.display = 'block';
    
    // Show hours breakdown
    document.getElementById('timecard-hours').innerHTML = `
        <li><strong>Regular Hours:</strong> ${totalRegularHours.toFixed(2)}</li>
        <li><strong>Overtime Hours:</strong> ${totalOvertimeHours.toFixed(2)}</li>
        <li><strong>Total Hours:</strong> ${(totalRegularHours + totalOvertimeHours).toFixed(2)}</li>
    `;
    
    // Show earnings breakdown
    document.getElementById('timecard-earnings').innerHTML = `
        <li><strong>Regular Earnings:</strong> $${(totalRegularHours * hourlyRate).toFixed(2)}</li>
        <li><strong>Overtime Earnings:</strong> $${(totalOvertimeHours * hourlyRate * otRate).toFixed(2)}</li>
        <li class="h5"><strong>Total Earnings:</strong> $${totalEarnings.toFixed(2)}</li>
    `;
    
    // Show daily breakdown
    const tbody = document.querySelector('#timecard-daily tbody');
    tbody.innerHTML = dailyBreakdown.map(day => `
        <tr>
            <td>${new Date(day.date).toLocaleDateString()}</td>
            <td>${day.totalHours.toFixed(2)}</td>
            <td>${day.regularHours.toFixed(2)}</td>
            <td>${day.overtimeHours.toFixed(2)}</td>
            <td>$${day.earnings.toFixed(2)}</td>
        </tr>
    `).join('');
}
