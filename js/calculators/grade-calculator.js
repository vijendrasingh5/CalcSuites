function loadGradeCalculator() {
    const container = document.getElementById('calculator-container');
    const card = createCalculatorCard('Grade Calculator');
    const cardBody = card.querySelector('.card-body');

    const calculatorHTML = `
        <div class="row">
            <div class="col-md-8">
                <div class="mb-3">
                    <div class="alert alert-info">
                        Enter your assessment scores and their weights to calculate your final grade.
                    </div>
                </div>
                
                <div id="assessments-container">
                    <!-- Assessment inputs will be added here -->
                </div>
                
                <div class="mb-3">
                    <button class="btn btn-secondary" onclick="addAssessment()">Add Assessment</button>
                    <button class="btn btn-primary" onclick="calculateGrade()">Calculate Grade</button>
                </div>
                
                <div class="mb-3">
                    <div class="progress" style="height: 25px;">
                        <div id="grade-progress" class="progress-bar" role="progressbar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div id="grade-result" class="alert alert-info" style="display: none;">
                    <h4 class="alert-heading">Your Grade</h4>
                    <p id="grade-value" class="display-4 mb-0"></p>
                    <p id="grade-letter" class="lead mb-0"></p>
                </div>
                
                <div class="card mt-3">
                    <div class="card-header">
                        Grade Scale
                    </div>
                    <div class="card-body">
                        <table class="table table-sm">
                            <tr><td>A+</td><td>97-100%</td></tr>
                            <td>A</td><td>93-96%</td></tr>
                            <td>A-</td><td>90-92%</td></tr>
                            <td>B+</td><td>87-89%</td></tr>
                            <td>B</td><td>83-86%</td></tr>
                            <td>B-</td><td>80-82%</td></tr>
                            <td>C+</td><td>77-79%</td></tr>
                            <td>C</td><td>73-76%</td></tr>
                            <td>C-</td><td>70-72%</td></tr>
                            <td>D+</td><td>67-69%</td></tr>
                            <td>D</td><td>63-66%</td></tr>
                            <td>D-</td><td>60-62%</td></tr>
                            <td>F</td><td>0-59%</td></tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cardBody.innerHTML = calculatorHTML;
    container.appendChild(card);
    
    // Add initial assessment input
    addAssessment();
}

function addAssessment() {
    const container = document.getElementById('assessments-container');
    const assessmentDiv = document.createElement('div');
    assessmentDiv.className = 'assessment-entry mb-3 border-bottom pb-2';
    
    const assessmentId = container.children.length + 1;
    
    assessmentDiv.innerHTML = `
        <div class="row g-2">
            <div class="col-md-5">
                <label class="form-label">Assessment ${assessmentId}</label>
                <input type="text" class="form-control assessment-name" placeholder="Quiz, Exam, Project, etc.">
            </div>
            <div class="col-md-3">
                <label class="form-label">Score</label>
                <input type="number" class="form-control assessment-score" placeholder="Your score" min="0" max="100">
            </div>
            <div class="col-md-3">
                <label class="form-label">Weight (%)</label>
                <input type="number" class="form-control assessment-weight" placeholder="% of total" min="0" max="100">
            </div>
            <div class="col-md-1">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-danger w-100" onclick="this.closest('.assessment-entry').remove()">×</button>
            </div>
        </div>
    `;
    
    container.appendChild(assessmentDiv);
}

function calculateGrade() {
    const assessments = document.querySelectorAll('.assessment-entry');
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    assessments.forEach(assessment => {
        const score = parseFloat(assessment.querySelector('.assessment-score').value);
        const weight = parseFloat(assessment.querySelector('.assessment-weight').value);
        
        if (!isNaN(score) && !isNaN(weight)) {
            totalWeightedScore += (score * weight);
            totalWeight += weight;
        }
    });
    
    if (totalWeight === 0) {
        alert('Please enter assessment weights');
        return;
    }
    
    if (totalWeight !== 100) {
        alert('Total weight should equal 100%');
        return;
    }
    
    const finalGrade = (totalWeightedScore / totalWeight).toFixed(2);
    const letterGrade = getLetterGrade(finalGrade);
    
    const resultDiv = document.getElementById('grade-result');
    const gradeValue = document.getElementById('grade-value');
    const gradeLetter = document.getElementById('grade-letter');
    const progressBar = document.getElementById('grade-progress');
    
    resultDiv.style.display = 'block';
    gradeValue.textContent = finalGrade + '%';
    gradeLetter.textContent = letterGrade;
    progressBar.style.width = finalGrade + '%';
    progressBar.textContent = finalGrade + '%';
    
    // Update progress bar color based on grade
    if (finalGrade >= 90) {
        progressBar.className = 'progress-bar bg-success';
    } else if (finalGrade >= 80) {
        progressBar.className = 'progress-bar bg-info';
    } else if (finalGrade >= 70) {
        progressBar.className = 'progress-bar bg-warning';
    } else {
        progressBar.className = 'progress-bar bg-danger';
    }
}

function getLetterGrade(score) {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 63) return 'D';
    if (score >= 60) return 'D-';
    return 'F';
}
