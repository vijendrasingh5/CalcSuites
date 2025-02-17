document.addEventListener('DOMContentLoaded', function() {
    // Handle calculator selection from all possible sources
    document.querySelectorAll('[data-calculator]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const calculatorType = this.getAttribute('data-calculator');
            if (calculatorType) {
                loadCalculator(calculatorType);
            }
        });
    });

    // Handle calculator cards
    document.querySelectorAll('.card[onclick]').forEach(card => {
        card.addEventListener('click', function(e) {
            const onclickValue = this.getAttribute('onclick');
            const calculatorType = onclickValue?.match(/loadCalculator\('(.+)'\)/)?.[1];
            if (calculatorType) {
                loadCalculator(calculatorType);
            }
        });
    });

    // Load home page initially
    loadHomePage();
});

function loadCalculator(type) {
    const container = document.getElementById('calculator-container');
    
    // Clear previous calculator
    if (container) {
        container.innerHTML = '';
    } else {
        console.error('Calculator container not found');
        return;
    }
    
    // Hide the hero section when showing a calculator
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.display = 'none';
    }
    
    try {
        switch(type) {
            // General Tools
            case 'unit-converter':
                loadUnitConverter();
                break;
            case 'currency-converter':
                loadCurrencyConverter();
                break;
                
            // Health & Fitness
            case 'bmi':
                loadBMICalculator();
                break;
            case 'bmr':
                loadBMRCalculator();
                break;
            case 'body-fat':
                loadBodyFatCalculator();
                break;
                
            // Finance
            case 'emi':
                loadEMICalculator();
                break;
            case 'compound-interest':
                loadCompoundInterestCalculator();
                break;
            case 'simple-interest':
                loadSimpleInterestCalculator();
                break;
                
            // Mathematical
            case 'scientific':
                loadScientificCalculator();
                break;
            case 'percentage':
                loadPercentageCalculator();
                break;
                
            default:
                console.error('Unknown calculator type:', type);
                container.innerHTML = '<div class="alert alert-danger">Calculator not found</div>';
        }
    } catch (error) {
        console.error('Error loading calculator:', error);
        container.innerHTML = '<div class="alert alert-danger">Error loading calculator</div>';
    }
}

function loadHomePage() {
    const container = document.getElementById('calculator-container');
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        heroSection.style.display = 'block';
    }
    
    if (container) {
        // Show the default calculator cards
        container.innerHTML = `
            <div class="row text-center mt-4">
                <div class="col-md-4">
                    <div class="card p-3 shadow-sm" onclick="loadCalculator('emi')">
                        <h5>EMI Calculator</h5>
                        <p class="text-muted">Calculate your monthly EMI payments</p>
                        <a href="#" class="btn btn-outline-primary">Try Now</a>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3 shadow-sm" onclick="loadCalculator('bmi')">
                        <h5>BMI Calculator</h5>
                        <p class="text-muted">Check your Body Mass Index</p>
                        <a href="#" class="btn btn-outline-primary">Calculate BMI</a>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3 shadow-sm" onclick="loadCalculator('unit-converter')">
                        <h5>Unit Converter</h5>
                        <p class="text-muted">Convert between different units</p>
                        <a href="#" class="btn btn-outline-primary">Convert Now</a>
                    </div>
                </div>
            </div>
        `;
    }
}

// Utility function to create calculator cards
function createCalculatorCard(title) {
    return `
        <div class="calculator-card">
            <h2 class="text-center mb-4">${title}</h2>
            <div class="calculator-form">
                <!-- Calculator content will be inserted here -->
            </div>
        </div>
    `;
}

// Utility function to format numbers
function formatNumber(number, decimals = 2) {
    return Number(number).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Utility function to validate number input
function validateNumber(input) {
    return !isNaN(input) && isFinite(input) && input !== '';
}

// Utility functions
function createCalculatorCard(title) {
    try {
        const card = document.createElement('div');
        card.className = 'calculator-card';
        card.innerHTML = `
            <h3>${title}</h3>
            <div class="calculator-content"></div>
        `;
        return card;
    } catch (error) {
        console.error('Error creating calculator card:', error);
        return null;
    }
}

function formatNumber(number, decimals = 2) {
    return Number(number).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function validateNumber(input) {
    return !isNaN(input) && input !== '' && input !== null && input !== undefined;
}
