import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Line, RiArrowDropDownLine } from 'react-icons/ri';
import { createSurvey } from '@/services/surveyAPI';
import {
    QUESTION_TYPES,
    isChoiceBased,
    emptyQuestion
} from '@/utils/surveyUtils';
import "@/styles/components/create_new_survey.css";
import SwitchComponent from '../dynamic/switch';
import WebcamCapture from './captureCamera';

export default function SurveyBuilder({
    mode = 'create',
    initialData = {},
    initialQuestions = [],
    onSubmit,
    onSuccess,
    error,
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isMandatory, setIsMandatory] = useState(false);
    const [questions, setQuestions] = useState([emptyQuestion()]);
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState(null);

    // Fix: Properly initialize the form when in edit mode
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setIsVisible(initialData.is_visible === true || initialData.is_visible === 1);
            setIsMandatory(initialData.mandatory === true || initialData.mandatory === 1);

            if (initialQuestions && initialQuestions.length > 0) {
                const initializedQuestions = initialQuestions.map(q => ({
                    id: q.id || crypto.randomUUID(),
                    question: q.question || "",
                    type: q.type || QUESTION_TYPES[0],
                    choices: q.choices && q.choices.length ? q.choices :
                        (isChoiceBased(q.type) ? [""] : []),
                    is_required: q.is_required === true || q.is_required === 1,
                    // files: q.files || [],
                    order: q.order || 0
                }));
                setQuestions(initializedQuestions);
            } else {
                setQuestions([emptyQuestion()]);
            }
        }
    }, [mode, initialData, initialQuestions]);

    const handleQuestionChange = (id, value) => {
        setQuestions(prev =>
            prev.map(q => (q.id === id ? { ...q, question: value } : q))
        );
    };

    const handleTypeChange = (id, value) => {
        setQuestions(prev =>
            prev.map(q =>
                q.id === id
                    ? {
                        ...q,
                        type: value,
                        choices: isChoiceBased(value) ? (q.choices?.length ? q.choices : ['']) : [],
                        // files: value === 'File upload' ? q.files : [],
                    }
                    : q
            )
        );
    };

    const handleChoiceChange = (qid, index, value) => {
        setQuestions(prev =>
            prev.map(q =>
                q.id === qid
                    ? {
                        ...q,
                        choices: q.choices.map((c, i) => (i === index ? value : c)),
                    }
                    : q
            )
        );
    };

    const addChoice = qid => {
        setQuestions(prev =>
            prev.map(q =>
                q.id === qid ? { ...q, choices: [...q.choices, ''] } : q
            )
        );
    };

    const removeChoice = (qid, index) => {
        setQuestions(prev =>
            prev.map(q =>
                q.id === qid
                    ? { ...q, choices: q.choices.filter((_, i) => i !== index) }
                    : q
            )
        );
    };

    const deleteQuestion = id => {
        if (questions.length > 1) {
            setQuestions(prev => prev.filter(q => q.id !== id));
        }
    };

    const addQuestion = () => {
        setQuestions(prev => [...prev, emptyQuestion()]);
    };


    const handleSubmit = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setLocalError(null);

        // Basic validation
        if (!title.trim()) {
            setLocalError('Survey title is required');
            setIsLoading(false);
            return;
        }

        for (const q of questions) {
            if (!q.question.trim()) {
                setLocalError('All questions must have text');
                setIsLoading(false);
                return;
            }
            if (isChoiceBased(q.type) && q.choices.some(c => !c.trim())) {
                setLocalError('All choice options must have text');
                setIsLoading(false);
                return;
            }
        }

        try {
            if (mode === 'edit') {
                await onSubmit(
                    {
                        title,
                        description,
                        is_visible: isVisible,
                        mandatory: isMandatory,
                    },
                    questions.map((q, index) => ({
                        ...q,
                        order: index + 1
                    }))
                );
                if (onSuccess) onSuccess();
            } else {
                // Create mode handling remains the same...
                const formData = new FormData();
                formData.append('title', title);
                formData.append('description', description || '');
                formData.append('is_visible', isVisible ? '1' : '0');
                formData.append('mandatory', isMandatory ? '1' : '0');

                questions.forEach((q, index) => {
                    formData.append(`questions[${index}][type]`, q.type);
                    formData.append(`questions[${index}][question]`, q.question);
                    formData.append(`questions[${index}][is_required]`, q.is_required ? '1' : '0');
                    formData.append(`questions[${index}][order]`, String(index + 1));

                    if (isChoiceBased(q.type)) {
                        q.choices.forEach((choice, cIdx) => {
                            formData.append(`questions[${index}][choices][${cIdx}]`, choice);
                        });
                    }

                });

                const res = await createSurvey(formData);
                if (onSuccess) onSuccess(res.survey_id);
            }
        } catch (err) {
            setLocalError(mode === 'edit' ? 'Failed to update survey.' : 'Failed to create survey.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col p-4 max-w-4xl mx-auto">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {localError && <div className="text-red-500 mb-4">{localError}</div>}

            <div className="flex items-end justify-end space-x-4 mb-4">
                <SwitchComponent
                    label="Visible to Users"
                    checked={isVisible}
                    onCheckedChange={(checked) => setIsVisible(checked)}
                />
                <SwitchComponent
                    label="Mandatory Survey"
                    checked={isMandatory}
                    onCheckedChange={(checked) => setIsMandatory(checked)}
                />
            </div>

            <div className="form-title mb-4">
                <h2 className="text-2xl font-bold">
                    {mode === 'edit' ? 'Edit Survey' : 'Create Survey'}
                </h2>
            </div>

            <hr className="divider mb-6" />

            <div className="flex flex-col space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Survey Title *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="survey-input survey-input-title p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                    placeholder="Survey Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="survey-textarea survey-description p-3 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="space-y-6 mb-6">
                {questions.map((q, index) => (
                    <div key={q.id} className="question-card p-4 border rounded-lg shadow-sm">
                        <div className="question-header flex items-start gap-4 mb-4">
                            <div className="flex-1">
                                <textarea
                                    placeholder={`Question ${index + 1} *`}
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                                    className="question-input w-full p-2 border-b focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <select
                                value={q.type}
                                onChange={(e) => handleTypeChange(q.id, e.target.value)}
                                className="select-type p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {QUESTION_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isChoiceBased(q.type) && (
                            <div className="choice-list space-y-2 mb-4">
                                {q.choices.map((choice, i) => (
                                    <div key={i} className="choice-container flex items-center gap-2">
                                        <div className="choice-icon flex items-center justify-center w-6">
                                            {q.type === 'Multiple choice' && (
                                                <input type="radio" disabled className="mr-2" />
                                            )}
                                            {q.type === 'Checkboxes' && (
                                                <input type="checkbox" disabled className="mr-2" />
                                            )}
                                            {q.type === 'Dropdown' && (
                                                <RiArrowDropDownLine size={20} />
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={choice}
                                            onChange={(e) => handleChoiceChange(q.id, i, e.target.value)}
                                            className="choice-textarea flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Option"
                                        />
                                        {q.choices.length > 1 && (
                                            <button
                                                onClick={() => removeChoice(q.id, i)}
                                                className="btn-remove-choice text-red-500 hover:text-red-700 p-1"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={() => addChoice(q.id)}
                                    className="add-choice-btn text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 mt-2"
                                >
                                    + Add option
                                </button>
                            </div>
                        )}

                        {q.type === 'Short answer' && (
                            <input
                                type="text"
                                placeholder="Short answer text"
                                className="survey-textarea w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4"
                                disabled
                            />
                        )}

                        {q.type === 'Upload Photo' && (
                            <div className="upload-box mb-4">
                                <div className="camera-capture mb-4">
                                    <WebcamCapture />
                                </div>
                            </div>
                        )}

                        <div className="question-actions flex items-center gap-4 pt-2 border-t">
                            <SwitchComponent
                                label="Required"
                                checked={q.is_required}
                                onCheckedChange={(checked) => {
                                    setQuestions(prev =>
                                        prev.map((question) =>
                                            question.id === q.id
                                                ? { ...question, is_required: checked }
                                                : question
                                        )
                                    );
                                }}
                            />
                            <div className="h-5 w-px bg-gray-300" />
                            <button
                                onClick={() => deleteQuestion(q.id)}
                                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                disabled={questions.length <= 1}
                            >
                                <RiDeleteBin6Line size={18} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addQuestion}
                className="btn-add-question w-full py-2 mb-6 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2"
            >
                + Add question
            </button>

            <div className="publish-actions flex justify-end gap-4">
                <button
                    onClick={() => window.history.back()}
                    className="btn-cancel px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn-publish px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
                >
                    {mode === 'edit' ? 'Update Survey' : 'Publish Survey'}
                </button>
            </div>
        </div>
    );
}