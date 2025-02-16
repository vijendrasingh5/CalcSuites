function loadPercentageCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Percentage Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <!-- Common Percentage Calculations -->
                <div class="card mb-4">
                    <div class="card-header">
                        <ul class="nav nav-tabs card-header-tabs" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" data-bs-toggle="tab" href="#percentage-of" role="tab">Percentage Of</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-bs-toggle="tab" href="#percentage-change" role="tab">Percentage Change</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-bs-toggle="tab" href="#ratio-to-percent" role="tab">Ratio to Percent</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <!-- Percentage Of Calculator -->
                            <div class="tab-pane fade show active" id="percentage-of" role="tabpanel">
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <input type="number" class="form-control" id="percent-value" placeholder="Percentage" step="0.01">
                                        <label class="form-text">Percentage (%)</label>
                                    </div>
                                    <div class="col-md-4">
                                        <input type="number" class="form-control" id="total-value" placeholder="Number">
                                        <label class="form-text">of this number</label>
                                    </div>
                                    <div class="col-md-4">
                                        <button class="btn btn-primary w-100" onclick="calculatePercentageOf()">Calculate</button>
                                    </div>
                                    <div class="col-12">
                                        <div class="alert alert-info mb-0" id="percentage-of-result" style="display: none;">
                                            Result: <span class="result-value">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Percentage Change Calculator -->
                            <div class="tab-pane fade" id="percentage-change" role="tabpanel">
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <input type="number" class="form-control" id="original-value" placeholder="Original Value">
                                        <label class="form-text">Original Value</label>
                                    </div>
                                    <div class="col-md-4">
                                        <input type="number" class="form-control" id="new-value" placeholder="New Value">
                                        <label class="form-text">New Value</label>
                                    </div>
                                    <div class="col-md-4">
                                        <button class="btn btn-primary w-100" onclick="calculatePercentageChange()">Calculate</button>
                                    </div>
                                    <div class="col-12">
                                        <div class="alert alert-info mb-0" id="percentage-change-result" style="display: none;">
                                            Result: <span class="result-value">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Ratio to Percentage Calculator -->
                            <div class="tab-pane fade" id="ratio-to-percent" role="tabpanel">
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <input type="number" class="form-control" id="ratio-part" placeholder="Part">
                                        <label class="form-text">Part</label>
                                    </div>
                                    <div class="col-md-4">
                                        <input type="number" class="form-control" id="ratio-whole" placeholder="Whole">
                                        <label class="form-text">Whole</label>
                                    </div>
                                    <div class="col-md-4">
                                        <button class="btn btn-primary w-100" onclick="calculateRatioToPercent()">Calculate</button>
                                    </div>
                                    <div class="col-12">
                                        <div class="alert alert-info mb-0" id="ratio-to-percent-result" style="display: none;">
                                            Result: <span class="result-value">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Percentage Tools -->
                <div class="row g-4">
                    <!-- Percentage Increase/Decrease -->
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Quick Increase/Decrease</h5>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <input type="number" class="form-control" id="quick-value" placeholder="Value">
                                    </div>
                                    <div class="col-6">
                                        <input type="number" class="form-control" id="quick-percent" placeholder="Percent">
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-secondary w-100" onclick="calculateQuickIncrease()">Increase</button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-secondary w-100" onclick="calculateQuickDecrease()">Decrease</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Common Percentages -->
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Common Percentages</h5>
                                <div class="row g-2">
                                    <div class="col-12">
                                        <input type="number" class="form-control" id="common-value" placeholder="Enter value">
                                    </div>
                                    <div class="col-4">
                                        <button class="btn btn-outline-secondary w-100" onclick="calculateCommonPercent(10)">10%</button>
                                    </div>
                                    <div class="col-4">
                                        <button class="btn btn-outline-secondary w-100" onclick="calculateCommonPercent(15)">15%</button>
                                    </div>
                                    <div class="col-4">
                                        <button class="btn btn-outline-secondary w-100" onclick="calculateCommonPercent(20)">20%</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tips and Information -->
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Tips & Formulas</h5>
                        <div class="mb-3">
                            <h6>Percentage Of</h6>
                            <p class="text-muted small">
                                (Percentage × Value) ÷ 100
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Percentage Change</h6>
                            <p class="text-muted small">
                                ((New - Original) ÷ Original) × 100
                            </p>
                        </div>
                        <div class="mb-3">
                            <h6>Ratio to Percentage</h6>
                            <p class="text-muted small">
                                (Part ÷ Whole) × 100
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);
}

function calculatePercentageOf() {
    const percent = parseFloat(document.getElementById('percent-value').value);
    const total = parseFloat(document.getElementById('total-value').value);
    
    if (isNaN(percent) || isNaN(total)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const result = (percent * total) / 100;
    const resultElement = document.getElementById('percentage-of-result');
    resultElement.style.display = 'block';
    resultElement.querySelector('.result-value').textContent = 
        `${result.toFixed(2)} (${percent}% of ${total})`;
}

function calculatePercentageChange() {
    const original = parseFloat(document.getElementById('original-value').value);
    const newValue = parseFloat(document.getElementById('new-value').value);
    
    if (isNaN(original) || isNaN(newValue)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (original === 0) {
        alert('Original value cannot be zero');
        return;
    }
    
    const change = ((newValue - original) / original) * 100;
    const resultElement = document.getElementById('percentage-change-result');
    resultElement.style.display = 'block';
    resultElement.querySelector('.result-value').textContent = 
        `${change.toFixed(2)}% ${change >= 0 ? 'increase' : 'decrease'}`;
}

function calculateRatioToPercent() {
    const part = parseFloat(document.getElementById('ratio-part').value);
    const whole = parseFloat(document.getElementById('ratio-whole').value);
    
    if (isNaN(part) || isNaN(whole)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (whole === 0) {
        alert('Whole value cannot be zero');
        return;
    }
    
    const percent = (part / whole) * 100;
    const resultElement = document.getElementById('ratio-to-percent-result');
    resultElement.style.display = 'block';
    resultElement.querySelector('.result-value').textContent = 
        `${percent.toFixed(2)}% (${part}:${whole})`;
}

function calculateQuickIncrease() {
    const value = parseFloat(document.getElementById('quick-value').value);
    const percent = parseFloat(document.getElementById('quick-percent').value);
    
    if (isNaN(value) || isNaN(percent)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const result = value * (1 + percent/100);
    alert(`${value} increased by ${percent}% = ${result.toFixed(2)}`);
}

function calculateQuickDecrease() {
    const value = parseFloat(document.getElementById('quick-value').value);
    const percent = parseFloat(document.getElementById('quick-percent').value);
    
    if (isNaN(value) || isNaN(percent)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const result = value * (1 - percent/100);
    alert(`${value} decreased by ${percent}% = ${result.toFixed(2)}`);
}

function calculateCommonPercent(percent) {
    const value = parseFloat(document.getElementById('common-value').value);
    
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }
    
    const result = (value * percent) / 100;
    alert(`${percent}% of ${value} = ${result.toFixed(2)}`);
}
