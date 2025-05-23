import React, { useState } from 'react';

const Grades = () => {
  const [expanded, setExpanded] = useState(false);

  const data = {
    schoolYear: '2024–2025',
    semester: 'First Semester',
    program: 'BS Information Systems',
    yearLevel: '4th Year',
    student: {
      name: 'Pegarit, Alona Joy P.',
      number: '21-00174APP',
      scholarship: 'Institutional (Full Scholar)',
    },
    grades: [
      { code: 'GE 8', title: 'Ethics', units: 3, grade: '1.25', remarks: 'PASSED' },
      { code: 'IS 7', title: 'Enterprise Architecture', units: 3, grade: '1.50', remarks: 'PASSED' },
      { code: 'IS 8', title: 'IS Strategy, Management, and Acquisition', units: 3, grade: '1.50', remarks: 'PASSED' },
      { code: 'Capstone Project 1', title: 'Capstone Project 1', units: 3, grade: '1.50', remarks: 'PASSED' },
      { code: 'PrElect 6', title: 'Customer Relationship Management', units: 3, grade: '1.25', remarks: 'PASSED' },
      { code: 'GeElect 6', title: 'The Entrepreneurial Mind', units: 3, grade: '1.00', remarks: 'PASSED' },
      { code: 'CT 7', title: 'Christian Teachings 7', units: 2, grade: '1.25', remarks: 'PASSED' },
    ],
    generalAverage: {
      units: 18,
      grade: '1.33',
    },
  };

  const toggleGrades = () => setExpanded(!expanded);

  return (
    <div className="p-4 md:p-6 bg-muted min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1a2b4c]">Grades</h1>
      
      </div>

      {/* Semester Card */}
      <div className="rounded-t-xl overflow-hidden shadow-md">
        <div className="bg-[#1793d1] px-6 py-3 text-white font-semibold text-lg rounded-t-xl">
          School Year {data.schoolYear}
        </div>

        <div className="bg-white px-6 py-4 border border-t-0 border-gray-200 rounded-b-xl">
          <div className="p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between gap-4 md:items-center">
            <div>
              <p className="font-semibold">{data.semester}</p>
              <p>
                <span className="font-semibold">Program & Year Level:</span>{' '}
                {data.program} – {data.yearLevel}
              </p>
            </div>
            <button
              onClick={toggleGrades}
              className="self-start md:self-auto bg-[#1793d1] hover:bg-[#137fb3] text-white text-sm px-4 py-2 rounded shadow flex items-center gap-2"
            >
              {expanded ? 'Hide Grades' : 'View Grades'}
            </button>
          </div>

          {expanded && (
            <div className="mt-6 overflow-x-auto">
              <div className="mb-4 text-sm">
                <p className="font-semibold">Summary of Grades</p>
                <div className="flex flex-col md:flex-row justify-between mt-2">
                  <div>
                    <p><span className="font-semibold">Name:</span> {data.student.name}</p>
                    <p><span className="font-semibold">Student No.:</span> {data.student.number}</p>
                    <p><span className="font-semibold">Scholarship Status:</span> {data.student.scholarship}</p>
                  </div>
                 
                </div>
              </div>

              <table className="w-full text-sm border border-collapse">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="border px-2 py-2">#</th>
                    <th className="border px-2 py-2">Subject Code</th>
                    <th className="border px-2 py-2">Subject Title</th>
                    <th className="border px-2 py-2">Units</th>
                    <th className="border px-2 py-2">Grade</th>
                    <th className="border px-2 py-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {data.grades.map((subject, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">{index + 1}</td>
                      <td className="border px-2 py-1">{subject.code}</td>
                      <td className="border px-2 py-1">{subject.title}</td>
                      <td className="border px-2 py-1 text-center">{subject.units}</td>
                      <td className="border px-2 py-1 text-center">{subject.grade}</td>
                      <td className="border px-2 py-1 text-center">{subject.remarks}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="border px-2 py-1 text-right font-semibold">Gen. Average:</td>
                    <td className="border px-2 py-1 text-center">{data.generalAverage.units}</td>
                    <td className="border px-2 py-1 text-center">{data.generalAverage.grade}</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grades;
