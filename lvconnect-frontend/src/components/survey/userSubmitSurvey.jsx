import React, { useEffect, useState } from 'react';
import Loader from '../dynamic/loader';
import { getSurveyById, submitSurveyResponse } from '@/services/surveyAPI';
import { toast } from 'react-toastify'; 

const SurveyAnswerView = ({ surveyId, studentId }) => {
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);

  const formDisabled = isSubmitted;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const surveyRes = await getSurveyById(surveyId);
        setSurvey(surveyRes.data);

        setAnswers(surveyRes.data.questions.map(q => ({
          survey_question_id: q.id,
          answer: '',
          img_url: '',
          taken_at: null
        })));

        const submissionRes = await api.get(`/survey-submissions/check/${surveyId}`);
        setIsSubmitted(submissionRes.data.submitted);
        setSubmittedAt(submissionRes.data.submitted_at);

        if (submissionRes.data.submitted) {
          const previousAnswersRes = await api.get(`/survey-responses/${surveyId}`);
          if (previousAnswersRes.data && previousAnswersRes.data.answers) {
            const formattedAnswers = surveyRes.data.questions.map(q => {
              const matchingAnswer = previousAnswersRes.data.answers.find(a => a.survey_question_id === q.id);
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
    if (currentAnswer.includes(checkedValue)) {
      updated[questionIndex].answer = currentAnswer.filter(val => val !== checkedValue);
    } else {
      updated[questionIndex].answer = [...currentAnswer, checkedValue];
    }
    setAnswers(updated);
  };

  const handleDropdownAnswer = (questionIndex, selectedValue) => {
    if (formDisabled) return;
    const updated = [...answers];
    updated[questionIndex].answer = selectedValue;
    setAnswers(updated);
  };

  const handleFileSelection = async (questionIndex, files) => {
    if (!files || files.length === 0 || formDisabled) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    try {
      await handleFileUpload(questionIndex, file);
    } catch (err) {
      console.error('Error handling file selection:', err);
      toast.error('Failed to process the selected file. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) return;

    const requiredQuestions = survey.questions.filter(q => q.is_required);
    const missingAnswers = requiredQuestions.filter(q => {
      const questionIndex = survey.questions.findIndex(sq => sq.id === q.id);
      const answer = answers[questionIndex];
      return !answer?.answer && !answer?.img_url;
    });

    if (missingAnswers.length > 0) {
      const missingQuestions = missingAnswers.map(q => q.question).join(', ');
      toast.error(`Please answer all required questions: ${missingQuestions}`);
      return;
    }

    const confirmSubmit = window.confirm('Once submitted, you will not be able to edit your responses. Are you sure you want to submit?');

    if (!confirmSubmit) return;

    setIsSubmitting(true);
    try {
      await submitSurveyResponse({
        survey_id: surveyId,
        answers: answers
      });

      setIsSubmitted(true);
      setSubmittedAt(new Date().toISOString());

      toast.success('Survey submitted successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submit failed:', err);
      toast.error('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!survey) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">{survey.title}</h1>
      <p className="mb-4">{survey.description}</p>

      {isSubmitted && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p className="font-bold">Survey Already Submitted</p>
          <p>You submitted this survey on {new Date(submittedAt).toLocaleString()}.</p>
          <p>Your responses cannot be changed.</p>
        </div>
      )}


      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        {survey.questions.map((q, index) => (
          <div key={q.id} className="mb-6">
            <label className="block font-medium mb-2">
              {index + 1}. {q.question}
              {q.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Question type indicator for clarity */}
            <div className="text-sm text-gray-500 mb-2">
              {q.survey_question_type}
            </div>

            {/* File Upload */}
            {q.survey_question_type === 'Upload Photo' && (
              <div className="upload-box border-2 border-dashed border-gray-300 p-4 rounded">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileSelection(index, e.target.files)}
                  className="w-full"
                />
                {answers[index]?.img_url && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓ Image uploaded</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (formDisabled) return;

                          const updated = [...answers];
                          updated[index].img_url = '';
                          updated[index].taken_at = null;
                          setAnswers(updated);
                        }}
                        className="text-red-500 text-xs hover:underline"
                        disabled={formDisabled}
                      >
                        Remove
                      </button>
                    </div>
                    <img
                      src={answers[index].img_url}
                      alt="Uploaded"
                      className="mt-2 h-40 object-contain"
                    />
                  </div>
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
            {q.survey_question_type === 'Multiple choice' && (
              <div className={`p-3 rounded ${q.is_required && !answers[index]?.answer && !formDisabled ? 'bg-red-50 border border-red-200' : ''}`}>
                {(q.survey_question_data?.choices || []).map((choice, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 my-1">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={choice}
                      checked={answers[index]?.answer === choice}
                      onChange={() => handleChoiceAnswer(index, choice)}
                      disabled={formDisabled}
                      required={q.is_required}
                    />
                    <label>{choice}</label>
                  </div>
                ))}
              </div>
            )}

            {/* Checkboxes */}
            {q.survey_question_type === 'Checkboxes' && (
              <div className="p-3">
                {(q.survey_question_data?.choices || []).map((choice, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 my-1">
                    <input
                      type="checkbox"
                      value={choice}
                      checked={answers[index]?.answer?.includes(choice)}
                      onChange={() => handleCheckboxAnswer(index, choice)}
                      disabled={formDisabled}
                    />
                    <label>{choice}</label>
                  </div>
                ))}
              </div>
            )}

            {/* Dropdown */}
            {q.survey_question_type === 'Dropdown' && (
              <select
                className={`border ${q.is_required && !answers[index]?.answer && !formDisabled ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 w-full`}
                value={answers[index]?.answer || ''}
                onChange={e => handleDropdownAnswer(index, e.target.value)}
                disabled={formDisabled}
                required={q.is_required}
              >
                <option value="">Select an option</option>
                {(q.survey_question_data?.choices || []).map((choice, cIdx) => (
                  <option key={cIdx} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        {!isSubmitted ? (
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        ) : (
          <div className="mt-4 text-gray-600">
            <p>This survey has been completed and cannot be edited.</p>
          </div>
        )}
      </form>
    </div>
  );
};

  

export default SurveyAnswerView;
