import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { User, GraduationCap, Award } from "lucide-react"

const Grades = () => {
  const [expanded, setExpanded] = useState(false);

  const data = {
    schoolYear: '2024–2025',
    semester: 'First Semester',
    program: 'BS Information Systems',
    yearLevel: '1st Year',
    student: {
      name: 'Bacon, Chris P,',
      number: '21-00123BCP',
      scholarship: 'Institutional',
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
  <div className="p-3 sm:p-4 md:p-6 bg-muted min-h-screen">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 sm:mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1a2b4c]">Grades</h1>
    </div>

    {/* Semester Card */}
    <div className="rounded-t-xl overflow-hidden shadow-md">
      <div className="bg-[#1793d1] px-4 sm:px-6 py-3 text-white font-semibold text-base sm:text-lg rounded-t-xl">
        School Year {data.schoolYear}
      </div>

      <div className="bg-white px-4 sm:px-6 py-4 border border-t-0 border-gray-200 rounded-b-xl">
        <div className="p-3 sm:p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div className="space-y-1 sm:space-y-0">
            <p className="font-semibold text-sm sm:text-base">{data.semester}</p>
            <p className="text-sm sm:text-base">
              <span className="font-semibold">Program & Year Level:</span>{' '}
              <span className="block sm:inline mt-1 sm:mt-0">{data.program} – {data.yearLevel}</span>
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
                {/* Student Information Section */}
                <div className="bg-gray-100 p-4 sm:p-5 rounded-lg border border-gray-100">
                  <div className="space-y-2 sm:space-y-3">
                    {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Name:</span>
                      <span className="text-gray-900 text-sm sm:text-base">{data.student.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Student No.:</span>
                      <Badge variant="outline" className="font-mono text-xs sm:text-sm self-start">
                        {data.student.number}
                      </Badge>
                    </div> */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Scholarship Status:</span>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 text-xs sm:text-sm self-start">
                        {data.student.scholarship}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Grades Table Section */}
                {data.grades ? (
                  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    {/* Mobile: Card layout */}
                    <div className="block sm:hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-700 text-sm">Subjects & Grades</h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {data.grades.map((subject, index) => (
                          <div key={index} className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {subject.code}
                                  </Badge>
                                </div>
                                <h4 className="font-medium text-gray-900 text-sm leading-tight">{subject.title}</h4>
                              </div>
                              <div className="flex flex-col items-end gap-1 ml-2">
                                <Badge
                                  variant={subject.grade.startsWith("A") ? "default" : "secondary"}
                                  className={`font-mono font-medium text-xs ${
                                    subject.grade.startsWith("A")
                                      ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                                      : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                                  }`}
                                >
                                  {subject.grade}
                                </Badge>
                                <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
                                  {subject.remarks}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-xs text-gray-500">Units:</span>
                              <Badge variant="secondary" className="font-mono text-xs">
                                {subject.units}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {/* Mobile General Average */}
                        <div className="p-4 bg-blue-50 border-t-2 border-blue-100">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800 text-sm">General Average:</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="font-mono font-bold text-xs">
                                {data.generalAverage.units}
                              </Badge>
                              <Badge className="bg-blue-600 hover:bg-blue-700 font-mono font-bold text-white text-xs">
                                {data.generalAverage.grade}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Table layout */}
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
                          {data.grades.map((subject, index) => (
                            <TableRow key={index} className="hover:bg-gray-50/50 transition-colors">
                              <TableCell className="text-center font-medium text-gray-500 text-xs sm:text-sm">{index + 1}</TableCell>
                              <TableCell className="font-mono text-xs sm:text-sm font-medium text-gray-900">{subject.code}</TableCell>
                              <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">{subject.title}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary" className="font-mono text-xs">
                                  {subject.units}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={subject.grade.startsWith("A") ? "default" : "secondary"}
                                  className={`font-mono font-medium text-xs ${
                                    subject.grade.startsWith("A")
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
                                {data.generalAverage.units}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className="bg-blue-600 hover:bg-blue-700 font-mono font-bold text-white text-xs">
                                {data.generalAverage.grade}
                              </Badge>
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <Card className="p-6 sm:p-8 text-center border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <div className="text-gray-500">
                      <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-base sm:text-lg font-medium text-gray-600">No grade data available</p>
                      <p className="text-sm text-gray-500">Grades will appear here once they are recorded.</p>
                    </div>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default Grades;
