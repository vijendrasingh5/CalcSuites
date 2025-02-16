# CalcSuites - All-in-One Calculator Website

A comprehensive collection of calculators and converters for various fields including general tools, health & fitness, finance, mathematics, and more.

## Project Structure

```
CalcSuites/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   ├── main.js        # Core JavaScript functionality
│   └── calculators/   # Individual calculator modules
│       ├── bmi-calculator.js
│       ├── currency-converter.js
│       └── unit-converter.js
```

## Features

- Modern, responsive design using Bootstrap 5
- Easy-to-use interface with categorized calculators
- Clean and maintainable code structure
- Mobile-friendly layout

## Adding New Calculators

1. Create a new JavaScript file in the `js/calculators/` directory
2. Add the calculator's script to index.html
3. Add a menu item in the navigation
4. Implement the calculator's logic following the existing pattern

## Calculator Categories

1. General Tools
   - Unit Converter
   - Currency Converter

2. Health & Fitness
   - BMI Calculator
   - BMR Calculator
   - Body Fat Calculator
   - And more...

3. Finance & Business
   - EMI Calculator
   - Interest Calculator
   - Investment Calculator
   - And more...

4. Mathematical Tools
   - Scientific Calculator
   - Statistics Calculator
   - Geometry Calculator
   - And more...

## Development

To add a new calculator:

1. Create a new file in `js/calculators/` following the naming pattern
2. Implement two main functions:
   - `loadCalculatorName()` - Creates the UI
   - `calculateResult()` - Handles the calculation logic
3. Add the calculator to the navigation menu in `index.html`
4. Import the new JavaScript file in `index.html`

## Getting Started

Simply open `index.html` in a web browser to start using the calculators. No server setup required!
