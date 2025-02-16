function loadGPACalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('GPA Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <div class="mb-3">
                    <label class="form-label">GPA Scale</label>
                    <select class="form-select" id="gpa-scale" onchange="updateGradeInputs()">
                        <option value="4">4.0 Scale</option>
                        <option value="5">5.0 Scale</option>
                        <option value="10">10.0 Scale</option>
                    </select>
                </div>
                
                <div id="courses-container">
                    <!-- Course inputs will be added here -->
                </div>
                
                <div class="mb-3">
                    <button class="btn btn-secondary" onclick="addCourse()">Add Course</button>
                    <button class="btn btn-primary" onclick="calculateGPA()">Calculate GPA</button>
                </div>
            </div>
            
            <div class="col-md-4">
                <div id="gpa-result" class="alert alert-info" style="display: none;">
                    <h4 class="alert-heading">Your GPA</h4>
                    <p id="gpa-value" class="display-4 mb-0"></p>
                </div>
            </div>
        </div>
    `;
    
    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);
    
    // Add initial course input
    addCourse();
}

function addCourse() {
    const container = document.getElementById('courses-container');
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course-entry mb-3 border-bottom pb-2';
    
    const courseId = container.children.length + 1;
    const scale = document.getElementById('gpa-scale').value;
    
    courseDiv.innerHTML = `
        <div class="row g-2">
            <div class="col-md-6">
                <label class="form-label">Course ${courseId}</label>
                <input type="text" class="form-control course-name" placeholder="Course name">
            </div>
            <div class="col-md-3">
                <label class="form-label">Grade</label>
                <select class="form-control course-grade">
                    ${generateGradeOptions(scale)}
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label">Credits</label>
                <input type="number" class="form-control course-credits" value="3" min="0" step="0.5">
            </div>
            <div class="col-md-1">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-danger w-100" onclick="this.closest('.course-entry').remove()">×</button>
            </div>
        </div>
    `;
    
    container.appendChild(courseDiv);
}

function generateGradeOptions(scale) {
    let options = '';
    
    if (scale === '4') {
        const grades = [
            ['A+', '4.0'], ['A', '4.0'], ['A-', '3.7'],
            ['B+', '3.3'], ['B', '3.0'], ['B-', '2.7'],
            ['C+', '2.3'], ['C', '2.0'], ['C-', '1.7'],
            ['D+', '1.3'], ['D', '1.0'], ['F', '0.0']
        ];
        grades.forEach(([letter, value]) => {
            options += `<option value="${value}">${letter} (${value})</option>`;
        });
    } else if (scale === '5') {
        const grades = [
            ['A+', '5.0'], ['A', '4.0'], ['B', '3.0'],
            ['C', '2.0'], ['D', '1.0'], ['F', '0.0']
        ];
        grades.forEach(([letter, value]) => {
            options += `<option value="${value}">${letter} (${value})</option>`;
        });
    } else if (scale === '10') {
        for (let i = 10; i >= 0; i--) {
            options += `<option value="${i}">${i}</option>`;
        }
    }
    
    return options;
}

function updateGradeInputs() {
    const scale = document.getElementById('gpa-scale').value;
    const gradeSelects = document.querySelectorAll('.course-grade');
    
    gradeSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = generateGradeOptions(scale);
        // Try to maintain similar grade level after scale change
        if (scale === '4' && currentValue > 4) {
            select.value = 4;
        } else if (scale === '5' && currentValue > 5) {
            select.value = 5;
        }
    });
}

function calculateGPA() {
    const courses = document.querySelectorAll('.course-entry');
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
        const grade = parseFloat(course.querySelector('.course-grade').value);
        const credits = parseFloat(course.querySelector('.course-credits').value);
        
        if (!isNaN(grade) && !isNaN(credits)) {
            totalPoints += grade * credits;
            totalCredits += credits;
        }
    });
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    
    const resultDiv = document.getElementById('gpa-result');
    const gpaValue = document.getElementById('gpa-value');
    
    resultDiv.style.display = 'block';
    gpaValue.textContent = gpa;
}
