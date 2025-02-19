function createColorConverterCalculator() {
    const calculator = document.createElement('div');
    calculator.className = 'calculator-content';
    calculator.innerHTML = `
        <h2>Color Code Converter</h2>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group mb-3">
                    <label for="colorPicker">Color Picker</label>
                    <input type="color" class="form-control form-control-color w-100" id="colorPicker" value="#ff0000" onchange="updateColorCodes(this.value)">
                </div>
                <div class="form-group mb-3">
                    <label for="hexInput">Hex Color</label>
                    <div class="input-group">
                        <span class="input-group-text">#</span>
                        <input type="text" class="form-control" id="hexInput" placeholder="ff0000" maxlength="6" onchange="updateFromHex(this.value)">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group mb-3">
                    <label>RGB Values</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="redInput" min="0" max="255" placeholder="Red" onchange="updateFromRGB()">
                        <input type="number" class="form-control" id="greenInput" min="0" max="255" placeholder="Green" onchange="updateFromRGB()">
                        <input type="number" class="form-control" id="blueInput" min="0" max="255" placeholder="Blue" onchange="updateFromRGB()">
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="hslValues">HSL Values</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="hueInput" min="0" max="360" placeholder="Hue" onchange="updateFromHSL()">
                        <input type="number" class="form-control" id="satInput" min="0" max="100" placeholder="Sat%" onchange="updateFromHSL()">
                        <input type="number" class="form-control" id="lightInput" min="0" max="100" placeholder="Light%" onchange="updateFromHSL()">
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Color Preview</h5>
                        <div id="colorPreview" class="p-4 border rounded" style="background-color: #ff0000;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return calculator;
}

function loadColorConverterCalculator() {
    const calculatorContainer = document.getElementById('calculator-container');
    if (calculatorContainer) {
        calculatorContainer.innerHTML = '';
        calculatorContainer.appendChild(createColorConverterCalculator());
        updateColorCodes('#ff0000'); // Initialize with red
    }
}

function updateColorCodes(hex) {
    // Update color picker and preview
    document.getElementById('colorPicker').value = hex;
    document.getElementById('colorPreview').style.backgroundColor = hex;
    
    // Update hex input
    document.getElementById('hexInput').value = hex.substring(1);
    
    // Convert to RGB
    const rgb = hexToRgb(hex);
    document.getElementById('redInput').value = rgb.r;
    document.getElementById('greenInput').value = rgb.g;
    document.getElementById('blueInput').value = rgb.b;
    
    // Convert to HSL
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    document.getElementById('hueInput').value = Math.round(hsl.h);
    document.getElementById('satInput').value = Math.round(hsl.s * 100);
    document.getElementById('lightInput').value = Math.round(hsl.l * 100);
    
    // Track calculator usage
    trackCalculatorUse('color-converter');
}

function updateFromHex(hex) {
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        alert('Invalid hex color code');
        return;
    }
    updateColorCodes('#' + hex);
}

function updateFromRGB() {
    const r = parseInt(document.getElementById('redInput').value);
    const g = parseInt(document.getElementById('greenInput').value);
    const b = parseInt(document.getElementById('blueInput').value);
    
    if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        alert('RGB values must be between 0 and 255');
        return;
    }
    
    const hex = rgbToHex(r, g, b);
    updateColorCodes(hex);
}

function updateFromHSL() {
    const h = parseInt(document.getElementById('hueInput').value);
    const s = parseInt(document.getElementById('satInput').value) / 100;
    const l = parseInt(document.getElementById('lightInput').value) / 100;
    
    if (isNaN(h) || isNaN(s) || isNaN(l) || h < 0 || h > 360 || s < 0 || s > 1 || l < 0 || l > 1) {
        alert('Invalid HSL values');
        return;
    }
    
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    updateColorCodes(hex);
}

// Color conversion utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return { h: h * 360, s: s, l: l };
}

function hslToRgb(h, s, l) {
    let r, g, b;
    
    h /= 360;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
