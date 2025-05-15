"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckIcon, AlertCircle } from "lucide-react"
import React from 'react';

const SurveyAdminView = ({ responseData }) => {

  if (!responseData)
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-medium mb-2">Survey Not Found</h2>
        <p className="text-gray-500">The requested survey could not be found or may have been deleted.</p>
      </div>
    );

  const { survey, answers, submitted_at } = responseData;

  return (
    <div className="mx-auto p-6 md:p-8">
      <div className="text-center mb-8 bg-white rounded-xl p-2">
        <p className="mt-2 text-gray-600">{submitted_at}</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{survey.title}</h1>
        <p className="mt-2 text-gray-600">{survey.description}</p>
      </div>

      <div className="space-y-8">
        {answers.map((a, index) => (
          <Card key={a.question.id} className="overflow-hidden border border-gray-200 shadow-sm bg-white">
            <CardContent className="px-6">
              <div className="mb-4">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-gray-500 mt-1">{index + 1}.</span>
                  <div className="flex-1">
                    <label className="text-lg font-medium text-gray-800">
                      {a.question.question_data}
                    </label>
                    <div className="text-sm text-gray-500 mt-1">{a.question.type}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {/* Photo Upload */}
                {a.img_url && (
                  <div className="flex items-center justify-center">
                    <img src={a.img_url} alt="Uploaded" className="max-w-xs rounded" />
                  </div>
                )}

                {/* Render Answer */}
                {Array.isArray(a.answer) ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {a.answer.length > 0 ? (
                      a.answer.map((ans, i) => <li key={i}>{ans}</li>)
                    ) : (
                      <li><i>No selection</i></li>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-700">{a.answer || <i>No answer</i>}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};


export default SurveyAdminView;
