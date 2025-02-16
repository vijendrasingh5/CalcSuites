function loadOneRepMaxCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('One Rep Max (1RM) Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="orm-weight" class="form-label">Weight Lifted</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="orm-weight" step="0.5" oninput="calculateOneRepMax()">
                        <select class="form-select" id="orm-weight-unit" onchange="calculateOneRepMax()">
                            <option value="kg">kg</option>
                            <option value="lbs">lbs</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="orm-reps" class="form-label">Repetitions Performed</label>
                    <input type="number" class="form-control" id="orm-reps" min="1" max="20" step="1" oninput="calculateOneRepMax()">
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Formula</label>
                    <select class="form-select" id="orm-formula" onchange="calculateOneRepMax()">
                        <option value="brzycki">Brzycki Formula</option>
                        <option value="epley">Epley Formula</option>
                        <option value="lander">Lander Formula</option>
                        <option value="lombardi">Lombardi Formula</option>
                        <option value="mayhew">Mayhew Formula</option>
                    </select>
                </div>
                
                <button class="btn btn-primary" onclick="calculateOneRepMax()">Calculate 1RM</button>
            </div>
            
            <div class="col-md-6">
                <div id="orm-result" class="result-box mt-3" style="display: none;">
                    <h4>Your One Rep Max Results</h4>
                    <div class="mb-3">
                        <strong>Estimated 1RM:</strong>
                        <p id="orm-max"></p>
                    </div>
                    
                    <div class="mb-4">
                        <h5>Percentage Table</h5>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Percentage</th>
                                        <th>Weight</th>
                                        <th>Reps</th>
                                    </tr>
                                </thead>
                                <tbody id="orm-percentages">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="alert alert-info">
                        <strong>Training Recommendations:</strong>
                        <ul class="mb-0">
                            <li>Strength: 85-95% of 1RM for 1-5 reps</li>
                            <li>Hypertrophy: 67-85% of 1RM for 6-12 reps</li>
                            <li>Endurance: 50-67% of 1RM for 12+ reps</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function calculateOneRepMax() {
    const weight = parseFloat(document.getElementById('orm-weight').value);
    const reps = parseInt(document.getElementById('orm-reps').value);
    const formula = document.getElementById('orm-formula').value;
    const unit = document.getElementById('orm-weight-unit').value;
    
    if (!weight || !reps || reps < 1 || reps > 20) {
        document.getElementById('orm-result').style.display = 'none';
        return;
    }
    
    // Calculate 1RM using selected formula
    let oneRepMax;
    switch(formula) {
        case 'brzycki':
            oneRepMax = weight * (36 / (37 - reps));
            break;
        case 'epley':
            oneRepMax = weight * (1 + 0.0333 * reps);
            break;
        case 'lander':
            oneRepMax = (100 * weight) / (101.3 - 2.67123 * reps);
            break;
        case 'lombardi':
            oneRepMax = weight * Math.pow(reps, 0.10);
            break;
        case 'mayhew':
            oneRepMax = (100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps));
            break;
    }
    
    // Display results
    document.getElementById('orm-result').style.display = 'block';
    document.getElementById('orm-max').textContent = 
        `${formatNumber(oneRepMax, 1)} ${unit}`;
    
    // Generate percentage table
    const percentages = [
        {percent: 95, reps: "2-3"},
        {percent: 90, reps: "4"},
        {percent: 85, reps: "5-6"},
        {percent: 80, reps: "7-8"},
        {percent: 75, reps: "9-10"},
        {percent: 70, reps: "11-12"},
        {percent: 65, reps: "13-14"},
        {percent: 60, reps: "15-16"},
        {percent: 55, reps: "17-18"},
        {percent: 50, reps: "19-20"}
    ];
    
    const tableHTML = percentages.map(p => `
        <tr>
            <td>${p.percent}%</td>
            <td>${formatNumber(oneRepMax * p.percent / 100, 1)} ${unit}</td>
            <td>${p.reps}</td>
        </tr>
    `).join('');
    
    document.getElementById('orm-percentages').innerHTML = tableHTML;
}
