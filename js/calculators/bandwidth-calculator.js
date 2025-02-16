function loadBandwidthCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Bandwidth Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="bandwidth-type" onchange="toggleBandwidthInputs()">
                        <option value="download">Download Time</option>
                        <option value="speed">Required Speed</option>
                        <option value="usage">Data Usage</option>
                    </select>
                </div>
                
                <div id="bandwidth-download-input">
                    <div class="mb-3">
                        <label class="form-label">File Size</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="bandwidth-size" step="0.01">
                            <select class="form-select" id="bandwidth-size-unit">
                                <option value="B">Bytes</option>
                                <option value="KB">Kilobytes</option>
                                <option value="MB" selected>Megabytes</option>
                                <option value="GB">Gigabytes</option>
                                <option value="TB">Terabytes</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Connection Speed</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="bandwidth-speed" step="0.1">
                            <select class="form-select" id="bandwidth-speed-unit">
                                <option value="bps">bps</option>
                                <option value="Kbps">Kbps</option>
                                <option value="Mbps" selected>Mbps</option>
                                <option value="Gbps">Gbps</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div id="bandwidth-speed-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">File Size</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="bandwidth-req-size" step="0.01">
                            <select class="form-select" id="bandwidth-req-size-unit">
                                <option value="B">Bytes</option>
                                <option value="KB">Kilobytes</option>
                                <option value="MB" selected>Megabytes</option>
                                <option value="GB">Gigabytes</option>
                                <option value="TB">Terabytes</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Required Download Time</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="bandwidth-time" step="0.1">
                            <select class="form-select" id="bandwidth-time-unit">
                                <option value="seconds">Seconds</option>
                                <option value="minutes" selected>Minutes</option>
                                <option value="hours">Hours</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div id="bandwidth-usage-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Average Daily Usage</label>
                        <div class="row g-2">
                            <div class="col-md-6">
                                <label class="form-label">Web Browsing</label>
                                <div class="input-group">
                                    <input type="number" class="form-control usage-input" id="usage-web" value="2">
                                    <span class="input-group-text">hours</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email</label>
                                <div class="input-group">
                                    <input type="number" class="form-control usage-input" id="usage-email" value="50">
                                    <span class="input-group-text">emails</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="row g-2">
                            <div class="col-md-6">
                                <label class="form-label">Video Streaming</label>
                                <div class="input-group">
                                    <input type="number" class="form-control usage-input" id="usage-video" value="2">
                                    <select class="form-select" id="usage-video-quality">
                                        <option value="SD">SD (480p)</option>
                                        <option value="HD" selected>HD (1080p)</option>
                                        <option value="4K">4K UHD</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Music Streaming</label>
                                <div class="input-group">
                                    <input type="number" class="form-control usage-input" id="usage-music" value="1">
                                    <span class="input-group-text">hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="row g-2">
                            <div class="col-md-6">
                                <label class="form-label">Gaming</label>
                                <div class="input-group">
                                    <input type="number" class="form-control usage-input" id="usage-gaming" value="0">
                                    <span class="input-group-text">hours</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Video Calls</label>
                                <div class="input-group">
                                    <input type="number" class="form-control usage-input" id="usage-calls" value="0">
                                    <span class="input-group-text">hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Time Period</label>
                        <select class="form-select" id="usage-period">
                            <option value="day">Daily Usage</option>
                            <option value="week">Weekly Usage</option>
                            <option value="month" selected>Monthly Usage</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateBandwidth()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="bandwidth-result" class="result-box mt-3" style="display: none;">
                    <h4>Bandwidth Results</h4>
                    
                    <div class="mb-3">
                        <h5>Result</h5>
                        <p id="bandwidth-main-result" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Details</h5>
                        <ul class="list-unstyled" id="bandwidth-details"></ul>
                    </div>
                    
                    <div id="bandwidth-usage-breakdown" class="mb-3" style="display: none;">
                        <h5>Usage Breakdown</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Activity</th>
                                        <th>Data Usage</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody id="usage-breakdown"></tbody>
                            </table>
                        </div>
                        <div class="mt-3">
                            <canvas id="usage-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function toggleBandwidthInputs() {
    const calcType = document.getElementById('bandwidth-type').value;
    const downloadInput = document.getElementById('bandwidth-download-input');
    const speedInput = document.getElementById('bandwidth-speed-input');
    const usageInput = document.getElementById('bandwidth-usage-input');
    
    downloadInput.style.display = calcType === 'download' ? 'block' : 'none';
    speedInput.style.display = calcType === 'speed' ? 'block' : 'none';
    usageInput.style.display = calcType === 'usage' ? 'block' : 'none';
}

function calculateBandwidth() {
    const calcType = document.getElementById('bandwidth-type').value;
    
    switch(calcType) {
        case 'download':
            calculateDownloadTime();
            break;
        case 'speed':
            calculateRequiredSpeed();
            break;
        case 'usage':
            calculateDataUsage();
            break;
    }
}

function calculateDownloadTime() {
    const size = parseFloat(document.getElementById('bandwidth-size').value);
    const sizeUnit = document.getElementById('bandwidth-size-unit').value;
    const speed = parseFloat(document.getElementById('bandwidth-speed').value);
    const speedUnit = document.getElementById('bandwidth-speed-unit').value;
    
    if (isNaN(size) || isNaN(speed)) {
        alert('Please enter valid numbers for file size and speed');
        return;
    }
    
    // Convert size to bits
    const sizeInBits = convertToBytes(size, sizeUnit) * 8;
    
    // Convert speed to bits per second
    const speedInBps = convertToBps(speed, speedUnit);
    
    // Calculate time in seconds
    const timeInSeconds = sizeInBits / speedInBps;
    
    displayDownloadResults(timeInSeconds, size, sizeUnit, speed, speedUnit);
}

function calculateRequiredSpeed() {
    const size = parseFloat(document.getElementById('bandwidth-req-size').value);
    const sizeUnit = document.getElementById('bandwidth-req-size-unit').value;
    const time = parseFloat(document.getElementById('bandwidth-time').value);
    const timeUnit = document.getElementById('bandwidth-time-unit').value;
    
    if (isNaN(size) || isNaN(time)) {
        alert('Please enter valid numbers for file size and time');
        return;
    }
    
    // Convert size to bits
    const sizeInBits = convertToBytes(size, sizeUnit) * 8;
    
    // Convert time to seconds
    const timeInSeconds = convertToSeconds(time, timeUnit);
    
    // Calculate required speed in bps
    const requiredSpeed = sizeInBits / timeInSeconds;
    
    displaySpeedResults(requiredSpeed, size, sizeUnit, time, timeUnit);
}

function calculateDataUsage() {
    const webHours = parseFloat(document.getElementById('usage-web').value) || 0;
    const emails = parseFloat(document.getElementById('usage-email').value) || 0;
    const videoHours = parseFloat(document.getElementById('usage-video').value) || 0;
    const videoQuality = document.getElementById('usage-video-quality').value;
    const musicHours = parseFloat(document.getElementById('usage-music').value) || 0;
    const gamingHours = parseFloat(document.getElementById('usage-gaming').value) || 0;
    const callHours = parseFloat(document.getElementById('usage-calls').value) || 0;
    const period = document.getElementById('usage-period').value;
    
    // Data usage rates (in MB per hour/unit)
    const rates = {
        web: 60, // 60 MB per hour
        email: 0.5, // 0.5 MB per email
        videoSD: 700, // 700 MB per hour
        videoHD: 2000, // 2 GB per hour
        video4K: 7000, // 7 GB per hour
        music: 150, // 150 MB per hour
        gaming: 100, // 100 MB per hour
        calls: 500 // 500 MB per hour
    };
    
    // Calculate daily usage
    const usage = {
        web: webHours * rates.web,
        email: emails * rates.email,
        video: videoHours * (videoQuality === 'SD' ? rates.videoSD : 
                            videoQuality === 'HD' ? rates.videoHD : rates.video4K),
        music: musicHours * rates.music,
        gaming: gamingHours * rates.gaming,
        calls: callHours * rates.calls
    };
    
    // Apply period multiplier
    const multiplier = period === 'week' ? 7 : period === 'month' ? 30 : 1;
    Object.keys(usage).forEach(key => usage[key] *= multiplier);
    
    const totalUsage = Object.values(usage).reduce((sum, val) => sum + val, 0);
    
    displayUsageResults(usage, totalUsage, period);
}

function displayDownloadResults(timeInSeconds, size, sizeUnit, speed, speedUnit) {
    document.getElementById('bandwidth-result').style.display = 'block';
    document.getElementById('bandwidth-usage-breakdown').style.display = 'none';
    
    let displayTime;
    let timeUnit;
    
    if (timeInSeconds < 60) {
        displayTime = timeInSeconds.toFixed(1);
        timeUnit = 'seconds';
    } else if (timeInSeconds < 3600) {
        displayTime = (timeInSeconds / 60).toFixed(1);
        timeUnit = 'minutes';
    } else {
        displayTime = (timeInSeconds / 3600).toFixed(1);
        timeUnit = 'hours';
    }
    
    document.getElementById('bandwidth-main-result').textContent = 
        `${displayTime} ${timeUnit}`;
    
    document.getElementById('bandwidth-details').innerHTML = `
        <li><strong>File Size:</strong> ${size} ${sizeUnit}</li>
        <li><strong>Connection Speed:</strong> ${speed} ${speedUnit}</li>
        <li><strong>Download Time:</strong>
            <ul>
                <li>${(timeInSeconds).toFixed(1)} seconds</li>
                <li>${(timeInSeconds / 60).toFixed(1)} minutes</li>
                <li>${(timeInSeconds / 3600).toFixed(2)} hours</li>
            </ul>
        </li>
    `;
}

function displaySpeedResults(speedInBps, size, sizeUnit, time, timeUnit) {
    document.getElementById('bandwidth-result').style.display = 'block';
    document.getElementById('bandwidth-usage-breakdown').style.display = 'none';
    
    let displaySpeed;
    let speedUnit;
    
    if (speedInBps < 1000) {
        displaySpeed = speedInBps.toFixed(1);
        speedUnit = 'bps';
    } else if (speedInBps < 1000000) {
        displaySpeed = (speedInBps / 1000).toFixed(1);
        speedUnit = 'Kbps';
    } else if (speedInBps < 1000000000) {
        displaySpeed = (speedInBps / 1000000).toFixed(1);
        speedUnit = 'Mbps';
    } else {
        displaySpeed = (speedInBps / 1000000000).toFixed(1);
        speedUnit = 'Gbps';
    }
    
    document.getElementById('bandwidth-main-result').textContent = 
        `${displaySpeed} ${speedUnit}`;
    
    document.getElementById('bandwidth-details').innerHTML = `
        <li><strong>File Size:</strong> ${size} ${sizeUnit}</li>
        <li><strong>Required Time:</strong> ${time} ${timeUnit}</li>
        <li><strong>Required Speed:</strong>
            <ul>
                <li>${speedInBps.toFixed(0)} bps</li>
                <li>${(speedInBps / 1000).toFixed(1)} Kbps</li>
                <li>${(speedInBps / 1000000).toFixed(2)} Mbps</li>
                <li>${(speedInBps / 1000000000).toFixed(3)} Gbps</li>
            </ul>
        </li>
    `;
}

function displayUsageResults(usage, totalUsage, period) {
    document.getElementById('bandwidth-result').style.display = 'block';
    document.getElementById('bandwidth-usage-breakdown').style.display = 'block';
    
    let displayUsage;
    let usageUnit;
    
    if (totalUsage < 1000) {
        displayUsage = totalUsage.toFixed(1);
        usageUnit = 'MB';
    } else if (totalUsage < 1000000) {
        displayUsage = (totalUsage / 1000).toFixed(1);
        usageUnit = 'GB';
    } else {
        displayUsage = (totalUsage / 1000000).toFixed(1);
        usageUnit = 'TB';
    }
    
    document.getElementById('bandwidth-main-result').textContent = 
        `${displayUsage} ${usageUnit} per ${period}`;
    
    // Generate breakdown table
    const tbody = document.getElementById('usage-breakdown');
    tbody.innerHTML = '';
    
    const activities = {
        web: 'Web Browsing',
        email: 'Email',
        video: 'Video Streaming',
        music: 'Music Streaming',
        gaming: 'Gaming',
        calls: 'Video Calls'
    };
    
    const data = [];
    const labels = [];
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
    ];
    
    Object.entries(usage).forEach(([key, value], index) => {
        if (value > 0) {
            const percentage = ((value / totalUsage) * 100).toFixed(1);
            const displayValue = value < 1000 ? 
                `${value.toFixed(1)} MB` : 
                `${(value / 1000).toFixed(1)} GB`;
            
            tbody.innerHTML += `
                <tr>
                    <td>${activities[key]}</td>
                    <td>${displayValue}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
            
            data.push(parseFloat(percentage));
            labels.push(activities[key]);
        }
    });
    
    // Create pie chart
    const ctx = document.getElementById('usage-chart').getContext('2d');
    if (window.usageChart) window.usageChart.destroy();
    
    window.usageChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, data.length)
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Utility functions
function convertToBytes(value, unit) {
    const multipliers = {
        'B': 1,
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024
    };
    return value * multipliers[unit];
}

function convertToBps(value, unit) {
    const multipliers = {
        'bps': 1,
        'Kbps': 1000,
        'Mbps': 1000000,
        'Gbps': 1000000000
    };
    return value * multipliers[unit];
}

function convertToSeconds(value, unit) {
    const multipliers = {
        'seconds': 1,
        'minutes': 60,
        'hours': 3600
    };
    return value * multipliers[unit];
}
