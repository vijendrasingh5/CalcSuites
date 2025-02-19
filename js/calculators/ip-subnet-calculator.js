function loadIPSubnetCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('IP Subnet Calculator');
    
    const calculatorHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Calculation Type</label>
                    <select class="form-select" id="subnet-calc-type" onchange="toggleSubnetInputs()">
                        <option value="subnet">Subnet Calculator</option>
                        <option value="vlsm">VLSM Calculator</option>
                        <option value="supernet">Supernetting</option>
                    </select>
                </div>
                
                <div id="subnet-basic-input">
                    <div class="mb-3">
                        <label class="form-label">IP Address</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="subnet-ip" placeholder="192.168.1.0">
                            <span class="input-group-text">/</span>
                            <input type="number" class="form-control" id="subnet-mask" placeholder="24" min="0" max="32">
                        </div>
                        <div class="form-text">Enter IP address in format: xxx.xxx.xxx.xxx</div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Required Subnets/Hosts</label>
                        <input type="number" class="form-control" id="subnet-required" placeholder="Number of subnets or hosts needed">
                    </div>
                </div>
                
                <div id="subnet-vlsm-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Major Network</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="vlsm-network" placeholder="192.168.1.0">
                            <span class="input-group-text">/</span>
                            <input type="number" class="form-control" id="vlsm-mask" placeholder="24" min="0" max="32">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Host Requirements</label>
                        <div id="vlsm-requirements">
                            <!-- Host requirement entries will be added here -->
                        </div>
                        <button class="btn btn-secondary btn-sm mt-2" onclick="addVLSMRequirement()">Add Requirement</button>
                    </div>
                </div>
                
                <div id="subnet-supernet-input" style="display: none;">
                    <div class="mb-3">
                        <label class="form-label">Networks to Combine</label>
                        <div id="supernet-networks">
                            <!-- Network entries will be added here -->
                        </div>
                        <button class="btn btn-secondary btn-sm mt-2" onclick="addSupernet()">Add Network</button>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="calculateSubnet()">Calculate</button>
            </div>
            
            <div class="col-md-6">
                <div id="subnet-result" class="result-box mt-3" style="display: none;">
                    <h4>Subnet Results</h4>
                    
                    <div class="mb-3">
                        <h5>Network Information</h5>
                        <ul class="list-unstyled" id="subnet-info"></ul>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Subnet Breakdown</h5>
                        <div class="table-responsive">
                            <table class="table table-sm" id="subnet-breakdown">
                                <thead>
                                    <tr>
                                        <th>Subnet</th>
                                        <th>Network Address</th>
                                        <th>First Host</th>
                                        <th>Last Host</th>
                                        <th>Broadcast</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Binary Representation</h5>
                        <pre class="bg-light p-2" id="subnet-binary"></pre>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    card.innerHTML += calculatorHTML;
    container.appendChild(card);
    
    // Add initial entries
    addVLSMRequirement();
    addSupernet();
}

function toggleSubnetInputs() {
    const calcType = document.getElementById('subnet-calc-type').value;
    const basicInput = document.getElementById('subnet-basic-input');
    const vlsmInput = document.getElementById('subnet-vlsm-input');
    const supernetInput = document.getElementById('subnet-supernet-input');
    
    basicInput.style.display = calcType === 'subnet' ? 'block' : 'none';
    vlsmInput.style.display = calcType === 'vlsm' ? 'block' : 'none';
    supernetInput.style.display = calcType === 'supernet' ? 'block' : 'none';
}

function addVLSMRequirement() {
    const requirements = document.getElementById('vlsm-requirements');
    const count = requirements.children.length + 1;
    
    const entry = document.createElement('div');
    entry.className = 'input-group mb-2';
    entry.innerHTML = `
        <span class="input-group-text">Subnet ${count}</span>
        <input type="number" class="form-control vlsm-hosts" placeholder="Number of hosts" min="2">
        <input type="text" class="form-control vlsm-name" placeholder="Subnet name (optional)">
        ${count > 1 ? '<button class="btn btn-danger" onclick="this.parentElement.remove()">×</button>' : ''}
    `;
    
    requirements.appendChild(entry);
}

function addSupernet() {
    const networks = document.getElementById('supernet-networks');
    const count = networks.children.length + 1;
    
    const entry = document.createElement('div');
    entry.className = 'input-group mb-2';
    entry.innerHTML = `
        <span class="input-group-text">Network ${count}</span>
        <input type="text" class="form-control supernet-ip" placeholder="192.168.1.0">
        <span class="input-group-text">/</span>
        <input type="number" class="form-control supernet-mask" placeholder="24" min="0" max="32">
        ${count > 1 ? '<button class="btn btn-danger" onclick="this.parentElement.remove()">×</button>' : ''}
    `;
    
    networks.appendChild(entry);
}

function calculateSubnet() {
    const calcType = document.getElementById('subnet-calc-type').value;
    
    switch(calcType) {
        case 'subnet':
            calculateBasicSubnet();
            break;
        case 'vlsm':
            calculateVLSM();
            break;
        case 'supernet':
            calculateSupernet();
            break;
    }
}

function calculateBasicSubnet() {
    const ip = document.getElementById('subnet-ip').value;
    const mask = parseInt(document.getElementById('subnet-mask').value);
    const required = parseInt(document.getElementById('subnet-required').value);
    
    if (!isValidIP(ip) || isNaN(mask) || mask < 0 || mask > 32) {
        alert('Please enter a valid IP address and subnet mask');
        return;
    }
    
    if (isNaN(required) || required < 1) {
        alert('Please enter the number of subnets/hosts required');
        return;
    }
    
    const networkBits = Math.ceil(Math.log2(required));
    const newMask = mask + networkBits;
    
    if (newMask > 32) {
        alert('Cannot create enough subnets with given requirements');
        return;
    }
    
    const subnets = [];
    const hostsPerSubnet = Math.pow(2, 32 - newMask) - 2;
    const subnetIncrement = Math.pow(2, 32 - newMask);
    
    let networkAddress = ipToNumber(ip) & (0xFFFFFFFF << (32 - mask));
    
    for (let i = 0; i < Math.pow(2, networkBits); i++) {
        const subnet = {
            network: numberToIP(networkAddress),
            firstHost: numberToIP(networkAddress + 1),
            lastHost: numberToIP(networkAddress + subnetIncrement - 2),
            broadcast: numberToIP(networkAddress + subnetIncrement - 1),
            mask: newMask,
            hosts: hostsPerSubnet
        };
        subnets.push(subnet);
        networkAddress += subnetIncrement;
    }
    
    displaySubnetResults(ip, mask, newMask, subnets);
}

function calculateVLSM() {
    const network = document.getElementById('vlsm-network').value;
    const mask = parseInt(document.getElementById('vlsm-mask').value);
    
    if (!isValidIP(network) || isNaN(mask) || mask < 0 || mask > 32) {
        alert('Please enter a valid network address and mask');
        return;
    }
    
    const requirements = Array.from(document.getElementsByClassName('vlsm-hosts'))
        .map((input, index) => ({
            hosts: parseInt(input.value),
            name: document.getElementsByClassName('vlsm-name')[index].value || `Subnet ${index + 1}`
        }))
        .filter(req => !isNaN(req.hosts) && req.hosts > 0)
        .sort((a, b) => b.hosts - a.hosts);
    
    if (requirements.length === 0) {
        alert('Please enter at least one valid host requirement');
        return;
    }
    
    const subnets = [];
    let networkAddress = ipToNumber(network) & (0xFFFFFFFF << (32 - mask));
    
    for (const req of requirements) {
        const requiredBits = 32 - Math.ceil(Math.log2(req.hosts + 2));
        if (requiredBits < mask) {
            alert(`Cannot allocate enough addresses for ${req.name}`);
            return;
        }
        
        const subnetIncrement = Math.pow(2, 32 - requiredBits);
        const subnet = {
            name: req.name,
            network: numberToIP(networkAddress),
            firstHost: numberToIP(networkAddress + 1),
            lastHost: numberToIP(networkAddress + subnetIncrement - 2),
            broadcast: numberToIP(networkAddress + subnetIncrement - 1),
            mask: requiredBits,
            hosts: Math.pow(2, 32 - requiredBits) - 2
        };
        
        subnets.push(subnet);
        networkAddress += subnetIncrement;
    }
    
    displayVLSMResults(network, mask, subnets);
}

function calculateSupernet() {
    const networks = Array.from(document.getElementsByClassName('supernet-ip'))
        .map((input, index) => ({
            network: input.value,
            mask: parseInt(document.getElementsByClassName('supernet-mask')[index].value)
        }))
        .filter(net => isValidIP(net.network) && !isNaN(net.mask));
    
    if (networks.length < 2) {
        alert('Please enter at least two valid networks');
        return;
    }
    
    // Convert networks to binary
    const networkBits = networks.map(net => {
        const ipNum = ipToNumber(net.network);
        return {
            network: ipNum,
            mask: net.mask,
            binary: (ipNum >>> 0).toString(2).padStart(32, '0')
        };
    });
    
    // Find common prefix
    let commonPrefix = '';
    for (let i = 0; i < 32; i++) {
        const bit = networkBits[0].binary[i];
        if (networkBits.every(net => net.binary[i] === bit)) {
            commonPrefix += bit;
        } else {
            break;
        }
    }
    
    const newMask = commonPrefix.length;
    const supernetIP = numberToIP(networkBits[0].network & (0xFFFFFFFF << (32 - newMask)));
    
    displaySupernetResults(supernetIP, newMask, networks);
}

function displaySubnetResults(ip, oldMask, newMask, subnets) {
    const resultDiv = document.getElementById('subnet-result');
    const infoList = document.getElementById('subnet-info');
    const breakdownBody = document.getElementById('subnet-breakdown').querySelector('tbody');
    const binaryDiv = document.getElementById('subnet-binary');
    
    // Display network information
    infoList.innerHTML = `
        <li>Original Network: ${ip}/${oldMask}</li>
        <li>New Subnet Mask: ${maskToDottedDecimal(newMask)} (/${newMask})</li>
        <li>Hosts per Subnet: ${subnets[0].hosts}</li>
        <li>Total Subnets: ${subnets.length}</li>
    `;
    
    // Display subnet breakdown
    breakdownBody.innerHTML = subnets.map((subnet, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${subnet.network}/${subnet.mask}</td>
            <td>${subnet.firstHost}</td>
            <td>${subnet.lastHost}</td>
            <td>${subnet.broadcast}</td>
        </tr>
    `).join('');
    
    // Display binary representation
    binaryDiv.textContent = `
Network ID:  ${ipToBinary(ip)}
Subnet Mask: ${maskToBinary(newMask)}
    `.trim();
    
    resultDiv.style.display = 'block';
}

function displayVLSMResults(network, mask, subnets) {
    const resultDiv = document.getElementById('subnet-result');
    const infoList = document.getElementById('subnet-info');
    const breakdownBody = document.getElementById('subnet-breakdown').querySelector('tbody');
    const binaryDiv = document.getElementById('subnet-binary');
    
    // Display network information
    const totalHosts = subnets.reduce((sum, subnet) => sum + subnet.hosts, 0);
    const addressSpaceUsed = calculateAddressSpaceUsed(subnets);
    const efficiency = ((totalHosts / addressSpaceUsed) * 100).toFixed(2);
    
    infoList.innerHTML = `
        <li>Major Network: ${network}/${mask}</li>
        <li>Total Subnets: ${subnets.length}</li>
        <li>Total Hosts: ${totalHosts}</li>
        <li>Address Space Efficiency: ${efficiency}%</li>
    `;
    
    // Display subnet breakdown
    breakdownBody.innerHTML = subnets.map(subnet => `
        <tr>
            <td>${subnet.name}</td>
            <td>${subnet.network}/${subnet.mask}</td>
            <td>${subnet.firstHost}</td>
            <td>${subnet.lastHost}</td>
            <td>${subnet.broadcast}</td>
        </tr>
    `).join('');
    
    // Display binary representation
    binaryDiv.textContent = `
Major Network: ${ipToBinary(network)}
Subnet Mask:   ${maskToBinary(mask)}
    `.trim();
    
    resultDiv.style.display = 'block';
}

function displaySupernetResults(supernetIP, newMask, networks) {
    const resultDiv = document.getElementById('subnet-result');
    const infoList = document.getElementById('subnet-info');
    const breakdownBody = document.getElementById('subnet-breakdown').querySelector('tbody');
    const binaryDiv = document.getElementById('subnet-binary');
    
    // Display network information
    infoList.innerHTML = `
        <li>Supernet: ${supernetIP}/${newMask}</li>
        <li>Supernet Mask: ${maskToDottedDecimal(newMask)}</li>
        <li>Networks Combined: ${networks.length}</li>
        <li>Address Space: ${Math.pow(2, 32 - newMask)} addresses</li>
    `;
    
    // Display network breakdown
    breakdownBody.innerHTML = networks.map((net, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${net.network}/${net.mask}</td>
            <td colspan="3">Original Network</td>
        </tr>
    `).join('');
    
    // Display binary representation
    binaryDiv.textContent = `
Supernet:     ${ipToBinary(supernetIP)}
Subnet Mask:  ${maskToBinary(newMask)}
    `.trim();
    
    resultDiv.style.display = 'block';
}

// Utility functions
function isValidIP(ip) {
    if (!ip) return false;
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
        const num = parseInt(part);
        return !isNaN(num) && num >= 0 && num <= 255;
    });
}

function ipToNumber(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

function numberToIP(num) {
    return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
    ].join('.');
}

function maskToDottedDecimal(mask) {
    const binary = '1'.repeat(mask) + '0'.repeat(32 - mask);
    return numberToIP(parseInt(binary, 2));
}

function ipToBinary(ip) {
    return ip.split('.').map(octet => 
        parseInt(octet).toString(2).padStart(8, '0')
    ).join('');
}

function maskToBinary(mask) {
    return '1'.repeat(mask) + '0'.repeat(32 - mask);
}

function calculateAddressSpaceUsed(subnets) {
    return subnets.reduce((total, subnet) => total + Math.pow(2, 32 - subnet.mask), 0);
}
