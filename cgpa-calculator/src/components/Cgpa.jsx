import React, { useState, useEffect } from 'react';
import './Cgpa.css';
import { subjects, semesterSubjects } from './Data.js';

const gradeToPoints = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'D': 4,
  'E': 3,
  'RA': 0,
};

const Dropdown = ({ options, onChange, label, value }) => (
  <div className="form-group">
    {label && <label>{label}: </label>}
    <select
      className="form-control cgpa_form_select"
      onChange={onChange}
      value={value}
    >
      <option value="" disabled>
        Select
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const Cgpa = () => {
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [selectedGrades, setSelectedGrades] = useState({});
  const [arrearSubjects, setArrearSubjects] = useState([]);
  const [overallCgpa, setOverallCgpa] = useState('0.00');
  const [progress, setProgress] = useState(0);
  const [showArrearForm, setShowArrearForm] = useState(false);
  const [arrearSubjectCode, setArrearSubjectCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState('front');

  const subject_s = department && semester && semesterSubjects[department] && semesterSubjects[department][semester]
    ? semesterSubjects[department][semester].code.map(code => {
        const subjectInfo = subjects[department + "_subs"][code];
        return { code: code, name: subjectInfo.subname, credit: subjectInfo.credits };
      })
    : [];

  const combinedSubjects = [...subject_s, ...arrearSubjects];

  const calculateOverallCgpa = () => {
    let totalCredits = 0;
    let weightedSum = 0;

    combinedSubjects.forEach((subject) => {
      const grade = selectedGrades[subject.name];
      const points = gradeToPoints[grade];
      const credits = subject.credit || 0;

      if (!isNaN(points)) {
        weightedSum += points * credits;
        totalCredits += credits;
      }
    });

    const calculatedCgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : '0.00';
    setOverallCgpa(calculatedCgpa);
    return calculatedCgpa;
  };

  const handleCalculateCgpa = () => {
    const calculatedCgpa = calculateOverallCgpa();
    if (calculatedCgpa !== null) {
      const progressPercentage = parseFloat(calculatedCgpa) * 10;
      setProgress(progressPercentage);
      setOverallCgpa(calculatedCgpa);
    }
  };

  const handleDeptSelect = (event) => {
    const newDepartment = event.target.value;
    setDepartment(newDepartment);

    setSelectedGrades({});
    setArrearSubjects([]);
    setOverallCgpa('0.00');
    setProgress(0);
  };

  const handleSemesterSelect = (event) => {
    const newSemester = event.target.value;
    setSemester(newSemester);

    setSelectedGrades({});
    setOverallCgpa('0.00');
    setProgress(0);
  };

  const handleGradeChange = (subjectCode, event) => {
    setSelectedGrades((prevState) => ({
      ...prevState,
      [subjectCode]: event.target.value,
    }));
  };

  const handleAddArrearSubject = () => {
    setShowArrearForm(true);
  };

  const handleArrearFormSubmit = (event) => {
    event.preventDefault();
    const subjectInfo = subjects[department + "_subs"][arrearSubjectCode];
    if (subjectInfo) {
      setArrearSubjects((prevState) => [
        ...prevState,
        { code: arrearSubjectCode, name: subjectInfo.subname, credit: subjectInfo.credits },
      ]);
      setShowArrearForm(false);
      setArrearSubjectCode('');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid subject code for the selected department.');
    }
  };

  const allGradesSelected = combinedSubjects.length > 0 && combinedSubjects.every(
    (subject) => selectedGrades[subject.name]
  );

  useEffect(() => {
    document.title = 'SGPA Calculator';
  }, []);

  if (page === 'front') {
    return (
      <div className="front-page">
        <h1 className="text-white">Welcome to SGPA Calculator</h1>
        
        <button
          className="btn btn-primary"
          onClick={() => setPage('content')}
        >
          Start
        </button>
      </div>
    );
  }

  return (
    <div className="container content-page">
      <h1 className="text-center">SGPA Calculator</h1>

      <div className="cgpa_dept_sem">
        <div className="cgpa_content">Select your Department and Semester</div>
        <div className="cgpa_dropdowns">
        <div class="dropdown" data-bs-theme="dark">
          <Dropdown
            options={['CIVIL', 'MECH', 'EEE', 'ECE', 'CSE']}
            onChange={handleDeptSelect}
            label="Department"
            value={department}
          />
          <Dropdown
            options={[1, 2, 3, 4, 5, 6, 7]}
            onChange={handleSemesterSelect}
            label="Semester"
            value={semester}
          />
        </div>
      </div>
      </div>

      {combinedSubjects.length > 0 && (
        <div className="cgpa_subjects">
          <h2 className="text-center">Choose Grades for Each Subject</h2>
          {combinedSubjects.map((subject, index) => (
            <div key={index} className="cgpa_subject row">
              <div className="col-md-6">
                <p>{subject.name}</p>
                <small>{subject.code}</small>
              </div>
              <div className="col-md-6">
                <Dropdown
                  options={Object.keys(gradeToPoints)}
                  onChange={(e) => handleGradeChange(subject.name, e)}
                  value={selectedGrades[subject.name] || ""}
                />
              </div>
            </div>
          ))}
          <div className="text-center">
            <button
              className="btn btn-secondary"
              onClick={handleAddArrearSubject}
            >
              Add Arrear Subject
            </button>
          </div>
          {showArrearForm && (
            <div className="cgpa_arrear_form">
              <form onSubmit={handleArrearFormSubmit} className="form-inline">
                <input
                  type="text"
                  placeholder="Enter Arrear Subject Code"
                  className="form-control mb-2 mr-sm-2"
                  value={arrearSubjectCode}
                  onChange={(e) => {
                    setArrearSubjectCode(e.target.value);
                    setErrorMessage('');
                  }}
                  required
                />
                <button type="submit" className="btn btn-primary mb-2">
                  Add
                </button>
                <button
                  type="button"
                  className="btn btn-danger mb-2"
                  onClick={() => setShowArrearForm(false)}
                >
                  Cancel
                </button>
              </form>
              {errorMessage && (
                <div className="cgpa_error_message">{errorMessage}</div>
              )}
            </div>
          )}
          <div className="text-center">
            <button
              className="btn btn-success"
              onClick={handleCalculateCgpa}
              disabled={!allGradesSelected}
            >
              Calculate GPA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cgpa;
