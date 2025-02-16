document.addEventListener('DOMContentLoaded', function() {
    // Handle calculator selection
    document.querySelectorAll('.dropdown-item').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const calculatorType = this.getAttribute('data-calculator') || 
                                 this.getAttribute('onclick')?.match(/loadCalculator\('(.+)'\)/)?.[1];
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
    container.innerHTML = '';
    
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
            case 'ideal-weight':
                loadIdealWeightCalculator();
                break;
            case 'one-rep-max':
                loadOneRepMaxCalculator();
                break;
            case 'pace':
                loadPaceCalculator();
                break;
            case 'calories-burned':
                loadCaloriesBurnedCalculator();
                break;
            case 'army-body-fat':
                loadArmyBodyFatCalculator();
                break;
            case 'lean-body-mass':
                loadLeanBodyMassCalculator();
                break;
            case 'healthy-weight':
                loadHealthyWeightCalculator();
                break;
                
            // Student Tools
            case 'gpa':
                loadGPACalculator();
                break;
            case 'grade':
                loadGradeCalculator();
                break;
                
            // Date & Time
            case 'age':
                loadAgeCalculator();
                break;
            case 'date':
                loadDateCalculator();
                break;
            case 'time':
                loadTimeCalculator();
                break;
            case 'hours':
                loadHoursCalculator();
                break;
            case 'time-card':
                loadTimeCardCalculator();
                break;
            case 'time-zone-converter':
                loadTimeZoneCalculator();
                break;
            case 'time-duration':
                loadTimeDurationCalculator();
                break;
            case 'days-between-dates':
                loadDaysBetweenDatesCalculator();
                break;
            case 'day-of-week':
                loadDayOfWeekCalculator();
                break;
                
            // Internet & Security
            case 'ip-subnet':
                loadIPSubnetCalculator();
                break;
            case 'password':
                loadPasswordGenerator();
                break;
            case 'bandwidth':
                loadBandwidthCalculator();
                break;
                
            // Finance & Business
            case 'emi':
                loadEMICalculator();
                break;
            case 'investment':
                loadInvestmentCalculator();
                break;
            case 'finance':
                loadFinanceCalculator();
                break;
            case 'compound-interest':
                loadCompoundInterestCalculator();
                break;
            case 'interest-rate':
            case 'interest-rate-calculator':
                loadInterestRateCalculator();
                break;
            case 'interest':
                loadInterestCalculator();
                break;
            case 'savings':
                loadSavingsCalculator();
                break;
            case 'simple-interest':
                loadSimpleInterestCalculator();
                break;
            case 'cd':
                loadCDCalculator();
                break;
            case 'bond':
                loadBondCalculator();
                break;
            case 'average-return':
                loadAverageReturnCalculator();
                break;
            case 'roi':
                loadROICalculator();
                break;
            case 'payback-period':
                loadPaybackPeriodCalculator();
                break;
            case 'present-value':
                loadPresentValueCalculator();
                break;
            case 'future-value':
                loadFutureValueCalculator();
                break;

            // Mathematical
            case 'scientific-calculator':
                loadScientificCalculator();
                break;
            case 'fraction-calculator':
                loadFractionCalculator();
                break;
            case 'percentage-calculator':
                loadPercentageCalculator();
                break;
            case 'random-number-calculator':
                loadRandomNumberCalculator();
                break;
            case 'exponent-calculator':
                loadExponentCalculator();
                break;
            case 'binary-calculator':
                loadBinaryCalculator();
                break;
            case 'matrix-calculator':
                loadMatrixCalculator();
                break;
            case 'binary':
                loadBinaryCalculator();
                break;
            case 'hex':
                loadHexCalculator();
                break;
            case 'half-life':
                loadHalfLifeCalculator();
                break;
            case 'quadratic':
                loadQuadraticCalculator();
                break;
            case 'log':
                loadLogCalculator();
                break;
            case 'ratio':
                loadRatioCalculator();
                break;
            case 'root':
                loadRootCalculator();
                break;
            case 'lcm':
                loadLCMCalculator();
                break;
            case 'gcf':
                loadGCFCalculator();
                break;
            case 'factor':
                loadFactorCalculator();
                break;
            case 'rounding':
                loadRoundingCalculator();
                break;
            case 'matrix':
                loadMatrixCalculator();
                break;
            case 'scientific-notation':
                loadScientificNotationCalculator();
                break;
            case 'big-number':
                loadBigNumberCalculator();
                break;

            // Statistics
            case 'standard-deviation':
            case 'standard-deviation-calculator':
                loadStandardDeviationCalculator();
                break;
            case 'number-sequence':
                loadNumberSequenceCalculator();
                break;
            case 'sample-size':
                loadSampleSizeCalculator();
                break;
            case 'probability':
                loadProbabilityCalculator();
                break;
            case 'statistics':
                loadStatisticsCalculator();
                break;
            case 'mean-median-mode-calculator':
                loadMeanMedianModeCalculator();
                break;
            case 'permutation-combination-calculator':
                loadPermutationCombinationCalculator();
                break;
            case 'sample-size-calculator':
                loadSampleSizeCalculator();
                break;
            case 'z-score-calculator':
                loadZScoreCalculator();
                break;
            case 'probability-calculator':
                loadProbabilityCalculator();
                break;
            case 'confidence-interval':
                loadConfidenceIntervalCalculator();
                break;
            case 'number-sequence-calculator':
                loadNumberSequenceCalculator();
                break;
            case 'confidence-interval-calculator':
                loadConfidenceIntervalCalculator();
                break;

            // Geometry
            case 'triangle':
                loadTriangleCalculator();
                break;
            case 'triangle-calculator':
                loadTriangleCalculator();
                break;
            case 'volume':
                loadVolumeCalculator();
                break;
            case 'slope':
                loadSlopeCalculator();
                break;
            case 'slope-calculator':
                loadSlopeCalculator();
                break;
            case 'area':
                loadAreaCalculator();
                break;
            case 'distance':
                loadDistanceCalculator();
                break;
            case 'circle':
                loadCircleCalculator();
                break;
            case 'circle-calculator':
                loadCircleCalculator();
                break;
            case 'surface-area':
                loadSurfaceAreaCalculator();
                break;
            case 'pythagorean':
                loadPythagoreanCalculator();
                break;
            case 'pythagorean-calculator':
                loadPythagoreanCalculator();
                break;
            case 'right-triangle':
                loadRightTriangleCalculator();
                break;
            case 'right-triangle-calculator':
                loadRightTriangleCalculator();
                break;
            case 'rectangle-calculator':
                loadRectangleCalculator();
                break;
            default:
                throw new Error(`Unknown calculator type: ${type}`);
        }
    } catch (error) {
        console.error('Error loading calculator:', error);
        container.innerHTML = '<div class="alert alert-danger">Error loading calculator. Please try again.</div>';
    }
}

function loadHomePage() {
    // Clear any existing calculator
    const container = document.getElementById('calculator-container');
    
    // Remove any existing content
    container.innerHTML = '';
    
    // Show the hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.display = 'block';
    }
    
    // Add the home page content
    container.innerHTML = `
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="calculator-card">
                    <h3>Popular Calculators</h3>
                    <ul class="list-unstyled">
                        <li><a href="#" onclick="loadCalculator('scientific-calculator')" class="btn btn-link">Scientific Calculator</a></li>
                        <li><a href="#" onclick="loadCalculator('bmi')" class="btn btn-link">BMI Calculator</a></li>
                        <li><a href="#" onclick="loadCalculator('currency-converter')" class="btn btn-link">Currency Converter</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-md-8">
                <div class="calculator-card">
                    <h2>Welcome to CalcSuites</h2>
                    <p>Select a calculator from the menu above to get started. Our tools are designed to help you with:</p>
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <h4>📊 Mathematics</h4>
                            <p>Advanced calculations, fractions, matrices, and more</p>
                        </div>
                        <div class="col-md-6">
                            <h4>💰 Finance</h4>
                            <p>EMI, interest rates, investments, and ROI calculations</p>
                        </div>
                        <div class="col-md-6">
                            <h4>🏃 Health & Fitness</h4>
                            <p>BMI, body fat, calories, and fitness tracking</p>
                        </div>
                        <div class="col-md-6">
                            <h4>⏰ Time & Date</h4>
                            <p>Age calculation, time zones, and date differences</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Utility functions
function createCalculatorCard(title) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <h5 class="card-title mb-0">${title}</h5>
        </div>
        <div class="card-body"></div>
    `;
    return card;
}

function formatNumber(number, decimals = 2) {
    return Number(number).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function validateNumber(input) {
    return !isNaN(input) && input !== '' && input !== null && input !== undefined;
}
