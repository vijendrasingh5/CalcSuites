# API Reference

## Core Functions

### main.js

#### loadCalculator(type: string)
Loads a specific calculator based on the type parameter.
```javascript
// Example
loadCalculator('bmi');
```

#### createCalculatorCard(title: string)
Creates a Bootstrap card container for a calculator.
```javascript
const card = createCalculatorCard('BMI Calculator');
```

#### formatNumber(number: number, decimals: number = 2)
Formats a number with specified decimal places.
```javascript
const formatted = formatNumber(23.456789, 2); // Returns "23.46"
```

#### validateNumber(input: string)
Validates and sanitizes numeric input.
```javascript
const number = validateNumber("123.45"); // Returns 123.45
const invalid = validateNumber("abc"); // Returns null
```

## Calculator Modules

### Health & Fitness

#### BMI Calculator
```javascript
function loadBMICalculator()
function calculateBMI(weight: number, height: number)
function displayBMIResults(bmi: number)
```

#### Body Fat Calculator
```javascript
function loadBodyFatCalculator()
function calculateBodyFat(measurements: object)
function displayBodyFatResults(bodyFat: number)
```

### Finance

#### Present Value Calculator
```javascript
function loadPresentValueCalculator()
function calculatePresentValue(params: object)
function displayPresentValueResults(results: object)
```

#### Compound Interest Calculator
```javascript
function loadCompoundInterestCalculator()
function calculateCompoundInterest(params: object)
function displayCompoundInterestResults(results: object)
```

### Mathematical

#### Unit Converter
```javascript
function loadUnitConverter()
function convert(value: number, fromUnit: string, toUnit: string)
function displayConversionResult(result: number)
```

### Date & Time

#### Age Calculator
```javascript
function loadAgeCalculator()
function calculateAge(birthDate: Date, targetDate: Date)
function displayAgeResults(age: object)
```

## Event Handlers

### Document Ready
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculator handlers
});
```

### Calculator Selection
```javascript
document.querySelectorAll('.dropdown-item').forEach(link => {
    link.addEventListener('click', function(e) {
        // Handle calculator selection
    });
});
```

## Error Handling

### Input Validation
All calculator modules implement consistent error handling:
- Numeric validation
- Range checking
- Required field validation
- Format validation

### Error Display
```javascript
function showError(message: string)
function clearError()
```

## Data Structures

### Calculator Results
```typescript
interface CalculatorResults {
    value: number;
    unit?: string;
    details?: object;
    formatted?: string;
}
```

### Calculator Parameters
```typescript
interface CalculatorParams {
    inputs: object;
    options?: object;
    precision?: number;
}
```

## Constants and Configuration

### Units
```javascript
const LENGTH_UNITS = ['meters', 'feet', 'inches', ...];
const WEIGHT_UNITS = ['kg', 'lbs', 'oz', ...];
const TIME_UNITS = ['seconds', 'minutes', 'hours', ...];
```

### Conversion Factors
```javascript
const CONVERSION_FACTORS = {
    meters_to_feet: 3.28084,
    kg_to_lbs: 2.20462,
    // ...
};
```

### Default Values
```javascript
const DEFAULT_PRECISION = 2;
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_WEIGHT_UNIT = 'kg';
```

## Utility Functions

### Number Formatting
```javascript
function roundToDecimal(number: number, decimals: number)
function formatCurrency(amount: number, currency: string)
function formatPercentage(value: number)
```

### Date Handling
```javascript
function parseDate(dateString: string)
function formatDate(date: Date, format: string)
function calculateDateDifference(date1: Date, date2: Date)
```

### Input Processing
```javascript
function sanitizeInput(input: string)
function validateRange(value: number, min: number, max: number)
function convertUnit(value: number, fromUnit: string, toUnit: string)
```
