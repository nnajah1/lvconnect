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

const SummaryAnalytics = ({ surveyId }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(null); // change to null for clarity

  useEffect(() => {
    if (!surveyId) return;
    const fetchSummary = async () => {
      try {
        const res = await getAnalytics(surveyId);
        setQuestions(res ?? { questions: [] }); // fallback in case res is null
      } catch (error) {
        console.error('Error fetching analytics summary:', error);
        setQuestions({ questions: [] }); // fallback in case of error
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [surveyId]);

  const getTotalResponses = (question) => {
    if (question?.responses) {
      return question.responses.reduce((sum, item) => sum + (item?.count ?? 0), 0);
    }
    return 0;
  };

  const getPercentage = (count, total) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  if (loading) {
    return <div className='flex items-center justify-center'><Loader3 /></div>;
  }

  if (!questions?.questions || questions.questions.length === 0) {
    return (
      <Card className="w-full bg-gray-100">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No responses available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {questions.questions.map((question, qIndex) => (
        <Card key={qIndex} className="w-full border-0 shadow-lg bg-card-background">
          <CardHeader className="pb-6 border-b border-gray-300">
            <CardTitle className="text-xl font-bold text-gray-800">{question.question}</CardTitle>
            {question.type !== 'short answer' && question.responses?.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {getTotalResponses(question)} responses
                </Badge>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Your conditional renderings for different types */}
            {["multiple choice", "checkboxes", "dropdown"].includes(question.type) && question.responses?.length > 0 && (
              <div className="space-y-4 relative">
                {/* Bars */}
                {question.responses.map((item, index) => {
                  const total = getTotalResponses(question);
                  const percentage = getPercentage(item?.count ?? 0, total);

                  return (
                    <div key={index} className="space-y-2 mb-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-700 min-w-0 flex-1">{item.option}</span>
                      </div>
                      <div className="relative bg-gray-100 rounded-xl h-8 overflow-hidden border border-gray-200">
                        <div
                          className="h-full bg-gradient-to-r from-green-700 to-green-600 transition-all duration-700 ease-out flex items-center justify-end pr-3 shadow-sm"
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        >
                          <span className="text-white font-bold text-sm drop-shadow-sm">{item.count ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {question.type === "short answer" && question.responses?.length > 0 && (
              <div className="space-y-3">
                {question.responses.slice(0, 3).map((text, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border text-sm">
                    {text}
                  </div>
                ))}
                {question.responses.length > 3 && (
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="text-sm text-blue-600">See all {question.responses.length} responses</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {question.type === "upload photo" && question.image_responses?.length > 0 && (
              <div className="space-y-4">
                {/* Image list rendering */}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


export default SummaryAnalytics;
