function createStringToolsCalculator() {
    const calculator = document.createElement('div');
    calculator.className = 'calculator-content';
    calculator.innerHTML = `
        <h2>String Tools</h2>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group mb-3">
                    <label for="inputText">Input Text</label>
                    <textarea class="form-control" id="inputText" rows="5" placeholder="Enter your text here"></textarea>
                </div>
                <div class="form-group mb-3">
                    <label for="operation">Operation</label>
                    <select class="form-control" id="operation" onchange="updateStringOperation()">
                        <option value="case">Case Conversion</option>
                        <option value="count">Character Count</option>
                        <option value="encode">Encoding/Decoding</option>
                        <option value="format">Format/Clean</option>
                    </select>
                </div>
                <div id="operationOptions" class="form-group mb-3">
                    <!-- Dynamic options will be inserted here -->
                </div>
                <button class="btn btn-primary" onclick="processString()">Process</button>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Result</h5>
                        <div id="stringResult"></div>
                    </div>
                </div>
                <div class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">Text Statistics</h5>
                        <div id="textStats"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return calculator;
}

function loadStringToolsCalculator() {
    const calculatorContainer = document.getElementById('calculator-container');
    if (calculatorContainer) {
        calculatorContainer.innerHTML = '';
        calculatorContainer.appendChild(createStringToolsCalculator());
        updateStringOperation(); // Initialize operation options
    }
}

function updateStringOperation() {
    const operation = document.getElementById('operation').value;
    const optionsDiv = document.getElementById('operationOptions');
    
    let optionsHTML = '';
    switch (operation) {
        case 'case':
            optionsHTML = `
                <select class="form-control" id="caseOption">
                    <option value="upper">UPPERCASE</option>
                    <option value="lower">lowercase</option>
                    <option value="title">Title Case</option>
                    <option value="sentence">Sentence case</option>
                    <option value="camel">camelCase</option>
                    <option value="snake">snake_case</option>
                    <option value="kebab">kebab-case</option>
                </select>
            `;
            break;
            
        case 'count':
            optionsHTML = `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="countSpaces" checked>
                    <label class="form-check-label" for="countSpaces">Count Spaces</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="countPunctuation" checked>
                    <label class="form-check-label" for="countPunctuation">Count Punctuation</label>
                </div>
            `;
            break;
            
        case 'encode':
            optionsHTML = `
                <select class="form-control" id="encodeOption">
                    <option value="url">URL Encode/Decode</option>
                    <option value="base64">Base64 Encode/Decode</option>
                    <option value="html">HTML Encode/Decode</option>
                </select>
                <div class="form-check mt-2">
                    <input class="form-check-input" type="checkbox" id="decodeMode">
                    <label class="form-check-label" for="decodeMode">Decode (instead of encode)</label>
                </div>
            `;
            break;
            
        case 'format':
            optionsHTML = `
                <select class="form-control" id="formatOption">
                    <option value="trim">Trim Whitespace</option>
                    <option value="lines">Remove Empty Lines</option>
                    <option value="spaces">Normalize Spaces</option>
                    <option value="json">Format JSON</option>
                </select>
            `;
            break;
    }
    
    optionsDiv.innerHTML = optionsHTML;
}

function processString() {
    const input = document.getElementById('inputText').value;
    const operation = document.getElementById('operation').value;
    const resultDiv = document.getElementById('stringResult');
    
    try {
        let result = '';
        
        switch (operation) {
            case 'case':
                result = processCaseConversion(input);
                break;
            case 'count':
                result = processCharacterCount(input);
                break;
            case 'encode':
                result = processEncoding(input);
                break;
            case 'format':
                result = processFormatting(input);
                break;
        }
        
        // Update result
        resultDiv.innerHTML = `
            <div class="form-group">
                <label>Processed Text:</label>
                <textarea class="form-control" rows="5" readonly>${result}</textarea>
            </div>
            <button class="btn btn-sm btn-secondary mt-2" onclick="copyToClipboard(this)">
                Copy to Clipboard
            </button>
        `;
        
        // Update text statistics
        updateTextStatistics(input);
        
        // Track calculator usage
        trackCalculatorUse('string-tools');
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}

function processCaseConversion(input) {
    const caseOption = document.getElementById('caseOption').value;
    
    switch (caseOption) {
        case 'upper':
            return input.toUpperCase();
        case 'lower':
            return input.toLowerCase();
        case 'title':
            return input.replace(/\w\S*/g, txt => 
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        case 'sentence':
            return input.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => 
                letter.toUpperCase()
            );
        case 'camel':
            return input.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (letter, index) =>
                index === 0 ? letter.toLowerCase() : letter.toUpperCase()
            ).replace(/\s+/g, '');
        case 'snake':
            return input.toLowerCase().replace(/\s+/g, '_');
        case 'kebab':
            return input.toLowerCase().replace(/\s+/g, '-');
        default:
            return input;
    }
}

function processCharacterCount(input) {
    const countSpaces = document.getElementById('countSpaces').checked;
    const countPunctuation = document.getElementById('countPunctuation').checked;
    
    let chars = input.length;
    let spaces = (input.match(/\s/g) || []).length;
    let punctuation = (input.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g) || []).length;
    let letters = (input.match(/[a-zA-Z]/g) || []).length;
    let numbers = (input.match(/[0-9]/g) || []).length;
    
    return `Character Analysis:
Total Characters: ${chars}
Letters: ${letters}
Numbers: ${numbers}
Spaces: ${spaces}
Punctuation Marks: ${punctuation}
Characters (no spaces): ${chars - (countSpaces ? 0 : spaces)}
Characters (no punctuation): ${chars - (countPunctuation ? 0 : punctuation)}`;
}

function processEncoding(input) {
    const encodeOption = document.getElementById('encodeOption').value;
    const decode = document.getElementById('decodeMode').checked;
    
    switch (encodeOption) {
        case 'url':
            return decode ? decodeURIComponent(input) : encodeURIComponent(input);
        case 'base64':
            return decode ? 
                atob(input) : 
                btoa(input);
        case 'html':
            if (decode) {
                return input
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'");
            } else {
                return input
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            }
        default:
            return input;
    }
}

function processFormatting(input) {
    const formatOption = document.getElementById('formatOption').value;
    
    switch (formatOption) {
        case 'trim':
            return input.trim();
        case 'lines':
            return input.replace(/^\s*[\r\n]/gm, '');
        case 'spaces':
            return input.replace(/\s+/g, ' ').trim();
        case 'json':
            try {
                return JSON.stringify(JSON.parse(input), null, 2);
            } catch (e) {
                throw new Error('Invalid JSON format');
            }
        default:
            return input;
    }
}

function updateTextStatistics(input) {
    const words = input.trim().split(/\s+/).filter(word => word.length > 0);
    const lines = input.split('\n');
    const paragraphs = input.split('\n\n').filter(para => para.trim().length > 0);
    
    document.getElementById('textStats').innerHTML = `
        <table class="table table-sm">
            <tr>
                <td>Words:</td>
                <td>${words.length}</td>
            </tr>
            <tr>
                <td>Lines:</td>
                <td>${lines.length}</td>
            </tr>
            <tr>
                <td>Paragraphs:</td>
                <td>${paragraphs.length}</td>
            </tr>
            <tr>
                <td>Average Word Length:</td>
                <td>${words.length ? (words.join('').length / words.length).toFixed(1) : 0} characters</td>
            </tr>
        </table>
    `;
}

function copyToClipboard(button) {
    const textarea = button.previousElementSibling.querySelector('textarea');
    textarea.select();
    document.execCommand('copy');
    
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 1500);
}
