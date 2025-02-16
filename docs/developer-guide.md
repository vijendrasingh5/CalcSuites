# Developer Guide

## Project Structure
```
CalcSuites/
├── index.html              # Main HTML file
├── README.md              # Project documentation
├── css/
│   └── style.css         # Main stylesheet
├── js/
│   ├── main.js           # Core JavaScript functionality
│   └── calculators/      # Calculator modules
│       ├── general/      # General tools
│       ├── health/       # Health & fitness calculators
│       ├── finance/      # Financial calculators
│       ├── mathematical/ # Math calculators
│       ├── statistics/   # Statistics calculators
│       └── geometry/     # Geometry calculators
└── docs/                 # Documentation files
```

## Adding a New Calculator

### 1. Create the Calculator File
Create a new JavaScript file in the appropriate subdirectory under `js/calculators/`. Follow this template:

```javascript
function loadYourCalculatorName() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Your Calculator Title');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <!-- Input fields here -->
            </div>
            <div class="col-md-6">
                <!-- Results area here -->
            </div>
        </div>
    `;
    
    card.querySelector('.card-body').innerHTML = calculatorHTML;
    container.appendChild(card);
    
    // Add event listeners
    // Implement calculation logic
}

function calculateYourFunction() {
    // Implement calculation logic
}

function displayResults(results) {
    // Display results logic
}
```

### 2. Update index.html
Add your calculator script to index.html:
```html
<script src="js/calculators/your-calculator.js"></script>
```

### 3. Add Navigation Menu Item
Add your calculator to the appropriate dropdown menu in index.html:
```html
<li><a class="dropdown-item" href="#" onclick="loadCalculator('your-calculator')">Your Calculator</a></li>
```

### 4. Update main.js
Add your calculator to the switch statement in loadCalculator():
```javascript
case 'your-calculator':
    loadYourCalculatorName();
    break;
```

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Include proper ARIA attributes for accessibility
- Keep markup clean and properly indented
- Use Bootstrap classes for layout and components

### CSS
- Follow BEM naming convention
- Keep selectors specific but not too nested
- Use CSS variables for theming
- Mobile-first approach

### JavaScript
- Use ES6+ features where appropriate
- Follow camelCase naming convention
- Keep functions small and focused
- Add comments for complex logic
- Use consistent error handling
- Validate all user inputs

## Utility Functions

### createCalculatorCard(title)
Creates a Bootstrap card with a title for the calculator

### formatNumber(number, decimals = 2)
Formats numbers with proper decimal places and thousands separators

### validateNumber(input)
Validates numeric input and returns a cleaned number or null

## Testing
- Test calculator with edge cases
- Verify mobile responsiveness
- Check cross-browser compatibility
- Validate all error messages
- Test with different locales

## Performance Considerations
- Minimize DOM manipulations
- Use event delegation where appropriate
- Lazy load calculators
- Optimize images and assets
- Cache calculation results when possible

## Accessibility Guidelines
- Use proper ARIA labels
- Ensure keyboard navigation
- Provide clear error messages
- Maintain proper color contrast
- Support screen readers
