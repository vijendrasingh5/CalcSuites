function loadAgeCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Age Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="age-birth-date" class="form-label">Date of Birth</label>
                    <input type="date" class="form-control" id="age-birth-date">
                </div>
                
                <div class="mb-3">
                    <label for="age-calc-date" class="form-label">Calculate Age At</label>
                    <div class="input-group">
                        <input type="date" class="form-control" id="age-calc-date">
                        <button class="btn btn-outline-secondary" type="button" onclick="setCurrentDate('age-calc-date')">Today</button>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateAge()">Calculate Age</button>
            </div>
            
            <div class="col-md-6">
                <div id="age-result" class="result-box mt-3" style="display: none;">
                    <h4>Age Results</h4>
                    
                    <div class="mb-3">
                        <h5>Exact Age</h5>
                        <p id="age-exact" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Alternative Formats</h5>
                        <ul class="list-unstyled" id="age-formats"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Upcoming Birthday</h5>
                        <p id="age-next-birthday"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Fun Facts</h5>
                        <ul id="age-facts"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Set default dates
    setCurrentDate('age-calc-date');
}

function setCurrentDate(elementId) {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    document.getElementById(elementId).value = dateString;
}

function calculateAge() {
    const birthDate = new Date(document.getElementById('age-birth-date').value);
    const calcDate = new Date(document.getElementById('age-calc-date').value);
    
    if (!birthDate.getTime() || !calcDate.getTime()) {
        alert('Please enter valid dates');
        return;
    }
    
    if (birthDate > calcDate) {
        alert('Birth date cannot be in the future relative to calculation date');
        return;
    }
    
    // Calculate age
    let years = calcDate.getFullYear() - birthDate.getFullYear();
    let months = calcDate.getMonth() - birthDate.getMonth();
    let days = calcDate.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        const lastMonth = new Date(calcDate.getFullYear(), calcDate.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total values
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor((calcDate - birthDate) / (7 * 24 * 60 * 60 * 1000));
    const totalDays = Math.floor((calcDate - birthDate) / (24 * 60 * 60 * 1000));
    const totalHours = totalDays * 24;
    
    // Calculate next birthday
    const nextBirthday = new Date(calcDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < calcDate) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday - calcDate) / (24 * 60 * 60 * 1000));
    
    // Display results
    document.getElementById('age-result').style.display = 'block';
    
    // Show exact age
    document.getElementById('age-exact').textContent = 
        `${years} years, ${months} months, ${days} days`;
    
    // Show alternative formats
    document.getElementById('age-formats').innerHTML = `
        <li><strong>Total Months:</strong> ${totalMonths}</li>
        <li><strong>Total Weeks:</strong> ${totalWeeks}</li>
        <li><strong>Total Days:</strong> ${totalDays}</li>
        <li><strong>Total Hours:</strong> ${totalHours}</li>
    `;
    
    // Show next birthday
    document.getElementById('age-next-birthday').innerHTML = 
        `Your next birthday is in ${daysUntilBirthday} days<br>
        (${nextBirthday.toLocaleDateString()})`;
    
    // Show fun facts
    const facts = [
        `You've slept approximately ${Math.round(totalDays * 8)} hours`,
        `Your heart has beaten about ${Math.round(totalDays * 24 * 60 * 70)} times`,
        `You've taken around ${Math.round(totalDays * 24 * 60 * 12)} breaths`,
        `You've experienced ${Math.floor(years / 4)} leap years`,
        `You've lived through ${Math.floor(totalDays / 7)} weekends`
    ];
    
    document.getElementById('age-facts').innerHTML = 
        facts.map(fact => `<li>${fact}</li>`).join('');
}
