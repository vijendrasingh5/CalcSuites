function loadEMICalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('EMI Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Loan Amount</label>
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control" id="emi-amount" placeholder="Enter loan amount">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Interest Rate (% per annum)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="emi-interest" step="0.1" placeholder="Enter interest rate">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Loan Tenure</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="emi-tenure" placeholder="Enter loan tenure">
                        <select class="form-select" id="emi-tenure-type">
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Additional Options</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="emi-processing-fee" onchange="toggleProcessingFee()">
                        <label class="form-check-label">Include Processing Fee</label>
                    </div>
                </div>
                
                <div id="processing-fee-input" class="mb-3" style="display: none;">
                    <label class="form-label">Processing Fee</label>
                    <div class="input-group">
                        <select class="form-select" id="processing-fee-type" style="max-width: 100px;">
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                        <input type="number" class="form-control" id="processing-fee-value" step="0.01">
                        <span class="input-group-text" id="processing-fee-symbol">%</span>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateEMI()">Calculate EMI</button>
            </div>
            
            <div class="col-md-6">
                <div id="emi-result" class="result-box mt-3" style="display: none;">
                    <h4>EMI Details</h4>
                    
                    <div class="mb-3">
                        <h5>Monthly EMI</h5>
                        <p id="monthly-emi" class="h4 text-primary"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Loan Summary</h5>
                        <ul class="list-unstyled" id="loan-summary"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Payment Schedule</h5>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Year</th>
                                        <th>Principal (₹)</th>
                                        <th>Interest (₹)</th>
                                        <th>Total Payment (₹)</th>
                                        <th>Balance (₹)</th>
                                    </tr>
                                </thead>
                                <tbody id="payment-schedule"></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <canvas id="emi-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function toggleProcessingFee() {
    const processingFeeInput = document.getElementById('processing-fee-input');
    const includeProcessingFee = document.getElementById('emi-processing-fee').checked;
    processingFeeInput.style.display = includeProcessingFee ? 'block' : 'none';
}

function calculateEMI() {
    // Get input values
    const loanAmount = parseFloat(document.getElementById('emi-amount').value);
    const interestRate = parseFloat(document.getElementById('emi-interest').value);
    const tenure = parseFloat(document.getElementById('emi-tenure').value);
    const tenureType = document.getElementById('emi-tenure-type').value;
    
    // Validate inputs
    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(tenure)) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    // Convert tenure to months if in years
    const tenureMonths = tenureType === 'years' ? tenure * 12 : tenure;
    
    // Calculate processing fee if applicable
    let processingFee = 0;
    if (document.getElementById('emi-processing-fee').checked) {
        const feeValue = parseFloat(document.getElementById('processing-fee-value').value);
        const feeType = document.getElementById('processing-fee-type').value;
        
        if (!isNaN(feeValue)) {
            processingFee = feeType === 'percentage' ? 
                (loanAmount * feeValue / 100) : feeValue;
        }
    }
    
    // Calculate EMI
    const monthlyRate = interestRate / 12 / 100;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    // Calculate yearly breakup
    const yearlyData = calculateYearlyBreakup(loanAmount, emi, monthlyRate, tenureMonths);
    
    // Display results
    displayEMIResults(emi, loanAmount, yearlyData, processingFee);
}

function calculateYearlyBreakup(loanAmount, emi, monthlyRate, tenureMonths) {
    const yearlyData = [];
    let balance = loanAmount;
    let year = 1;
    let monthsInYear = Math.min(12, tenureMonths);
    
    while (balance > 0 && yearlyData.length < Math.ceil(tenureMonths / 12)) {
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;
        
        for (let month = 0; month < monthsInYear; month++) {
            const interest = balance * monthlyRate;
            const principal = emi - interest;
            
            yearlyPrincipal += principal;
            yearlyInterest += interest;
            balance = Math.max(0, balance - principal);
        }
        
        yearlyData.push({
            year: year,
            principal: yearlyPrincipal,
            interest: yearlyInterest,
            payment: yearlyPrincipal + yearlyInterest,
            balance: balance
        });
        
        year++;
        monthsInYear = Math.min(12, tenureMonths - (year - 1) * 12);
    }
    
    return yearlyData;
}

function displayEMIResults(emi, loanAmount, yearlyData, processingFee) {
    document.getElementById('emi-result').style.display = 'block';
    
    // Display monthly EMI
    document.getElementById('monthly-emi').textContent = 
        `₹${emi.toFixed(2)}`;
    
    // Calculate totals
    const totalPayment = yearlyData.reduce((sum, data) => sum + data.payment, 0);
    const totalInterest = yearlyData.reduce((sum, data) => sum + data.interest, 0);
    
    // Display loan summary
    document.getElementById('loan-summary').innerHTML = `
        <li><strong>Loan Amount:</strong> ₹${loanAmount.toFixed(2)}</li>
        <li><strong>Total Interest:</strong> ₹${totalInterest.toFixed(2)}</li>
        <li><strong>Processing Fee:</strong> ₹${processingFee.toFixed(2)}</li>
        <li><strong>Total Payment:</strong> ₹${(totalPayment + processingFee).toFixed(2)}</li>
        <li><strong>Total Cost of Loan:</strong> ₹${(totalInterest + processingFee).toFixed(2)}</li>
    `;
    
    // Display payment schedule
    const tbody = document.getElementById('payment-schedule');
    tbody.innerHTML = yearlyData.map(data => `
        <tr>
            <td>${data.year}</td>
            <td>₹${data.principal.toFixed(2)}</td>
            <td>₹${data.interest.toFixed(2)}</td>
            <td>₹${data.payment.toFixed(2)}</td>
            <td>₹${data.balance.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Create pie chart
    const ctx = document.getElementById('emi-chart').getContext('2d');
    if (window.emiChart) window.emiChart.destroy();
    
    window.emiChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Principal', 'Interest', 'Processing Fee'],
            datasets: [{
                data: [loanAmount, totalInterest, processingFee],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Loan Cost Breakdown'
                }
            }
        }
    });
}
