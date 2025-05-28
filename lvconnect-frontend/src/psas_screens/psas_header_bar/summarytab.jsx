import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const responses = [
  {
    question: "Do you need to evacuate?",
    type: "multiple choice",
    options_summary: [
      { option: "Yes", count: 32 },
      { option: "No", count: 655 },
    ],
  },
  {
    question: "Do you have food supply?",
    type: "multiple choice",
    options_summary: [
      { option: "Yes", count: 687 },
      { option: "No", count: 0 },
    ],
  },
  {
    question: "What are your main concerns?",
    type: "short answer",
    responses: [
      "Running out of water and basic supplies",
      "Safety of family members in different locations",
      "Access to medical care if needed",
      "Communication with emergency services",
      "Transportation if evacuation becomes necessary",
    ],
  },
  {
    question: "Upload photos of your current situation",
    type: "upload photo",
    image_responses: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
  },
]

const SummaryTab = () => {
 
  if (!responses || responses.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No responses available.</p>
        </CardContent>
      </Card>
    )
  }

  const getTotalResponses = (question) => {
    if (question.options_summary) {
      return question.options_summary.reduce((sum, item) => sum + (item.count || 0), 0)
    }
    return 0
  }

  const getPercentage = (count, total) => {
    return total > 0 ? (count / total) * 100 : 0
  }

  return (
    <div className="space-y-6">
      {responses.map((question, qIndex) => (
        <Card key={qIndex} className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">{question.question}</CardTitle>
            {question.options_summary && (
              <Badge variant="secondary" className="w-fit">
                {getTotalResponses(question)} responses
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Multiple Choice / Dropdown / Checkboxes */}
            {["multiple choice", "checkboxes", "dropdown"].includes(question.type) && question.options_summary && (
              <div className="space-y-3">
                {question.options_summary.map((item, index) => {
                  const total = getTotalResponses(question)
                  const percentage = getPercentage(item.count, total)

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{item.option}</span>
                        <span className="text-sm text-gray-500">{item.count}</span>
                      </div>
                      <div className="relative">
                        <Progress value={percentage} className="h-8 bg-gray-100" />
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-xs font-medium text-white mix-blend-difference">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
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
                              const target = e.target
                              target.style.display = "none"
                              const parent = target.parentElement
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


export default SummaryTab;
