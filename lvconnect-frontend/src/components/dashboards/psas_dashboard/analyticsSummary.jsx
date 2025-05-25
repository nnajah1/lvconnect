import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Loader3 } from '@/components/dynamic/loader';
import { getAnalytics } from '@/services/dashboardAPI';

// const questions = [
//   {
//     question: "Do you need to evacuate?",
//     type: "multiple choice",
//     responses: [
//       { option: "Yes", count: 32 },
//       { option: "No", count: 655 },
//     ],
//   },
//   {
//     question: "Do you have food supply?",
//     type: "multiple choice",
//     responses: [
//       { option: "Yes", count: 687 },
//       { option: "No", count: 0 },
//     ],
//   },
//   {
//     question: "What are your main concerns?",
//     type: "short answer",
//     responses: [
//       "Running out of water and basic supplies",
//       "Safety of family members in different locations",
//       "Access to medical care if needed",
//       "Communication with emergency services",
//       "Transportation if evacuation becomes necessary",
//     ],
//   },
//   {
//     question: "Upload photos of your current situation",
//     type: "upload photo",
//     image_responses: [
//       "/placeholder.svg?height=100&width=100",
//       "/placeholder.svg?height=100&width=100",
//       "/placeholder.svg?height=100&width=100",
//     ],
//   },
// ]

const SummaryAnalytics = ({surveyId}) => {
  
    const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
   useEffect(() => {
      if (!surveyId) return;
      const fetchSummary = async () => {
        try {
          const res = await getAnalytics(surveyId);
          setQuestions(res);
        } catch (error) {
          console.error('Error fetching analytics summary:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSummary();
    }, [surveyId]);

    
 
  const getTotalResponses = (question) => {
    if (question.responses) {
      return question.responses.reduce((sum, item) => sum + (item.count || 0), 0)
    }
    return 0
  }

  const getPercentage = (count, total) => {
    return total > 0 ? (count / total) * 100 : 0
  }

   if (loading) return (
    <div className='flex items-center justify-center'><Loader3/></div>
  );

  if (!questions || questions.length === 0) {
    return (
      <Card className="w-full bg-gray-100">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No responses available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {questions.questions?.map((question, qIndex) => (
        <Card key={qIndex} className="w-full border-0 shadow-lg bg-card-background">
          <CardHeader className="pb-6 border-b border-gray-300">
            <CardTitle className="text-xl font-bold text-gray-800">{question.question}</CardTitle>
            {question.type !== 'short answer' && question.responses && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {getTotalResponses(question)} responses
                </Badge>
              </div>
            )}

          </CardHeader>

          <CardContent className="">
            {/* Multiple Choice / Dropdown / Checkboxes */}
            {["multiple choice", "checkboxes", "dropdown"].includes(question.type) && question.responses && (
              <div className="space-y-4 relative">
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-10 h-full">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="border-r border-gray-200 last:border-r-0" />
                    ))}
                  </div>
                </div>

                <div className="relative z-10">
                  {question.responses.map((item, index) => {
                    const total = getTotalResponses(question)
                    const percentage = getPercentage(item.count, total)

                    return (
                      <div key={index} className="space-y-2 mb-6">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-gray-700 min-w-0 flex-1">{item.option}</span>
                          {/* <span className="text-lg font-bold text-gray-900 ml-4">{item.count}</span> */}
                        </div>
                        <div className="relative bg-gray-100 rounded-xl h-8 overflow-hidden border border-gray-200">
                          <div
                            className="h-full bg-gradient-to-r from-green-700 to-green-600 transition-all duration-700 ease-out flex items-center justify-end pr-3 shadow-sm"
                            style={{ width: `${Math.max(percentage, 2)}%` }}
                          >
                            <span className="text-white font-bold text-sm drop-shadow-sm">{item.count}</span>
                          </div>
                          <div className="absolute inset-0 flex items-end">
                            <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          </div>
                        </div>

                        {index === question.responses.length - 1 && (
                          <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                            <span>0</span>
                            <span>{Math.round(total * 0.25)}</span>
                            <span>{Math.round(total * 0.5)}</span>
                            <span>{Math.round(total * 0.75)}</span>
                            <span>{total}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Short Answer */}
            {question.type === "short answer" && question.responses && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {question.responses.slice(0, 3).map((text, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border text-sm">
                      {text}
                    </div>
                  ))}
                </div>
                {question.responses.length > 3 && (
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="text-sm text-blue-600">See all {question.responses.length} responses</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Image Upload */}
            {question.type === "upload photo" && question.image_responses && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 border-b pb-2">
                    <span className="col-span-1">#</span>
                    <span className="col-span-3">Preview</span>
                    <span className="col-span-8">URL</span>
                  </div>

                  {question.image_responses.slice(0, 5).map((url, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="col-span-1 text-sm text-gray-600">{idx + 1}</span>
                      <div className="col-span-3">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none"
                              const parent = e.target.parentElement
                              if (parent) {
                                const icon = document.createElement("div")
                                icon.className = "w-full h-full flex items-center justify-center"
                                icon.innerHTML =
                                  '<svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>'
                                parent.appendChild(icon)
                              }
                            }}
                          />
                        </div>
                      </div>
                      <span className="col-span-8 text-sm text-gray-600 truncate">{url}</span>
                    </div>
                  ))}
                </div>

                {question.image_responses.length > 5 && (
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="text-sm text-blue-600">See all {question.image_responses.length} images</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

}

export default SummaryAnalytics;
