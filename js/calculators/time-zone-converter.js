function loadTimeZoneCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Time Zone Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Source Location</label>
                    <div class="row g-2">
                        <div class="col-md-8">
                            <select class="form-select" id="timezone-source">
                                ${generateTimeZoneOptions()}
                            </select>
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-outline-secondary w-100" onclick="setLocalTimeZone('timezone-source')">
                                Local
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Target Location</label>
                    <div class="row g-2">
                        <div class="col-md-8">
                            <select class="form-select" id="timezone-target">
                                ${generateTimeZoneOptions()}
                            </select>
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-outline-secondary w-100" onclick="setLocalTimeZone('timezone-target')">
                                Local
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Source Time</label>
                    <div class="row g-2">
                        <div class="col-md-8">
                            <input type="datetime-local" class="form-control" id="timezone-time" step="1">
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-outline-secondary w-100" onclick="setCurrentTime()">
                                Now
                            </button>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateTimeZone()">Convert Time</button>
            </div>
            
            <div class="col-md-6">
                <div id="timezone-result" class="result-box mt-3" style="display: none;">
                    <h4>Time Zone Results</h4>
                    
                    <div class="mb-3">
                        <h5>Converted Time</h5>
                        <p id="timezone-converted" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Time Difference</h5>
                        <p id="timezone-difference"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Additional Information</h5>
                        <ul class="list-unstyled" id="timezone-info"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Quick Reference</h5>
                        <div class="table-responsive">
                            <table class="table table-sm" id="timezone-reference">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th id="source-zone-header">Source Zone</th>
                                        <th id="target-zone-header">Target Zone</th>
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
    
    // Initialize the calculator
    const sourceSelect = document.getElementById('timezone-source');
    const targetSelect = document.getElementById('timezone-target');
    
    // Ensure selects are populated
    if (sourceSelect && targetSelect) {
        // Set default times
        setCurrentTime();
        setLocalTimeZone('timezone-source');
        
        // Set a default value for target timezone if not set
        if (targetSelect.selectedIndex === -1) {
            targetSelect.value = 'UTC';  // Set UTC as default target
        }
        
        // Update headers after everything is initialized
        updateTimeZoneHeaders();
        
        // Add change event listeners
        sourceSelect.addEventListener('change', updateTimeZoneHeaders);
        targetSelect.addEventListener('change', updateTimeZoneHeaders);
    }
}

function updateTimeZoneHeaders() {
    const sourceHeader = document.getElementById('source-zone-header');
    const targetHeader = document.getElementById('target-zone-header');
    if (sourceHeader && targetHeader) {
        sourceHeader.textContent = getTimeZoneCity('timezone-source');
        targetHeader.textContent = getTimeZoneCity('timezone-target');
    }
}

function generateTimeZoneOptions() {
    const timeZones = [
        { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
        { value: 'America/New_York', label: 'New York (UTC-05:00)' },
        { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-08:00)' },
        { value: 'America/Chicago', label: 'Chicago (UTC-06:00)' },
        { value: 'Europe/London', label: 'London (UTC+00:00)' },
        { value: 'Europe/Paris', label: 'Paris (UTC+01:00)' },
        { value: 'Europe/Berlin', label: 'Berlin (UTC+01:00)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (UTC+09:00)' },
        { value: 'Asia/Shanghai', label: 'Shanghai (UTC+08:00)' },
        { value: 'Asia/Dubai', label: 'Dubai (UTC+04:00)' },
        { value: 'Asia/Kolkata', label: 'India (UTC+05:30)' },
        { value: 'Australia/Sydney', label: 'Sydney (UTC+11:00)' },
        { value: 'Pacific/Auckland', label: 'Auckland (UTC+13:00)' }
    ];
    
    return timeZones.map(tz => 
        `<option value="${tz.value}">${tz.label}</option>`
    ).join('');
}

function setLocalTimeZone(elementId) {
    const select = document.getElementById(elementId);
    select.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function setCurrentTime() {
    const now = new Date();
    const timeString = now.toISOString().slice(0, 19);
    document.getElementById('timezone-time').value = timeString;
}

function getTimeZoneCity(elementId) {
    const select = document.getElementById(elementId);
    if (!select || select.selectedIndex === -1 || !select.options[select.selectedIndex]) {
        return 'Time Zone';  // Default text if no option is selected
    }
    return select.options[select.selectedIndex].text.split(' ')[0];
}

function calculateTimeZone() {
    const sourceZone = document.getElementById('timezone-source').value;
    const targetZone = document.getElementById('timezone-target').value;
    const sourceTime = document.getElementById('timezone-time').value;
    
    if (!sourceTime) {
        alert('Please enter a source time');
        return;
    }
    
    const sourceDate = new Date(sourceTime);
    
    // Convert to target timezone
    const targetTime = sourceDate.toLocaleString('en-US', {
        timeZone: targetZone,
        dateStyle: 'full',
        timeStyle: 'long'
    });
    
    const sourceTimeStr = sourceDate.toLocaleString('en-US', {
        timeZone: sourceZone,
        dateStyle: 'full',
        timeStyle: 'long'
    });
    
    // Calculate time difference
    const sourceTZOffset = getTimeZoneOffset(sourceDate, sourceZone);
    const targetTZOffset = getTimeZoneOffset(sourceDate, targetZone);
    const diffHours = (targetTZOffset - sourceTZOffset) / 60;
    
    // Display results
    document.getElementById('timezone-result').style.display = 'block';
    
    document.getElementById('timezone-converted').innerHTML = 
        `${targetTime}`;
    
    document.getElementById('timezone-difference').innerHTML = 
        `${Math.abs(diffHours)} hours ${diffHours >= 0 ? 'ahead' : 'behind'}`;
    
    // Show additional information
    const isDST = sourceDate.toLocaleString('en-US', { timeZone: targetZone, timeZoneName: 'long' })
        .includes('Daylight');
    
    document.getElementById('timezone-info').innerHTML = `
        <li><strong>Source:</strong> ${sourceTimeStr}</li>
        <li><strong>Target:</strong> ${targetTime}</li>
        <li><strong>Time Difference:</strong> ${Math.abs(diffHours)} hours</li>
        <li><strong>DST Active:</strong> ${isDST ? 'Yes' : 'No'}</li>
    `;
    
    // Generate quick reference table
    const tbody = document.querySelector('#timezone-reference tbody');
    tbody.innerHTML = '';
    
    // Show next 6 hours in 2-hour intervals
    for (let i = 0; i <= 6; i += 2) {
        const refDate = new Date(sourceDate);
        refDate.setHours(refDate.getHours() + i);
        
        const sourceRef = refDate.toLocaleString('en-US', {
            timeZone: sourceZone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        const targetRef = refDate.toLocaleString('en-US', {
            timeZone: targetZone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        tbody.innerHTML += `
            <tr>
                <td>+${i} hours</td>
                <td>${sourceRef}</td>
                <td>${targetRef}</td>
            </tr>
        `;
    }
}

function getTimeZoneOffset(date, timeZone) {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZone }));
    return (utcDate - tzDate) / 60000; // Convert to minutes
}
