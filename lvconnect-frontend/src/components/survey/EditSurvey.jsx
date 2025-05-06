import React, { useEffect, useState } from 'react';
import Loader from '../dynamic/loader';
import { getSurveyById, updateSurvey } from '@/services/surveyAPI';
import SurveyBuilder from './SurveyBuilder';

import {
  isChoiceBased,
} from '@/utils/surveyUtils';

const EditSurvey = ({ surveyId, onSuccess }) => {
  const [surveyData, setSurveyData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        setIsLoading(true);
        const res = await getSurveyById(surveyId);
        setSurveyData(res.data);
        
        // Transform questions to match the expected format
        const transformedQuestions = res.data.questions.map(q => {
          let questionData;
          try {
            questionData = typeof q.survey_question_data === 'string' 
              ? JSON.parse(q.survey_question_data) 
              : q.survey_question_data || {};
          } catch {
            questionData = {};
          }
          
          const choices = Array.isArray(questionData.choices) && questionData.choices.length > 0 
            ? questionData.choices 
            : (isChoiceBased(q.survey_question_type) ? [''] : []);

          return {
            id: q.id,
            question: q.question,
            type: q.survey_question_type,
            choices: choices,
            is_required: Boolean(q.is_required),
            order: q.order
          };
        });
        
        // Sort questions by order
        transformedQuestions.sort((a, b) => a.order - b.order);
        setQuestions(transformedQuestions);
      } catch (err) {
        console.error('Error loading survey:', err);
        setError('Failed to load survey');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSurvey();
  }, [surveyId]);

  const handleUpdate = async (updatedSurvey, updatedQuestions) => {
    try {
      
      setError(null);
      setIsLoading(true);
      
      const payload = {
        title: updatedSurvey.title,
        description: updatedSurvey.description,
        is_visible: updatedSurvey.is_visible ? true : false,
        mandatory: updatedSurvey.mandatory ? true : false,
        questions: updatedQuestions.map(q => {
          const questionData = {
            id: q.id, 
            type: q.type,
            question: q.question,
            is_required: q.is_required ? true : false,
            order: q.order,
          };
          
          // Only include choices for choice-based questions
          if (isChoiceBased(q.type)) {
            questionData.choices = q.choices;
          }
          
          return questionData;
        })
      };

      const response = await updateSurvey(surveyId, payload);
      
      if (onSuccess) onSuccess();
      return response.data;
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.errors?.title?.[0] || 
                         'Failed to update survey';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !surveyData) {
    return <div className="text-center py-10">Loading survey...</div>;
  }

  if (error && !surveyData) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <SurveyBuilder
      mode="edit"
      initialData={surveyData}
      initialQuestions={questions}
      onSubmit={handleUpdate}
      error={error}
      onSuccess={onSuccess}
    />
  );
};


export default EditSurvey;