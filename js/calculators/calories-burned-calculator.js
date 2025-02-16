// MET values for different activities
const activities = {
    walking: {
        'Slow (2 mph)': 2.0,
        'Moderate (3 mph)': 3.0,
        'Fast (4 mph)': 4.0,
        'Very Fast (4.5 mph)': 4.5,
        'Uphill': 6.0
    },
    running: {
        'Jogging (5 mph)': 8.0,
        'Running (6 mph)': 10.0,
        'Running (7 mph)': 11.5,
        'Running (8 mph)': 13.5,
        'Running (9 mph)': 15.0,
        'Running (10 mph)': 16.0
    },
    cycling: {
        'Leisure (< 10 mph)': 4.0,
        'Moderate (10-12 mph)': 6.0,
        'Vigorous (12-14 mph)': 8.0,
        'Racing (>20 mph)': 16.0,
        'Stationary, moderate': 7.0,
        'Stationary, vigorous': 10.5
    },
    swimming: {
        'Leisure': 6.0,
        'Moderate': 8.0,
        'Vigorous': 10.0,
        'Butterfly': 13.8,
        'Backstroke': 9.5,
        'Breaststroke': 10.3
    },
    sports: {
        'Basketball': 6.5,
        'Soccer': 7.0,
        'Tennis': 7.3,
        'Football': 8.0,
        'Volleyball': 4.0,
        'Boxing': 12.8,
        'Table Tennis': 4.0
    },
    gym: {
        'Weight Training (light)': 3.5,
        'Weight Training (vigorous)': 6.0,
        'Aerobics': 7.3,
        'Elliptical': 5.0,
        'Rowing Machine': 7.0,
        'Jump Rope': 12.3
    }
};

function loadCaloriesBurnedCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Calories Burned Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="cb-weight" class="form-label">Weight</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="cb-weight" step="0.1">
                        <select class="form-select" id="cb-weight-unit">
                            <option value="kg">kg</option>
                            <option value="lbs">lbs</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="cb-activity-category" class="form-label">Activity Category</label>
                    <select class="form-select" id="cb-activity-category" onchange="updateActivityOptions()">
                        ${Object.keys(activities).map(category => 
                            `<option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="mb-3">
                    <label for="cb-activity" class="form-label">Specific Activity</label>
                    <select class="form-select" id="cb-activity"></select>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Duration</label>
                    <div class="row">
                        <div class="col">
                            <input type="number" class="form-control" id="cb-hours" placeholder="Hours" min="0">
                        </div>
                        <div class="col">
                            <input type="number" class="form-control" id="cb-minutes" placeholder="Minutes" min="0" max="59">
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateCaloriesBurned()">Calculate Calories Burned</button>
            </div>
            
            <div class="col-md-6">
                <div id="cb-result" class="result-box mt-3" style="display: none;">
                    <h4>Calories Burned Results</h4>
                    <div class="mb-3">
                        <strong>Total Calories Burned:</strong>
                        <p id="cb-calories" class="h3 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Activity Details</h5>
                        <ul class="list-unstyled">
                            <li id="cb-activity-name"></li>
                            <li id="cb-duration"></li>
                            <li id="cb-met"></li>
                        </ul>
                    </div>
                    
                    <div class="alert alert-info">
                        <h5>Equivalent To:</h5>
                        <ul class="mb-0" id="cb-equivalents"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    updateActivityOptions();
}

function updateActivityOptions() {
    const category = document.getElementById('cb-activity-category').value;
    const activitySelect = document.getElementById('cb-activity');
    
    activitySelect.innerHTML = Object.keys(activities[category])
        .map(activity => `<option value="${activities[category][activity]}">${activity}</option>`)
        .join('');
}

function calculateCaloriesBurned() {
    const weightUnit = document.getElementById('cb-weight-unit').value;
    let weight = parseFloat(document.getElementById('cb-weight').value);
    const met = parseFloat(document.getElementById('cb-activity').value);
    const hours = parseInt(document.getElementById('cb-hours').value) || 0;
    const minutes = parseInt(document.getElementById('cb-minutes').value) || 0;
    
    if (!weight || (hours === 0 && minutes === 0)) {
        alert('Please enter valid weight and duration');
        return;
    }
    
    // Convert weight to kg if needed
    if (weightUnit === 'lbs') {
        weight = weight * 0.453592;
    }
    
    // Calculate duration in hours
    const duration = hours + (minutes / 60);
    
    // Calculate calories burned
    // Formula: Calories = MET × Weight (kg) × Duration (hours)
    const caloriesBurned = met * weight * duration;
    
    // Display results
    document.getElementById('cb-result').style.display = 'block';
    document.getElementById('cb-calories').textContent = `${formatNumber(caloriesBurned, 0)} calories`;
    
    // Display activity details
    const activitySelect = document.getElementById('cb-activity');
    document.getElementById('cb-activity-name').innerHTML = 
        `<strong>Activity:</strong> ${activitySelect.options[activitySelect.selectedIndex].text}`;
    document.getElementById('cb-duration').innerHTML = 
        `<strong>Duration:</strong> ${hours}h ${minutes}m`;
    document.getElementById('cb-met').innerHTML = 
        `<strong>MET Value:</strong> ${met}`;
    
    // Calculate and display equivalents
    const equivalents = [
        `${formatNumber(caloriesBurned / 7716.17, 2)} kg of body fat`,
        `${formatNumber(caloriesBurned / 100, 1)} small bananas`,
        `${formatNumber(caloriesBurned / 140, 1)} slices of bread`,
        `${formatNumber(caloriesBurned / 250, 1)} chocolate bars`,
        `${formatNumber(caloriesBurned / 150, 1)} cans of soda`
    ];
    
    document.getElementById('cb-equivalents').innerHTML = 
        equivalents.map(eq => `<li>${eq}</li>`).join('');
}
