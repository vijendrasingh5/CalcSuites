const unitTypes = {
    length: {
        meters: 1,
        kilometers: 1000,
        centimeters: 0.01,
        millimeters: 0.001,
        miles: 1609.34,
        yards: 0.9144,
        feet: 0.3048,
        inches: 0.0254
    },
    weight: {
        kilograms: 1,
        grams: 0.001,
        milligrams: 0.000001,
        pounds: 0.453592,
        ounces: 0.0283495
    },
    temperature: {
        celsius: 'C',
        fahrenheit: 'F',
        kelvin: 'K'
    },
    volume: {
        liters: 1,
        milliliters: 0.001,
        cubicMeters: 1000,
        gallons: 3.78541,
        quarts: 0.946353,
        cups: 0.236588
    }
};

function loadUnitConverter() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Unit Converter');
    
    const calculatorHTML = `
        <div class="row mb-3">
            <div class="col-md-6">
                <label for="unit-type" class="form-label">Conversion Type</label>
                <select class="form-select" id="unit-type" onchange="updateUnitOptions()">
                    ${Object.keys(unitTypes).map(type => 
                        `<option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
                    ).join('')}
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-5">
                <div class="mb-3">
                    <label for="from-value" class="form-label">From</label>
                    <input type="number" class="form-control" id="from-value" oninput="convertUnit()">
                </div>
                <select class="form-select" id="from-unit" onchange="convertUnit()"></select>
            </div>
            <div class="col-md-2 d-flex align-items-center justify-content-center">
                <button class="btn btn-outline-primary" onclick="swapUnits()">
                    ⇄
                </button>
            </div>
            <div class="col-md-5">
                <div class="mb-3">
                    <label for="to-value" class="form-label">To</label>
                    <input type="number" class="form-control" id="to-value" readonly>
                </div>
                <select class="form-select" id="to-unit" onchange="convertUnit()"></select>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    updateUnitOptions();
}

function updateUnitOptions() {
    const type = document.getElementById('unit-type').value;
    const fromSelect = document.getElementById('from-unit');
    const toSelect = document.getElementById('to-unit');
    const units = Object.keys(unitTypes[type]);
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    units.forEach(unit => {
        fromSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
        toSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
    
    convertUnit();
}

function convertUnit() {
    const type = document.getElementById('unit-type').value;
    const fromValue = parseFloat(document.getElementById('from-value').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    if (!fromValue) {
        document.getElementById('to-value').value = '';
        return;
    }
    
    if (type === 'temperature') {
        document.getElementById('to-value').value = convertTemperature(fromValue, fromUnit, toUnit);
        return;
    }
    
    const baseValue = fromValue * unitTypes[type][fromUnit];
    const result = baseValue / unitTypes[type][toUnit];
    document.getElementById('to-value').value = formatNumber(result, 6);
}

function convertTemperature(value, from, to) {
    let celsius;
    
    // Convert to Celsius first
    switch(from) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
    }
    
    // Convert from Celsius to target unit
    switch(to) {
        case 'celsius':
            return formatNumber(celsius);
        case 'fahrenheit':
            return formatNumber((celsius * 9/5) + 32);
        case 'kelvin':
            return formatNumber(celsius + 273.15);
    }
}

function swapUnits() {
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    const fromValue = document.getElementById('from-value');
    const toValue = document.getElementById('to-value');
    
    [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
    [fromValue.value, toValue.value] = [toValue.value, fromValue.value];
    
    convertUnit();
}
