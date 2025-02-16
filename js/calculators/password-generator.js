function loadPasswordGenerator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Password Generator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Password Length</label>
                    <div class="input-group">
                        <input type="range" class="form-range" id="password-length" min="8" max="128" value="16" 
                            oninput="updateLengthValue(this.value)">
                        <span class="input-group-text" id="length-value">16</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Character Sets</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-lowercase" checked>
                        <label class="form-check-label">Lowercase Letters (a-z)</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-uppercase" checked>
                        <label class="form-check-label">Uppercase Letters (A-Z)</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-numbers" checked>
                        <label class="form-check-label">Numbers (0-9)</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-symbols" checked>
                        <label class="form-check-label">Symbols (!@#$%^&*)</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-extended">
                        <label class="form-check-label">Extended Symbols ({}[]()/:;"'<>,.?)</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-ambiguous">
                        <label class="form-check-label">Include Ambiguous Characters (l1IO0)</label>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Requirements</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-min-lower" checked>
                        <label class="form-check-label">At least one lowercase letter</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-min-upper" checked>
                        <label class="form-check-label">At least one uppercase letter</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-min-number" checked>
                        <label class="form-check-label">At least one number</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-min-symbol" checked>
                        <label class="form-check-label">At least one symbol</label>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Additional Options</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-no-repeat">
                        <label class="form-check-label">No repeated characters</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="password-pronounceable">
                        <label class="form-check-label">Generate pronounceable password</label>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="generatePassword()">Generate Password</button>
                <button class="btn btn-secondary" onclick="generateMultiplePasswords()">Generate Multiple</button>
            </div>
            
            <div class="col-md-6">
                <div id="password-result" class="result-box mt-3" style="display: none;">
                    <h4>Generated Password</h4>
                    
                    <div class="mb-3">
                        <div class="input-group">
                            <input type="text" class="form-control" id="password-output" readonly>
                            <button class="btn btn-outline-secondary" onclick="copyPassword()">
                                Copy
                            </button>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Password Strength</h5>
                        <div class="progress">
                            <div class="progress-bar" id="password-strength" role="progressbar"></div>
                        </div>
                        <p class="mt-2" id="password-strength-text"></p>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Password Analysis</h5>
                        <ul class="list-unstyled" id="password-analysis"></ul>
                    </div>
                    
                    <div id="password-multiple" class="mb-3" style="display: none;">
                        <h5>Additional Passwords</h5>
                        <div class="list-group" id="password-list"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
}

function updateLengthValue(value) {
    document.getElementById('length-value').textContent = value;
}

function generatePassword() {
    const length = parseInt(document.getElementById('password-length').value);
    const options = getPasswordOptions();
    
    if (!validateOptions(options)) {
        alert('Please select at least one character set');
        return;
    }
    
    let password;
    if (options.pronounceable) {
        password = generatePronounceable(length);
    } else {
        password = generateRandomPassword(length, options);
    }
    
    displayPassword(password);
}

function generateMultiplePasswords() {
    const length = parseInt(document.getElementById('password-length').value);
    const options = getPasswordOptions();
    
    if (!validateOptions(options)) {
        alert('Please select at least one character set');
        return;
    }
    
    const passwords = [];
    for (let i = 0; i < 5; i++) {
        if (options.pronounceable) {
            passwords.push(generatePronounceable(length));
        } else {
            passwords.push(generateRandomPassword(length, options));
        }
    }
    
    displayPassword(passwords[0], passwords.slice(1));
}

function getPasswordOptions() {
    return {
        lowercase: document.getElementById('password-lowercase').checked,
        uppercase: document.getElementById('password-uppercase').checked,
        numbers: document.getElementById('password-numbers').checked,
        symbols: document.getElementById('password-symbols').checked,
        extended: document.getElementById('password-extended').checked,
        ambiguous: document.getElementById('password-ambiguous').checked,
        minLower: document.getElementById('password-min-lower').checked,
        minUpper: document.getElementById('password-min-upper').checked,
        minNumber: document.getElementById('password-min-number').checked,
        minSymbol: document.getElementById('password-min-symbol').checked,
        noRepeat: document.getElementById('password-no-repeat').checked,
        pronounceable: document.getElementById('password-pronounceable').checked
    };
}

function validateOptions(options) {
    return options.lowercase || options.uppercase || 
           options.numbers || options.symbols || 
           options.extended || options.pronounceable;
}

function generateRandomPassword(length, options) {
    let chars = '';
    let requirements = [];
    
    if (options.lowercase) {
        chars += 'abcdefghijklmnopqrstuvwxyz';
        if (options.minLower) {
            requirements.push('abcdefghijklmnopqrstuvwxyz');
        }
    }
    
    if (options.uppercase) {
        chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.minUpper) {
            requirements.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        }
    }
    
    if (options.numbers) {
        chars += '0123456789';
        if (options.minNumber) {
            requirements.push('0123456789');
        }
    }
    
    if (options.symbols) {
        chars += '!@#$%^&*';
        if (options.minSymbol) {
            requirements.push('!@#$%^&*');
        }
    }
    
    if (options.extended) {
        chars += '{}[]()/:;"\'<>,.?';
    }
    
    if (!options.ambiguous) {
        chars = chars.replace(/[l1IO0]/g, '');
    }
    
    if (options.noRepeat && length > chars.length) {
        alert('Cannot generate password: length exceeds available unique characters');
        return '';
    }
    
    let password = '';
    let usedChars = new Set();
    
    // First, satisfy all requirements
    for (const reqChars of requirements) {
        const char = reqChars[Math.floor(Math.random() * reqChars.length)];
        password += char;
        if (options.noRepeat) usedChars.add(char);
    }
    
    // Then fill the rest randomly
    while (password.length < length) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        if (!options.noRepeat || !usedChars.has(char)) {
            password += char;
            if (options.noRepeat) usedChars.add(char);
        }
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

function generatePronounceable(length) {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';
    const doubles = ['th', 'ch', 'ph', 'sh', 'wh'];
    let password = '';
    
    while (password.length < length) {
        // Add a consonant (maybe a double)
        if (Math.random() < 0.3 && password.length + 2 <= length) {
            password += doubles[Math.floor(Math.random() * doubles.length)];
        } else {
            password += consonants[Math.floor(Math.random() * consonants.length)];
        }
        
        // Add a vowel if there's space
        if (password.length < length) {
            password += vowels[Math.floor(Math.random() * vowels.length)];
        }
    }
    
    // Capitalize some letters and add some numbers/symbols
    return password.split('').map(char => {
        if (Math.random() < 0.3) return char.toUpperCase();
        if (Math.random() < 0.2) return Math.floor(Math.random() * 10);
        if (Math.random() < 0.1) return '!@#$%^&*'[Math.floor(Math.random() * 8)];
        return char;
    }).join('');
}

function displayPassword(password, additional = []) {
    document.getElementById('password-result').style.display = 'block';
    document.getElementById('password-output').value = password;
    
    // Calculate and display password strength
    const strength = calculatePasswordStrength(password);
    const strengthBar = document.getElementById('password-strength');
    strengthBar.style.width = `${strength.score}%`;
    strengthBar.className = `progress-bar bg-${strength.class}`;
    
    document.getElementById('password-strength-text').textContent = strength.description;
    
    // Show password analysis
    document.getElementById('password-analysis').innerHTML = `
        <li><strong>Length:</strong> ${password.length} characters</li>
        <li><strong>Lowercase:</strong> ${(password.match(/[a-z]/g) || []).length}</li>
        <li><strong>Uppercase:</strong> ${(password.match(/[A-Z]/g) || []).length}</li>
        <li><strong>Numbers:</strong> ${(password.match(/[0-9]/g) || []).length}</li>
        <li><strong>Symbols:</strong> ${(password.match(/[^a-zA-Z0-9]/g) || []).length}</li>
        <li><strong>Unique Characters:</strong> ${new Set(password).size}</li>
    `;
    
    // Show additional passwords if any
    const multipleDiv = document.getElementById('password-multiple');
    const passwordList = document.getElementById('password-list');
    
    if (additional.length > 0) {
        multipleDiv.style.display = 'block';
        passwordList.innerHTML = additional.map(pwd => 
            `<button class="list-group-item list-group-item-action" 
                onclick="selectPassword(this)">${pwd}</button>`
        ).join('');
    } else {
        multipleDiv.style.display = 'none';
        passwordList.innerHTML = '';
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length
    score += password.length * 4;
    
    // Character variety
    if (password.match(/[a-z]/)) score += 10;
    if (password.match(/[A-Z]/)) score += 10;
    if (password.match(/[0-9]/)) score += 10;
    if (password.match(/[^a-zA-Z0-9]/)) score += 15;
    
    // Unique characters
    score += new Set(password).size * 3;
    
    // Penalties
    if (password.match(/^[a-zA-Z]+$/)) score -= 10;
    if (password.match(/^[0-9]+$/)) score -= 15;
    
    // Normalize score to 0-100
    score = Math.min(100, Math.max(0, score));
    
    let strength = {
        score: score,
        class: 'danger',
        description: 'Very Weak'
    };
    
    if (score >= 80) {
        strength.class = 'success';
        strength.description = 'Very Strong';
    } else if (score >= 60) {
        strength.class = 'info';
        strength.description = 'Strong';
    } else if (score >= 40) {
        strength.class = 'warning';
        strength.description = 'Moderate';
    } else if (score >= 20) {
        strength.class = 'danger';
        strength.description = 'Weak';
    }
    
    return strength;
}

function selectPassword(button) {
    document.getElementById('password-output').value = button.textContent;
}

function copyPassword() {
    const output = document.getElementById('password-output');
    output.select();
    document.execCommand('copy');
    
    // Show feedback
    const button = output.nextElementSibling;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = originalText, 1500);
}
