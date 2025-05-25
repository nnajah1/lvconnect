
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckIcon, AlertCircle } from "lucide-react"

import React, { useEffect, useState } from 'react';
import { Loader } from "@/components/dynamic/loader";
import { checkSubmission, getSurveyById, getSurveyResponse, getSurveyResponses, submitSurveyResponse } from '@/services/surveyAPI';
import { toast } from 'react-toastify';
import WebcamCapture from './captureCamera';
import api from '@/services/axios';
import { ConfirmationModal, InfoModal } from "../dynamic/alertModal"

const SurveyAnswerView = ({ surveyId, load, onSuccess, closeModal }) => {
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);
  const formDisabled = isSubmitted;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);
  // const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const submissionRes = await checkSubmission(surveyId);

        setIsSubmitted(submissionRes.data.submitted);
        setSubmittedAt(submissionRes.data.submitted_at);

        const surveyRes = await getSurveyById(surveyId);
        setSurvey(surveyRes.data);

        setAnswers(surveyRes.data.questions.map(q => ({
          survey_question_id: q.id,
          answer: '',
          img_url: '',
          taken_at: null
        })));

        if (submissionRes.data.submitted) {
          const previousAnswersRes = await getSurveyResponse(surveyId);
          if (previousAnswersRes.data && Array.isArray(previousAnswersRes.data.answers)) {
            // Map questions to answers
            const formattedAnswers = surveyRes.data.questions.map(q => {
              // Find matching answer for this question
              const matchingAnswer = previousAnswersRes.data.answers.find(
                a => a.survey_question_id === q.id
              );

              return {
                survey_question_id: q.id,
                answer: matchingAnswer?.answer || '',
                img_url: matchingAnswer?.img_url || '',
                taken_at: matchingAnswer?.taken_at || null
              };
            });
            setAnswers(formattedAnswers);
          }
        }

      } catch (err) {
        console.error('Failed to load survey data', err);
      } finally {
        setLoading(false)
      }
    };
    fetchData();
  }, [surveyId]);

  const handleTextAnswer = (questionIndex, text) => {
    if (formDisabled) return;
    const updated = [...answers];
    updated[questionIndex].answer = text;
    setAnswers(updated);
  };

  const handleChoiceAnswer = (questionIndex, choice) => {
    if (formDisabled) return;
    const updated = [...answers];
    updated[questionIndex].answer = choice;
    setAnswers(updated);
  };

  const handleCheckboxAnswer = (questionIndex, checkedValue) => {
    if (formDisabled) return;
    const updated = [...answers];
    const currentAnswer = updated[questionIndex].answer || [];
    if (Array.isArray(currentAnswer)) {
      if (currentAnswer.includes(checkedValue)) {
        updated[questionIndex].answer = currentAnswer.filter(val => val !== checkedValue);
      } else {
        updated[questionIndex].answer = [...currentAnswer, checkedValue];
      }
    } else {
      // If it's not an array yet (first checkbox selection)
      updated[questionIndex].answer = [checkedValue];
    }
    setAnswers(updated);
  };

  const handleDropdownAnswer = (questionIndex, selectedValue) => {
    if (formDisabled) return;
    const updated = [...answers];
    updated[questionIndex].answer = selectedValue;
    setAnswers(updated);
  };

  const handleWebcamCapture = (questionIndex, data) => {
    if (formDisabled) return;
    const updated = [...answers];
    updated[questionIndex] = {
      ...updated[questionIndex],
      image_base64: data.base64,
      taken_at: data.taken_at,
    };
    setAnswers(updated);
  };

  const handleModal = async () => {
    if (isSubmitting || isSubmitted) return;

    setIsConfirmModalOpen(true);
    setConfirmingSubmit(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) return;

    const requiredQuestions = survey.questions.filter(q => q.is_required);
    const missingAnswers = requiredQuestions.filter(q => {
      const questionIndex = survey.questions.findIndex(sq => sq.id === q.id);
      const answer = answers[questionIndex];
      return !answer?.answer && !answer?.image_base64;
    });

    if (missingAnswers.length > 0) {
      const missingQuestions = missingAnswers.map(q => q.question).join(', ');
      toast.error(`Please answer all required questions: ${missingQuestions}`);
      return;
    }

    setIsConfirmModalOpen(false);
    setConfirmingSubmit(true);

    setIsSubmitting(true);
    try {
      const uploadedAnswers = await Promise.all(
        answers.map(async (ans) => {
          if (ans.image_base64) {
            const blob = await (await fetch(ans.image_base64)).blob();
            const formData = new FormData();
            formData.append("image", blob, `photo_${Date.now()}.jpg`);

            const res = await api.post("/upload-photo", formData);
            return {
              ...ans,
              img_url: res.data.url,
              taken_at: ans.taken_at,
            };
          }
          return ans;
        })
      );

      await submitSurveyResponse({
        survey_id: surveyId,
        answers: uploadedAnswers.map(ans => ({
          survey_question_id: ans.survey_question_id,
          answer: ans.answer || null,
          img_url: ans.img_url || null,
          taken_at: ans.taken_at || null,
        })),
      });
      await load();
      setIsSubmitted(true);
      setSubmittedAt(new Date().toISOString());
      onSuccess();
      // closeModal();
      toast.success('Survey submitted successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submit failed:', err);
      toast.error('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center">loading...</div>;
  if (!survey)
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-medium mb-2">Survey Not Found</h2>
        <p className="text-gray-500">The requested survey could not be found or may have been deleted.</p>
      </div>
    )

  return (
      <div className="w-full p-6 md:p-8">

      {isSubmitted && (
        <Alert className="mb-8 bg-green-50 border-green-200 text-green-800">
          <CheckIcon className="h-4 w-4" />
          <AlertTitle>Survey Already Submitted</AlertTitle>
          <AlertDescription>
            You submitted this survey on {submittedAt ? new Date(submittedAt).toLocaleString() : "an earlier date"}.
            Your responses cannot be changed.
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center mb-8 bg-white rounded-xl p-2 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{survey.title}</h1>
        <p className="mt-2 text-gray-600">{survey.description}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleModal()
        }}
      >
        <div className="space-y-8 w-lg">
          {survey.questions.sort((a, b) => a.order - b.order).map((q, index) => (
            <Card key={q.id} className=" overflow-hidden border border-gray-200 shadow-sm bg-white">
              <CardContent className="px-6">
                <div className="mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-500 mt-1">{index + 1}.</span>
                    <div className="flex-1">
                      <label className="text-lg font-medium text-gray-800">
                        {q.question}
                        {q.is_required ? (<span className="text-red-500 ml-1">*</span>) : null}
                      </label>
                      <div className="text-sm text-gray-500 mt-1">{q.survey_question_type}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  {/* Photo Upload */}
                  {q.survey_question_type === "Upload Photo" && (
                    <div className="flex justify-center">
                      {!isSubmitted ? (
                        <WebcamCapture
                          onCapture={(data) => handleWebcamCapture(index, data)}
                          photo={answers[index]?.image_base64 || ''}
                        />
                      ) : answers[index]?.image_base64 || answers[index]?.img_url ? (
                        <div className="mt-4">
                          <img
                            src={answers[index]?.image_base64 || answers[index]?.img_url}
                            alt="Captured"
                            className="border max-w-xs"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No photo submitted.</p>
                      )}
                    </div>
                  )}

                  {/* Short Answer */}
                  {q.survey_question_type === 'Short answer' && (
                    <input
                      type="text"
                      className={`border ${q.is_required && !answers[index]?.answer && !formDisabled ? 'border-red-300' : 'border-gray-300'} rounded px-3 py-2 w-full`}
                      onChange={e => handleTextAnswer(index, e.target.value)}
                      value={answers[index]?.answer || ''}
                      disabled={formDisabled}
                      required={q.is_required}
                      placeholder={q.is_required ? "Required" : "Optional"}
                    />
                  )}

                  {/* Multiple Choice */}
                  {q.survey_question_type === "Multiple choice" && (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {(q.survey_question_data?.choices || []).map((choice, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 transition-colors"
                        >
                          <input
                            type="radio"
                            id={`question-${q.id}-choice-${cIdx}`}
                            name={`question-${q.id}`}
                            value={choice}
                            checked={answers && answers[index]?.answer === choice}
                            onChange={() => handleChoiceAnswer(index, choice)}
                            disabled={formDisabled}
                            required={q.is_required && !isSubmitted}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 m-auto"
                          />
                          <label
                            htmlFor={`question-${q.id}-choice-${cIdx}`}
                            className="text-gray-700 w-full cursor-pointer"
                          >
                            {choice}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Checkboxes */}
                  {q.survey_question_type === "Checkboxes" && (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {(q.survey_question_data?.choices || []).map((choice, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            id={`question-${q.id}-checkbox-${cIdx}`}
                            value={choice}
                            checked={
                              answers &&
                              Array.isArray(answers[index]?.answer) &&
                              answers[index]?.answer?.includes(choice)
                            }
                            onChange={() => handleCheckboxAnswer(index, choice)}
                            disabled={formDisabled}
                            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 m-auto"
                          />
                          <label
                            htmlFor={`question-${q.id}-checkbox-${cIdx}`}
                            className="text-gray-700 w-full cursor-pointer"
                          >
                            {choice}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dropdown */}
                  {q.survey_question_type === "Dropdown" && (
                    <div className="relative">
                      <Select
                        value={answers && answers[index]?.answer ? answers[index].answer : ""}
                        onValueChange={(value) => handleDropdownAnswer(index, value)}
                        disabled={formDisabled}
                      >
                        <SelectTrigger className="bg-white w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {(q.survey_question_data?.choices || []).map((choice, cIdx) => (
                            <SelectItem key={cIdx} value={choice}>
                              {choice}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {isConfirmModalOpen && (
          <InfoModal
            isOpen={isConfirmModalOpen}
            closeModal={() => setIsConfirmModalOpen(false)}
            title="Confirm Submission"
            description="Once submitted, you will not be able to edit your responses. Are you sure you want to submit?"
          >
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSubmit}
              >
                Yes, Submit
              </button>
            </div>
          </InfoModal>
        )}
        {/* {confirmingSubmit && (
          <ConfirmationModal

            isOpen={isSuccessModalOpen}
            closeModal={() => setIsSuccessModalOpen(false)}
            title="Response Submitted"
            description="Your response has been successfully submitted."
          >
            Manage Surveys
          </ConfirmationModal>
        )
        } */}

        <div className="mt-8 text-center">
          {!isSubmitted ? (
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          ) : (
            <div className="p-4 bg-gray-50 rounded-md text-gray-600 border border-gray-200">
              <p>This survey has been completed and cannot be edited.</p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
export default SurveyAnswerView;
