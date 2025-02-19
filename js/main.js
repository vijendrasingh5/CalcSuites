document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Handle calculator selection
    document.querySelectorAll('.dropdown-item').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop event bubbling
            
            // Get calculator type from data attribute
            const calculatorType = this.getAttribute('data-calculator');
            
            if (calculatorType) {
                // Close the dropdown menu
                const dropdownMenu = this.closest('.dropdown-menu');
                if (dropdownMenu) {
                    const dropdown = dropdownMenu.closest('.dropdown');
                    if (dropdown) {
                        const toggle = dropdown.querySelector('.dropdown-toggle');
                        if (toggle) {
                            bootstrap.Dropdown.getInstance(toggle)?.hide();
                        }
                    }
                }
                
                // Load the calculator
                loadCalculator(calculatorType);
            }
        });
    });

    // Load home page initially
    loadHomePage();
});

// Mega Menu Hover Handling
document.querySelectorAll('.dropdown-megamenu').forEach(menu => {
    menu.addEventListener('mouseenter', (e) => {
        const parent = menu.closest('.dropdown');
        if (!parent.classList.contains('show')) {
            const toggle = parent.querySelector('.dropdown-toggle');
            if (toggle) bootstrap.Dropdown.getOrCreateInstance(toggle).show();
        }
    });

    menu.addEventListener('mouseleave', (e) => {
        const parent = menu.closest('.dropdown');
        const toggle = parent.querySelector('.dropdown-toggle');
        if (toggle) bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
    });
});

function loadCalculator(type) {
    try {
        // Start tracking calculator usage
        startCalculatorTracking(type);
        
        // Track last 5 used calculators
        const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
        if (!history.includes(type)) {
            history.unshift(type);
            localStorage.setItem('calcHistory', JSON.stringify(history.slice(0, 5)));
        }

        // Hide home page content
        const heroSection = document.querySelector('.hero-section');
        const calculatorGrid = document.querySelector('.calculator-grid');
        
        if (heroSection) {
            heroSection.style.display = 'none';
        }
        if (calculatorGrid) {
            calculatorGrid.style.display = 'none';
        }
        
        // Get and validate calculator container
        const calculatorContainer = document.getElementById('calculator-container');
        if (!calculatorContainer) {
            throw new Error('Calculator container not found');
        }
        
        // Show calculator container and clear previous content
        calculatorContainer.style.display = 'block';
        calculatorContainer.innerHTML = '';
        
        // Keep navbar visible
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.display = 'block';
        }

        // Get the calculator loading function name
        const functionName = 'load' + type.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('') + 'Calculator';

        // Get the calculator script
        const scriptPath = `js/calculators/${type}-calculator.js`;
        
        // Check if script is already loaded
        const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
        if (!existingScript) {
            // Load the calculator script dynamically
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => {
                // Once script is loaded, call the calculator function
                if (typeof window[functionName] === 'function') {
                    window[functionName]();
                    trackCalculatorUse(type);
                } else {
                    throw new Error(`Calculator function ${functionName} not found`);
                }
            };
            script.onerror = () => {
                throw new Error(`Failed to load calculator script: ${scriptPath}`);
            };
            document.body.appendChild(script);
        } else {
            // Script already loaded, just call the function
            if (typeof window[functionName] === 'function') {
                window[functionName]();
                trackCalculatorUse(type);
            } else {
                throw new Error(`Calculator function ${functionName} not found`);
            }
        }
    } catch (error) {
        console.error('Error loading calculator:', error);
        
        // Show error message to user
        const container = document.getElementById('calculator-container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Error Loading Calculator</h4>
                    <p>${error.message}</p>
                    <hr>
                    <p class="mb-0">Please try refreshing the page. If the problem persists, contact support.</p>
                </div>
            `;
        }
        
        // Track failed calculator load
        trackCalculatorResult(type, false);
    }
}

// Update loadHomePage to show only the calculator interface
function loadHomePage() {
    const container = document.getElementById('calculator-container');
    container.innerHTML = '';
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.display = 'block';
    }
}

// GPA Calculator Implementation
function loadGPACalculator() {
    const html = `
        <div class="calculator-card">
            <h2>GPA Calculator</h2>
            <div id="courses-container">
                <div class="course-entry mb-3">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <input type="text" class="form-control" placeholder="Course Name">
                        </div>
                        <div class="col-md-3">
                            <select class="form-select grade-select">
                                <option value="4">A</option>
                                <option value="3">B</option>
                                <option value="2">C</option>
                                <option value="1">D</option>
                                <option value="0">F</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <input type="number" class="form-control credits" placeholder="Credits">
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn btn-secondary mb-3" onclick="addCourse()">Add Course</button>
            <button class="btn btn-primary" onclick="calculateGPA()">Calculate GPA</button>
            <div class="result-box mt-3"></div>
        </div>
    `;
    document.getElementById('calculator-container').innerHTML = html;
}

// Mortgage Calculator Implementation
function loadMortgageCalculator() {
    const html = `
        <div class="calculator-card">
            <h2>Mortgage Calculator</h2>
            <div class="row g-3">
                <div class="col-md-6">
                    <label>Loan Amount ($)</label>
                    <input type="number" id="loanAmount" class="form-control">
                </div>
                <div class="col-md-6">
                    <label>Interest Rate (%)</label>
                    <input type="number" step="0.01" id="interestRate" class="form-control">
                </div>
                <div class="col-md-6">
                    <label>Loan Term (years)</label>
                    <input type="number" id="loanTerm" class="form-control">
                </div>
                <div class="col-md-6">
                    <label>Down Payment ($)</label>
                    <input type="number" id="downPayment" class="form-control">
                </div>
                <button class="btn btn-primary" onclick="calculateMortgage()">Calculate</button>
                <div class="result-box mt-3"></div>
            </div>
        </div>
    `;
    document.getElementById('calculator-container').innerHTML = html;
}

// Helper function for GPA Calculator
function addCourse() {
    const coursesContainer = document.getElementById('courses-container');
    const newCourse = document.createElement('div');
    newCourse.className = 'course-entry mb-3';
    newCourse.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Course Name">
            </div>
            <div class="col-md-3">
                <select class="form-select grade-select">
                    <option value="4">A</option>
                    <option value="3">B</option>
                    <option value="2">C</option>
                    <option value="1">D</option>
                    <option value="0">F</option>
                </select>
            </div>
            <div class="col-md-3">
                <input type="number" class="form-control credits" placeholder="Credits">
            </div>
        </div>
    `;
    coursesContainer.appendChild(newCourse);
}

function calculateGPA() {
    const grades = Array.from(document.querySelectorAll('.grade-select')).map(select => parseFloat(select.value));
    const credits = Array.from(document.querySelectorAll('.credits')).map(input => parseFloat(input.value));
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    grades.forEach((grade, index) => {
        totalPoints += grade * credits[index];
        totalCredits += credits[index];
    });
    
    const gpa = totalPoints / totalCredits;
    document.querySelector('.result-box').innerHTML = `
        <h4>Your GPA: ${gpa.toFixed(2)}</h4>
        <p>Total Credits: ${totalCredits}</p>
    `;
}

function calculateMortgage() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
    const loanTerm = parseFloat(document.getElementById('loanTerm').value) * 12;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    
    const principal = loanAmount - downPayment;
    const monthlyPayment = principal * 
        (interestRate * Math.pow(1 + interestRate, loanTerm)) / 
        (Math.pow(1 + interestRate, loanTerm) - 1);
    
    document.querySelector('.result-box').innerHTML = `
        <h4>Monthly Payment: $${monthlyPayment.toFixed(2)}</h4>
        <p>Total Interest: $${(monthlyPayment * loanTerm - principal).toFixed(2)}</p>
    `;
}

// Trip Cost Calculator Implementation
function loadTripCostCalculator() {
    const html = `
        <div class="calculator-card">
            <h2>Trip Cost Calculator</h2>
            <div class="row g-3">
                <div class="col-md-6">
                    <label>Transportation Cost ($)</label>
                    <input type="number" id="transportationCost" class="form-control" min="0">
                </div>
                <div class="col-md-6">
                    <label>Accommodation Cost ($)</label>
                    <input type="number" id="accommodationCost" class="form-control" min="0">
                </div>
                <div class="col-md-6">
                    <label>Food & Dining ($)</label>
                    <input type="number" id="foodCost" class="form-control" min="0">
                </div>
                <div class="col-md-6">
                    <label>Activities & Entertainment ($)</label>
                    <input type="number" id="activitiesCost" class="form-control" min="0">
                </div>
                <div class="col-md-6">
                    <label>Number of Days</label>
                    <input type="number" id="numDays" class="form-control" min="1">
                </div>
                <div class="col-md-6">
                    <label>Number of People</label>
                    <input type="number" id="numPeople" class="form-control" min="1">
                </div>
                <div class="col-12">
                    <button class="btn btn-primary" onclick="calculateTripCost()">Calculate Total Cost</button>
                </div>
                <div class="result-box mt-3"></div>
            </div>
        </div>
    `;
    document.getElementById('calculator-container').innerHTML = html;
}

function calculateTripCost() {
    const transportationCost = parseFloat(document.getElementById('transportationCost').value) || 0;
    const accommodationCost = parseFloat(document.getElementById('accommodationCost').value) || 0;
    const foodCost = parseFloat(document.getElementById('foodCost').value) || 0;
    const activitiesCost = parseFloat(document.getElementById('activitiesCost').value) || 0;
    const numDays = parseInt(document.getElementById('numDays').value) || 1;
    const numPeople = parseInt(document.getElementById('numPeople').value) || 1;

    const dailyCosts = (foodCost + activitiesCost) * numDays;
    const totalCost = transportationCost + accommodationCost + dailyCosts;
    const costPerPerson = totalCost / numPeople;

    document.querySelector('.result-box').innerHTML = `
        <h4>Trip Cost Summary</h4>
        <p>Total Trip Cost: $${totalCost.toFixed(2)}</p>
        <p>Cost per Person: $${costPerPerson.toFixed(2)}</p>
        <p>Daily Cost: $${(dailyCosts / numDays).toFixed(2)}</p>
    `;
}

// Mileage Calculator Implementation
function loadMileageCalculator() {
    const html = `
        <div class="calculator-card">
            <h2>Mileage Calculator</h2>
            <div class="row g-3">
                <div class="col-md-6">
                    <label>Distance (miles)</label>
                    <input type="number" id="distance" class="form-control" min="0">
                </div>
                <div class="col-md-6">
                    <label>Fuel Efficiency (mpg)</label>
                    <input type="number" id="fuelEfficiency" class="form-control" min="0">
                </div>
                <div class="col-md-6">
                    <label>Fuel Price ($/gallon)</label>
                    <input type="number" id="fuelPrice" class="form-control" min="0" step="0.01">
                </div>
                <div class="col-12">
                    <button class="btn btn-primary" onclick="calculateMileage()">Calculate</button>
                </div>
                <div class="mileage-results mt-3">
                    <div class="result-item">
                        <h5>Fuel Required</h5>
                        <div id="fuelRequired">-</div>
                    </div>
                    <div class="result-item">
                        <h5>Fuel Cost</h5>
                        <div id="fuelCost">-</div>
                    </div>
                    <div class="result-item">
                        <h5>Cost per Mile</h5>
                        <div id="costPerMile">-</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('calculator-container').innerHTML = html;
}

function calculateMileage() {
    const distance = parseFloat(document.getElementById('distance').value);
    const fuelEfficiency = parseFloat(document.getElementById('fuelEfficiency').value);
    const fuelPrice = parseFloat(document.getElementById('fuelPrice').value);

    if (!distance || !fuelEfficiency || !fuelPrice) {
        alert('Please fill in all fields with valid numbers');
        return;
    }

    const fuelRequired = distance / fuelEfficiency;
    const totalCost = fuelRequired * fuelPrice;
    const costPerMile = totalCost / distance;

    document.getElementById('fuelRequired').textContent = `${fuelRequired.toFixed(2)} gallons`;
    document.getElementById('fuelCost').textContent = `$${totalCost.toFixed(2)}`;
    document.getElementById('costPerMile').textContent = `$${costPerMile.toFixed(2)}/mile`;
}

// Property Tax Calculator
function loadPropertyTaxCalculator() {
    const html = `
        <div class="calculator-card">
            <h2>Property Tax Calculator</h2>
            <div class="row g-3">
                <div class="col-md-6">
                    <label>Property Value ($)</label>
                    <input type="number" id="propertyValue" class="form-control" min="0">
                </div>
                <div class="col-md-6">
                    <label>Tax Rate (%)</label>
                    <input type="number" id="taxRate" class="form-control" min="0" step="0.01">
                </div>
                <div class="col-12">
                    <button class="btn btn-primary" onclick="calculatePropertyTax()">Calculate Tax</button>
                </div>
                <div class="result-box mt-3"></div>
            </div>
        </div>
    `;
    document.getElementById('calculator-container').innerHTML = html;
}

function calculatePropertyTax() {
    const propertyValue = parseFloat(document.getElementById('propertyValue').value);
    const taxRate = parseFloat(document.getElementById('taxRate').value);

    if (!propertyValue || !taxRate) {
        alert('Please fill in all fields with valid numbers');
        return;
    }

    const annualTax = (propertyValue * taxRate) / 100;
    const monthlyTax = annualTax / 12;

    document.querySelector('.result-box').innerHTML = `
        <h4>Property Tax Summary</h4>
        <p>Annual Property Tax: $${annualTax.toFixed(2)}</p>
        <p>Monthly Tax Payment: $${monthlyTax.toFixed(2)}</p>
    `;
}

// Rent vs Buy Calculator
function loadRentVsBuyCalculator() {
    const html = `
        <div class="calculator-card">
            <h2>Rent vs Buy Calculator</h2>
            <div class="row g-3">
                <div class="col-md-6">
                    <h4>Renting</h4>
                    <label>Monthly Rent ($)</label>
                    <input type="number" id="monthlyRent" class="form-control" min="0">
                    <label>Monthly Utilities ($)</label>
                    <input type="number" id="rentUtilities" class="form-control" min="0">
                    <label>Renter's Insurance ($)</label>
                    <input type="number" id="rentersInsurance" class="form-control" min="0">
                </div>
                <div class="col-md-6">
                    <h4>Buying</h4>
                    <label>Home Price ($)</label>
                    <input type="number" id="homePrice" class="form-control" min="0">
                    <label>Down Payment (%)</label>
                    <input type="number" id="downPaymentPercent" class="form-control" min="0" max="100">
                    <label>Interest Rate (%)</label>
                    <input type="number" id="interestRate" class="form-control" min="0" step="0.01">
                    <label>Property Tax Rate (%)</label>
                    <input type="number" id="propertyTaxRate" class="form-control" min="0" step="0.01">
                    <label>Home Insurance ($)</label>
                    <input type="number" id="homeInsurance" class="form-control" min="0">
                </div>
                <div class="col-12">
                    <button class="btn btn-primary" onclick="calculateRentVsBuy()">Compare</button>
                </div>
                <div class="result-box mt-3"></div>
            </div>
        </div>
    `;
    document.getElementById('calculator-container').innerHTML = html;
}

function calculateRentVsBuy() {
    // Renting costs
    const monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;
    const rentUtilities = parseFloat(document.getElementById('rentUtilities').value) || 0;
    const rentersInsurance = parseFloat(document.getElementById('rentersInsurance').value) || 0;

    // Buying costs
    const homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    const downPaymentPercent = parseFloat(document.getElementById('downPaymentPercent').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const propertyTaxRate = parseFloat(document.getElementById('propertyTaxRate').value) || 0;
    const homeInsurance = parseFloat(document.getElementById('homeInsurance').value) || 0;

    // Calculate total monthly costs
    const totalRentingCost = monthlyRent + rentUtilities + rentersInsurance;

    // Calculate mortgage payment
    const downPayment = (homePrice * downPaymentPercent) / 100;
    const loanAmount = homePrice - downPayment;
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = 30 * 12; // 30-year mortgage

    const monthlyMortgage = loanAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const monthlyPropertyTax = (homePrice * propertyTaxRate / 100) / 12;
    const totalBuyingCost = monthlyMortgage + monthlyPropertyTax + homeInsurance;

    // Display results
    document.querySelector('.result-box').innerHTML = `
        <h4>Monthly Cost Comparison</h4>
        <div class="row">
            <div class="col-md-6">
                <h5>Renting</h5>
                <p>Total Monthly Cost: $${totalRentingCost.toFixed(2)}</p>
                <ul>
                    <li>Rent: $${monthlyRent.toFixed(2)}</li>
                    <li>Utilities: $${rentUtilities.toFixed(2)}</li>
                    <li>Insurance: $${rentersInsurance.toFixed(2)}</li>
                </ul>
            </div>
            <div class="col-md-6">
                <h5>Buying</h5>
                <p>Total Monthly Cost: $${totalBuyingCost.toFixed(2)}</p>
                <ul>
                    <li>Mortgage: $${monthlyMortgage.toFixed(2)}</li>
                    <li>Property Tax: $${monthlyPropertyTax.toFixed(2)}</li>
                    <li>Insurance: $${homeInsurance.toFixed(2)}</li>
                </ul>
            </div>
        </div>
        <div class="mt-3">
            <h5>Verdict</h5>
            <p>${totalRentingCost < totalBuyingCost ? 
                'Renting is cheaper by $' + (totalBuyingCost - totalRentingCost).toFixed(2) + ' per month' : 
                'Buying is cheaper by $' + (totalRentingCost - totalBuyingCost).toFixed(2) + ' per month'}</p>
        </div>
    `;
}

// Student Loan Calculator Implementation
function loadStudentLoanCalculator() {
    const html = `
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Student Loan Calculator</h5>
            </div>
            <div class="card-body">
                <form id="studentLoanForm">
                    <div class="mb-3">
                        <label for="loanAmount" class="form-label">Loan Amount ($)</label>
                        <input type="number" class="form-control" id="loanAmount" required min="0" step="100">
                    </div>
                    <div class="mb-3">
                        <label for="interestRate" class="form-label">Annual Interest Rate (%)</label>
                        <input type="number" class="form-control" id="interestRate" required min="0" max="30" step="0.1">
                    </div>
                    <div class="mb-3">
                        <label for="loanTerm" class="form-label">Loan Term (years)</label>
                        <input type="number" class="form-control" id="loanTerm" required min="1" max="30">
                    </div>
                    <div class="mb-3">
                        <label for="paymentFrequency" class="form-label">Payment Frequency</label>
                        <select class="form-select" id="paymentFrequency">
                            <option value="12">Monthly</option>
                            <option value="26">Bi-weekly</option>
                            <option value="52">Weekly</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Calculate</button>
                </form>
                <div id="loanResults" class="mt-4" style="display: none;">
                    <h6>Loan Summary</h6>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>Payment Amount:</td>
                                <td id="paymentAmount">$0</td>
                            </tr>
                            <tr>
                                <td>Total Interest:</td>
                                <td id="totalInterest">$0</td>
                            </tr>
                            <tr>
                                <td>Total Amount to be Paid:</td>
                                <td id="totalAmount">$0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('calculator-container').innerHTML = html;
    
    // Add event listener for form submission
    document.getElementById('studentLoanForm').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateStudentLoan();
    });
}

function calculateStudentLoan() {
    // Get input values
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const annualRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const years = parseInt(document.getElementById('loanTerm').value);
    const paymentsPerYear = parseInt(document.getElementById('paymentFrequency').value);
    
    // Calculate periodic interest rate
    const periodicRate = annualRate / paymentsPerYear;
    
    // Calculate total number of payments
    const totalPayments = years * paymentsPerYear;
    
    // Calculate payment amount using loan payment formula
    // PMT = PV * (r * (1 + r)^n) / ((1 + r)^n - 1)
    // where: PMT = Payment, PV = Present Value, r = Periodic Rate, n = Total Payments
    const payment = loanAmount * 
        (periodicRate * Math.pow(1 + periodicRate, totalPayments)) / 
        (Math.pow(1 + periodicRate, totalPayments) - 1);
    
    // Calculate total amount and interest
    const totalAmount = payment * totalPayments;
    const totalInterest = totalAmount - loanAmount;
    
    // Display results
    document.getElementById('loanResults').style.display = 'block';
    document.getElementById('paymentAmount').textContent = formatCurrency(payment);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
}

function formatCurrency(amount) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// ROI Calculator Implementation
function loadROICalculator() {
    const html = `
        <div class="calculator-card">
            <h2>Return on Investment (ROI) Calculator</h2>
            <div class="mb-3">
                <label for="initial-investment" class="form-label">Initial Investment ($)</label>
                <input type="number" class="form-control" id="initial-investment" placeholder="Enter initial investment amount">
            </div>
            <div class="mb-3">
                <label for="final-value" class="form-label">Final Value ($)</label>
                <input type="number" class="form-control" id="final-value" placeholder="Enter final value">
            </div>
            <div class="mb-3">
                <label for="time-period" class="form-label">Time Period (Years)</label>
                <input type="number" class="form-control" id="time-period" placeholder="Enter time period">
            </div>
            <button class="btn btn-primary" onclick="calculateROI()">Calculate ROI</button>
            <div class="result-box mt-3"></div>
        </div>
    `;
    document.getElementById('calculator-container').innerHTML = html;
}

function calculateROI() {
    const initialInvestment = parseFloat(document.getElementById('initial-investment').value);
    const finalValue = parseFloat(document.getElementById('final-value').value);
    const timePeriod = parseFloat(document.getElementById('time-period').value);
    const resultBox = document.querySelector('.result-box');

    if (!validateNumber(initialInvestment) || !validateNumber(finalValue) || !validateNumber(timePeriod)) {
        resultBox.innerHTML = '<div class="alert alert-danger">Please enter valid numbers for all fields</div>';
        return;
    }

    if (initialInvestment <= 0 || finalValue < 0 || timePeriod <= 0) {
        resultBox.innerHTML = '<div class="alert alert-danger">Please enter valid positive numbers</div>';
        return;
    }

    // Calculate ROI
    const totalROI = ((finalValue - initialInvestment) / initialInvestment) * 100;
    const annualROI = (totalROI / timePeriod);

    resultBox.innerHTML = `
        <div class="alert alert-success">
            <p><strong>Total ROI:</strong> ${formatNumber(totalROI)}%</p>
            <p><strong>Annual ROI:</strong> ${formatNumber(annualROI)}%</p>
            <p><strong>Total Profit/Loss:</strong> $${formatNumber(finalValue - initialInvestment)}</p>
        </div>
    `;
}

// Compound Interest Calculator Implementation
function loadCompoundInterestCalculator() {
    const html = `
        <div class="calculator-card">
            <h2>Compound Interest Calculator</h2>
            <div class="mb-3">
                <label for="principal" class="form-label">Principal Amount ($)</label>
                <input type="number" class="form-control" id="principal" placeholder="Enter initial principal amount">
            </div>
            <div class="mb-3">
                <label for="interest-rate" class="form-label">Annual Interest Rate (%)</label>
                <input type="number" class="form-control" id="interest-rate" placeholder="Enter annual interest rate">
            </div>
            <div class="mb-3">
                <label for="time" class="form-label">Time (Years)</label>
                <input type="number" class="form-control" id="time" placeholder="Enter time period">
            </div>
            <div class="mb-3">
                <label for="compound-frequency" class="form-label">Compound Frequency</label>
                <select class="form-select" id="compound-frequency">
                    <option value="1">Annually</option>
                    <option value="2">Semi-annually</option>
                    <option value="4">Quarterly</option>
                    <option value="12" selected>Monthly</option>
                    <option value="365">Daily</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="monthly-contribution" class="form-label">Monthly Contribution ($)</label>
                <input type="number" class="form-control" id="monthly-contribution" placeholder="Enter monthly contribution (optional)" value="0">
            </div>
            <button class="btn btn-primary" onclick="calculateCompoundInterest()">Calculate</button>
            <div class="result-box mt-3"></div>
        </div>
    `;
    document.getElementById('calculator-container').innerHTML = html;
}

function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const time = parseFloat(document.getElementById('time').value);
    const frequency = parseFloat(document.getElementById('compound-frequency').value);
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
    const resultBox = document.querySelector('.result-box');

    if (!validateNumber(principal) || !validateNumber(rate) || !validateNumber(time)) {
        resultBox.innerHTML = '<div class="alert alert-danger">Please enter valid numbers for all required fields</div>';
        return;
    }

    if (principal < 0 || rate < 0 || time <= 0) {
        resultBox.innerHTML = '<div class="alert alert-danger">Please enter valid positive numbers</div>';
        return;
    }

    // Calculate compound interest with monthly contributions
    const n = frequency; // number of times interest is compounded per year
    const t = time; // time in years
    const r = rate; // annual interest rate
    const P = principal; // principal amount
    const PMT = monthlyContribution * 12 / n; // payment per period

    // Calculate amount with compound interest
    let amount;
    if (PMT === 0) {
        // Without monthly contributions
        amount = P * Math.pow(1 + r/n, n*t);
    } else {
        // With monthly contributions
        amount = P * Math.pow(1 + r/n, n*t) + 
                PMT * (Math.pow(1 + r/n, n*t) - 1) / (r/n);
    }

    const totalContributions = principal + (monthlyContribution * 12 * time);
    const interestEarned = amount - totalContributions;

    resultBox.innerHTML = `
        <div class="alert alert-success">
            <p><strong>Final Amount:</strong> ${formatCurrency(amount)}</p>
            <p><strong>Total Contributions:</strong> ${formatCurrency(totalContributions)}</p>
            <p><strong>Interest Earned:</strong> ${formatCurrency(interestEarned)}</p>
            <hr>
            <p><small>Compounded ${frequency === 1 ? 'annually' : 
                                 frequency === 2 ? 'semi-annually' : 
                                 frequency === 4 ? 'quarterly' : 
                                 frequency === 12 ? 'monthly' : 'daily'}</small></p>
        </div>
    `;
}

// Placeholder functions for other calculators
function loadScholarshipCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Scholarship Calculator (Coming Soon)');
}

function loadIPSubnetCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('IP Subnet Calculator (Coming Soon)');
}

function loadPasswordGenerator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Password Generator (Coming Soon)');
}

function loadBandwidthCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Bandwidth Calculator (Coming Soon)');
}

function loadEMICalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('EMI Calculator (Coming Soon)');
}

function loadInvestmentCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Investment Calculator (Coming Soon)');
}

function loadFinanceCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Finance Calculator (Coming Soon)');
}

function loadInterestRateCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Interest Rate Calculator (Coming Soon)');
}

function loadInterestCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Interest Calculator (Coming Soon)');
}

function loadSavingsCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Savings Calculator (Coming Soon)');
}

function loadSimpleInterestCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Simple Interest Calculator (Coming Soon)');
}

function loadCDCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('CD Calculator (Coming Soon)');
}

function loadBondCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Bond Calculator (Coming Soon)');
}

function loadAverageReturnCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Average Return Calculator (Coming Soon)');
}

function loadPaybackPeriodCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Payback Period Calculator (Coming Soon)');
}

function loadPresentValueCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Present Value Calculator (Coming Soon)');
}

function loadFutureValueCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Future Value Calculator (Coming Soon)');
}

function loadScientificCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Scientific Calculator (Coming Soon)');
}

function loadFractionCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Fraction Calculator (Coming Soon)');
}

function loadPercentageCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Percentage Calculator (Coming Soon)');
}

function loadRandomNumberCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Random Number Calculator (Coming Soon)');
}

function loadExponentCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Exponent Calculator (Coming Soon)');
}

function loadBinaryCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Binary Calculator (Coming Soon)');
}

function loadMatrixCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Matrix Calculator (Coming Soon)');
}

function loadHexCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Hex Calculator (Coming Soon)');
}

function loadHalfLifeCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Half Life Calculator (Coming Soon)');
}

function loadQuadraticCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Quadratic Calculator (Coming Soon)');
}

function loadLogCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Log Calculator (Coming Soon)');
}

function loadRatioCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Ratio Calculator (Coming Soon)');
}

function loadRootCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Root Calculator (Coming Soon)');
}

function loadLCMCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('LCM Calculator (Coming Soon)');
}

function loadGCFCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('GCF Calculator (Coming Soon)');
}

function loadFactorCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Factor Calculator (Coming Soon)');
}

function loadRoundingCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Rounding Calculator (Coming Soon)');
}

function loadScientificNotationCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Scientific Notation Calculator (Coming Soon)');
}

function loadBigNumberCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Big Number Calculator (Coming Soon)');
}

function loadStandardDeviationCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Standard Deviation Calculator (Coming Soon)');
}

function loadNumberSequenceCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Number Sequence Calculator (Coming Soon)');
}

function loadSampleSizeCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Sample Size Calculator (Coming Soon)');
}

function loadProbabilityCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Probability Calculator (Coming Soon)');
}

function loadStatisticsCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Statistics Calculator (Coming Soon)');
}

function loadMeanMedianModeCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Mean Median Mode Calculator (Coming Soon)');
}

function loadPermutationCombinationCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Permutation Combination Calculator (Coming Soon)');
}

function loadZScoreCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Z Score Calculator (Coming Soon)');
}

function loadConfidenceIntervalCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Confidence Interval Calculator (Coming Soon)');
}

function loadTriangleCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Triangle Calculator (Coming Soon)');
}

function loadVolumeCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Volume Calculator (Coming Soon)');
}

function loadSlopeCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Slope Calculator (Coming Soon)');
}

function loadAreaCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Area Calculator (Coming Soon)');
}

function loadDistanceCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Distance Calculator (Coming Soon)');
}

function loadCircleCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Circle Calculator (Coming Soon)');
}

function loadSurfaceAreaCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Surface Area Calculator (Coming Soon)');
}

function loadPythagoreanCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Pythagorean Calculator (Coming Soon)');
}

function loadRightTriangleCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Right Triangle Calculator (Coming Soon)');
}

function loadRectangleCalculator() {
    document.getElementById('calculator-container').innerHTML = createCalculatorCard('Rectangle Calculator (Coming Soon)');
}

// Analytics Tracking Functions
function trackCalculatorUse(calculatorType) {
    gtag('event', 'calculator_use', {
        'event_category': 'Calculator',
        'event_label': calculatorType,
        'calculator_type': calculatorType,
        'value': 1
    });
}

function trackCalculationTime(calculatorType, timeInSeconds) {
    gtag('event', 'calculation_time', {
        'event_category': 'Performance',
        'event_label': calculatorType,
        'calculator_type': calculatorType,
        'value': timeInSeconds
    });
}

function trackBlogRead(articleTitle, timeSpentSeconds) {
    gtag('event', 'blog_read', {
        'event_category': 'Engagement',
        'event_label': articleTitle,
        'article_title': articleTitle,
        'time_spent': timeSpentSeconds
    });
}

function trackCalculatorResult(calculatorType, hasResult) {
    gtag('event', 'calculation_completed', {
        'event_category': 'Conversion',
        'event_label': calculatorType,
        'calculator_type': calculatorType,
        'has_result': hasResult
    });
}

// Time tracking variables
let startTime = Date.now();
let calculatorStartTime = null;

// Track time spent on blog articles
if (document.querySelector('article.blog-post')) {
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const articleTitle = document.querySelector('h1').innerText;
        trackBlogRead(articleTitle, timeSpent);
    });
}

// Track calculator usage time
function startCalculatorTracking(calculatorType) {
    calculatorStartTime = Date.now();
    trackCalculatorUse(calculatorType);
}

function endCalculatorTracking(calculatorType, hasResult = true) {
    if (calculatorStartTime) {
        const timeSpent = Math.round((Date.now() - calculatorStartTime) / 1000);
        trackCalculationTime(calculatorType, timeSpent);
        trackCalculatorResult(calculatorType, hasResult);
        calculatorStartTime = null;
    }
}

// Add tracking to calculator buttons
document.addEventListener('DOMContentLoaded', function() {
    const calculatorButtons = document.querySelectorAll('[data-calculator-type]');
    calculatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const calculatorType = this.dataset.calculatorType;
            startCalculatorTracking(calculatorType);
        });
    });
});

// Utility functions
function createCalculatorCard(title) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <h5 class="card-title mb-0">${title}</h5>
        </div>
        <div class="card-body">
            <p>Coming soon...</p>
        </div>
    `;
    return card;
}

function formatNumber(number, decimals = 2) {
    return Number(number).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function validateNumber(input) {
    return !isNaN(parseFloat(input)) && isFinite(input);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}