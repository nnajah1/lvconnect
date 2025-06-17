"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { getGrades } from "@/services/axios"
import { Loader3 } from "@/components/dynamic/loader"

const Grades = () => {
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [gradesByTerm, setGradesByTerm] = useState({})
  const [error, setError] = useState(null)

  const [gradeTemplatesByTerm, setGradeTemplatesByTerm] = useState({})
  // const data = {
  //   schoolYear: '2024–2025',
  //   semester: 'First Semester',
  //   program: 'BS Information Systems',
  //   yearLevel: '1st Year',
  //   student: {
  //     name: 'Bacon, Chris P,',
  //     number: '21-00123BCP',
  //     scholarship: 'Institutional',
  //   },
  //   grades: [
  //     { code: 'GE 8', title: 'Ethics', units: 3, grade: '1.25', remarks: 'PASSED' },
  //     { code: 'IS 7', title: 'Enterprise Architecture', units: 3, grade: '1.50', remarks: 'PASSED' },
  //     { code: 'IS 8', title: 'IS Strategy, Management, and Acquisition', units: 3, grade: '1.50', remarks: 'PASSED' },
  //     { code: 'Capstone Project 1', title: 'Capstone Project 1', units: 3, grade: '1.50', remarks: 'PASSED' },
  //     { code: 'PrElect 6', title: 'Customer Relationship Management', units: 3, grade: '1.25', remarks: 'PASSED' },
  //     { code: 'GeElect 6', title: 'The Entrepreneurial Mind', units: 3, grade: '1.00', remarks: 'PASSED' },
  //     { code: 'CT 7', title: 'Christian Teachings 7', units: 2, grade: '1.25', remarks: 'PASSED' },
  //   ],
  //   generalAverage: {
  //     units: 18,
  //     grade: '1.33',
  //   },
  // };

  const [academicYears, setAcademicYears] = useState([]);
  const [semestersByYear, setSemestersByYear] = useState({});
  const [selectedAY, setSelectedAY] = useState('');
  const [selectedSem, setSelectedSem] = useState('');

  const loadGrades = async () => {
    setLoading(true);
    try {
      const data = await getGrades();
      setGradesByTerm(data.grades_by_term);

      setUserInfo(data.user)
      setGradeTemplatesByTerm(data.grade_templates_by_term)

      // Extract unique academic years and map semesters
      const semMap = {}; // { '2025-2026': ['1st', '2nd'] }

      Object.keys(data.grades_by_term).forEach(termKey => {
        const [year, sem] = termKey.split(' - ');
        if (!semMap[year]) semMap[year] = [];
        if (!semMap[year].includes(sem)) semMap[year].push(sem);
      });

      setAcademicYears(Object.keys(semMap));
      setSemestersByYear(semMap);

      // Set defaults
      const firstYear = Object.keys(semMap)[0];
      const firstSem = semMap[firstYear][0];
      setSelectedAY(firstYear);
      setSelectedSem(firstSem);

    } catch (err) {
      console.error("Error fetching grades:", err);
      setError("Failed to load grades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades()
  }, [])

  const selectedTermKey = `${selectedAY} - ${selectedSem}`;
  const selectedGrades = gradesByTerm[selectedTermKey] || [];

  console.log(userInfo)
  if (loading) return <Loader3 />
  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a2b4c]">Grades</h1>
          <p className="text-sm text-gray-600 mt-1">
            View your academic grades per subject as recorded for each semester.
          </p>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select
            value={selectedAY}
            onChange={(e) => {
              const newYear = e.target.value;
              setSelectedAY(newYear);
              setSelectedSem(semestersByYear[newYear][0]); // auto-select first sem
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
          >
            {academicYears.map((year, index) => (
              <option key={index} value={year}>
                A.Y {year}
              </option>
            ))}
          </select>

          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
          >
            {(semestersByYear[selectedAY] || []).map((sem, index) => (
              <option key={index} value={sem}>
                {sem} Semester
              </option>
            ))}
          </select>

        </div>
      </div>

      {selectedGrades.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 text-center text-gray-600 text-sm sm:text-base">
          <p>
            No grades have been recorded yet. Please check back later or contact the registrar for more information.
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden shadow-md mb-6">
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6 rounded-lg border border-gray-400">
            {/* Student Info */}
            <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-y-3 sm:gap-x-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-semibold text-[#1F3463] text-sm sm:text-base">Name:</span>
                  <span className="text-gray-900 text-sm sm:text-base">{userInfo?.student?.name}</span>
                </div>
                {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-semibold text-[#1F3463] text-sm sm:text-base">Program & Year Level:</span>
                  <span className="text-gray-900 text-sm sm:text-base">{userInfo?.student?.course}</span>
                </div> */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-semibold text-[#1F3463] text-sm sm:text-base">Student No.:</span>
                  <Badge className="bg-white text-gray-900 text-sm sm:text-base">
                    {userInfo?.student?.studentNumber}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-semibold text-[#1F3463] text-sm sm:text-base">Scholarship Status:</span>
                  <Badge className="bg-blue-100 text-blue-8000 border-blue-200">
                    {userInfo?.student?.scholarshipStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Grades Table */}
            <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left text-sm font-semibold px-4 py-2">Code</TableHead>
                    <TableHead className="text-left text-sm font-semibold px-4 py-2">Subject</TableHead>
                    <TableHead className="text-center text-sm font-semibold px-4 py-2">Units</TableHead>
                    <TableHead className="text-center text-sm font-semibold px-4 py-2">Grades</TableHead>
                    <TableHead className="text-center text-sm font-semibold px-4 py-2">Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedGrades.map((subject, subIndex) => (
                    <TableRow key={subIndex}>
                      <TableCell className="text-left text-sm px-4 py-2">{subject.course_code}</TableCell>
                      <TableCell className="text-left text-sm font-medium px-4 py-2">{subject.course}</TableCell>
                      <TableCell className="text-center text-sm px-4 py-2">{subject.units}</TableCell>
                      <TableCell className="text-center px-4 py-2">
                        <Badge className="bg-white text-gray-900 text-sm font-medium">{subject.grade}</Badge>
                      </TableCell>
                      <TableCell className="text-center px-4 py-2">
                        <Badge className="bg-white text-gray-900 text-sm">
                          {subject.remarks === 'passed'
                            ? 'Passed'
                            : subject.remarks === 'not_passed'
                              ? 'Failed'
                              : subject.remarks}
                        </Badge>

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="text-right text-sm font-semibold px-4 py-2">
                      Average
                    </TableCell>
                    <TableCell className="text-center text-sm font-semibold px-4 py-2">
                      {selectedGrades[0]?.all_units ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-center text-sm font-semibold text-[#1345B3] px-4 py-2">
                      {gradeTemplatesByTerm?.[`${selectedAY} - ${selectedSem}`]?.[0]?.actual_GWA ?? "N/A"}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </div>
      )}

    </div>
  )
}

export default Grades
