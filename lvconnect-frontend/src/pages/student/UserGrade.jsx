import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { User, GraduationCap, Award } from "lucide-react"
import { getGrades } from '@/services/axios';
import { Loader3 } from '@/components/dynamic/loader';

const Grades = () => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [gradesByTerm, setGradesByTerm] = useState({});
  const [gradeTemplatesByTerm, setGradeTemplatesByTerm] = useState({});
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

  const loadGrades = async () => {
    setLoading(true);
    try {
      const data = await getGrades();
      setUserInfo(data.user);
      setGradesByTerm(data.grades_by_term);
      setGradeTemplatesByTerm(data.grade_templates_by_term);
    } catch (err) {
      console.error('Error fetching grades:', err);
      setError('Failed to load grades.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadGrades();
  }, []);

  const toggleGrades = () => setExpanded(!expanded);
  if(loading) return (
    <Loader3 />
  )
  return (
    <div className="p-3 sm:p-4 md:p-6 bg-muted min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a2b4c]">Grades</h1>
      </div>

      {Object.keys(gradesByTerm).length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 text-center text-gray-600 text-sm sm:text-base">
          <p>No grades have been recorded yet. Please check back later or contact the registrar for more information.</p>
        </div>
      ) : (
        Object.entries(gradesByTerm).map(([termKey, termGrades]) => {
          const [academicYear, term] = termKey.split(' - ');
          const gradeTemplate = gradeTemplatesByTerm?.[termKey]?.[0];

          return (
            <div key={termKey} className="rounded-xl overflow-hidden shadow-md mb-6">
              <div className="bg-[#1793d1] px-4 sm:px-6 py-3 text-white font-semibold text-base sm:text-lg rounded-t-xl">
                {academicYear} – {term}
              </div>

              <div className="bg-white px-4 sm:px-6 py-4 border border-t-0 border-gray-200 rounded-b-xl">
                <div className="p-3 sm:p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between gap-4 md:items-center">
                  <div className="space-y-1 sm:space-y-0">
                    <p className="font-semibold text-sm sm:text-base">{term}</p>
                    <p className="text-sm sm:text-base">
                      <span className="font-semibold">Program & Year Level:</span>{' '}
                      <span className="block sm:inline mt-1 sm:mt-0">{userInfo?.program} – {userInfo?.yearLevel}</span>
                    </p>
                  </div>
                  <button
                    onClick={toggleGrades}
                    className="self-start md:self-auto bg-[#1793d1] hover:bg-[#137fb3] text-white text-sm px-4 py-2 rounded shadow flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    {expanded ? 'Hide Grades' : 'View Grades'}
                  </button>
                </div>

                {expanded && (
                  <div className="p-3 sm:p-4 lg:p-6">
                    <Card className="shadow-sm border-0">
                      <CardHeader className="bg-white border-b border-gray-100 p-4 sm:p-6">
                        <CardTitle className="text-base sm:text-lg text-gray-900">Summary of Grades</CardTitle>
                      </CardHeader>

                      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        {/* Student Info */}
                        <div className="bg-gray-100 p-4 sm:p-5 rounded-lg border border-gray-100">
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <span className="font-medium text-gray-700 text-sm sm:text-base">Name:</span>
                              <span className="text-gray-900 text-sm sm:text-base">{userInfo?.student?.name}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <span className="font-medium text-gray-700 text-sm sm:text-base">Student No.:</span>
                              <Badge variant="outline" className="font-mono text-xs sm:text-sm self-start">
                                {userInfo?.student?.studentNumber}
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <span className="font-medium text-gray-700 text-sm sm:text-base">Scholarship Status:</span>
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 text-xs sm:text-sm self-start">
                                {userInfo?.student?.scholarshipStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Grades Table */}
                        <div className="hidden sm:block overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="text-center font-semibold text-gray-700 text-xs sm:text-sm">#</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Subject Code</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Subject Title</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 text-xs sm:text-sm">Units</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 text-xs sm:text-sm">Grade</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 text-xs sm:text-sm">Remarks</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {termGrades.map((subject, subIndex) => (
                                <TableRow key={subIndex} className="hover:bg-gray-50/50 transition-colors">
                                  <TableCell className="text-center font-medium text-gray-500 text-xs sm:text-sm">{subIndex + 1}</TableCell>
                                  <TableCell className="font-mono text-xs sm:text-sm font-medium text-gray-900">{subject.course_code}</TableCell>
                                  <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">{subject.course}</TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant="secondary" className="font-mono text-xs">{subject.units}</Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      className={`font-mono font-medium text-xs ${subject.grade?.startsWith("A")
                                          ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                                          : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                                        }`}
                                    >
                                      {subject.grade}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
                                      {subject.remarks}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow className="bg-blue-50 hover:bg-blue-50 border-t-2 border-blue-100">
                                <TableCell colSpan={3} className="text-right font-bold text-gray-800 text-xs sm:text-sm">
                                  General Average:
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="secondary" className="font-mono font-bold text-xs">
                                    {termGrades[0]?.all_units ?? 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge className="bg-blue-600 hover:bg-blue-700 font-mono font-bold text-white text-xs">
                                    {gradeTemplate?.actual_GWA ?? 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

};

export default Grades;
