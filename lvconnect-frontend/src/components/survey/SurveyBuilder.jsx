import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { RiDeleteBin6Line, RiArrowDropDownLine } from 'react-icons/ri';
import { createSurvey, deleteSurvey } from '@/services/surveyAPI';
import {
    QUESTION_TYPES,
    isChoiceBased,
    emptyQuestion
} from '@/utils/surveyUtils';
import "@/styles/components/create_new_survey.css";
import SwitchComponent from '../dynamic/switch';
import WebcamCapture from './captureCamera';
import { DeleteModal, ErrorModal } from '../dynamic/alertModal';
import { toast } from 'react-toastify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SurveyBuilder = forwardRef(({
    mode = 'create',
    initialData = {},
    initialQuestions = [],
    onSubmit,
    onSuccess,
    onDelete,
    closeModal,
    loadSurveys,
    visibilityMode,
    setVisibilityMode
}, ref) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([emptyQuestion()]);
    const [isLoading, setIsLoading] = useState(false);

    const [isAlertModal, setIsAlertModal] = useState(false);
    const openAlertModal = () => setIsAlertModal(true);
    const closeAlertModal = () => setIsAlertModal(false);

    // Fix: Properly initialize the form when in edit mode
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setVisibilityMode(initialData.visibility_mode);

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

        // Basic validation
        if (!title.trim()) {
            toast.error('Survey title is required');
            setIsLoading(false);
            return;
        }

        for (const q of questions) {
            if (!q.question.trim()) {
                toast.error('All questions must have text');
                setIsLoading(false);
                return;
            }
            if (isChoiceBased(q.type) && q.choices.some(c => !c.trim())) {
                toast.error('All choice options must have text');
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
                        visibility_mode: visibilityMode,
                    },
                    questions.map((q, index) => ({
                        ...q,
                        order: index + 1
                    }))
                );
            } else {
                // Create mode handling remains the same...
                const formData = new FormData();
                formData.append('title', title);
                formData.append('description', description || '');
                formData.append('visibility_mode', visibilityMode);

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
                toast.success(mode === 'edit' ? 'Survey edited successfully.' : 'Survey created successfully.');
                closeModal();
                // if (onSuccess) onSuccess(res.survey_id);
                await loadSurveys();
            }
        } catch (err) {
            toast.error(mode === 'edit' ? 'Failed to update survey.' : 'Failed to create survey.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    const handleDeleteSurvey = async () => {
        if (!initialData.id) return;
        try {
            await deleteSurvey(initialData.id);
            toast.success('Survey deleted succesfully.');
            // if (onDelete) onDelete(initialData.id);
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete survey.');
        }
        closeAlertModal();
    };
    return (
        <div className="flex flex-col max-w-4xl mx-auto">
            {/* Header with title and dropdown */}
            {/* <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-2xl font-bold text-[#2CA4DD]">
          {mode === 'edit' ? 'Edit Survey' : 'Create New Survey'}
        </h2>
        <p className="text-sm text-gray-600">Create and publish new survey questionnaires for students to answer.</p>
      </div>
      
    
    </div>

    <hr className="divider mb-5" /> */}

            {/* Title and Description fields */}
            <div className="flex flex-col space-y-4 mb-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Title </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="font-medium border border-[#2CA4DD] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2CA4DD] h-10 px-3 w-full"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="survey-textarea survey-description p-3 border border-gray-200 bg-white rounded-lg  w-full"
                    />
                </div>
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
                                    className="text-sm w-full px-2 border-b focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <select
                                value={q.type}
                                onChange={(e) => handleTypeChange(q.id, e.target.value)}
                                className="w-36 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm m-auto"
                            >
                                {QUESTION_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>




                        {isChoiceBased(q.type) && (
                            <div className="space-y-1 pl-2">
                                {q.choices.map((choice, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 flex items-center justify-center h-6  m-auto">
                                            {q.type === "Multiple choice" && (
                                                <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                                            )}
                                            {q.type === "Checkboxes" && <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>}
                                            {q.type === "Dropdown" && <RiArrowDropDownLine size={20} className="text-gray-400" />}
                                        </div>
                                        <input
                                            type="text"
                                            value={choice}
                                            onChange={(e) => handleChoiceChange(q.id, i, e.target.value)}
                                            className="flex-1 text-gray-600 bg-transparent border-none outline-none placeholder-gray-400 h-6 leading-6 m-auto"
                                            placeholder="Option"
                                        />
                                        {q.choices.length > 1 && (
                                            <button
                                                onClick={() => removeChoice(q.id, i)}
                                                className="flex-shrink-0 text-red hover:text-red-500 p-1"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 flex items-center justify-center h-6">
                                        {q.type === "Multiple choice" && (
                                            <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                                        )}
                                        {q.type === "Checkboxes" && <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>}
                                        {q.type === "Dropdown" && <RiArrowDropDownLine size={20} className="text-gray-400" />}
                                    </div>
                                    <button onClick={() => addChoice(q.id)} className="text-blue-900 hover:text-blue-800 font-medium h-6 leading-6 text-sm">
                                        Add option
                                    </button>
                                </div>
                            </div>
                        )}

                        {q.type === "Short answer" && (
                            <div className="pl-2">
                                <input
                                    type="text"
                                    placeholder="Short answer text"
                                    className="w-full text-gray-600 bg-transparent border-none border-b border-gray-300 outline-none pb-2 placeholder-gray-400"
                                    disabled
                                />
                            </div>
                        )}

                        {q.type === "Upload Photo" && <WebcamCapture />}




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
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                disabled={questions.length <= 1}
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addQuestion}
                className="p-4 w-fit py-2 bg-blue-900 hover:bg-blue-900 rounded text-white flex gap-2"
            >
                + Add question
            </button>

            {/* <div className="publish-actions flex justify-end gap-4">
                {mode === 'edit' ? (
                    <div>
                        <button
                            onClick={openAlertModal}
                            className="text-red-600 border border-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
                        >
                            Delete
                        </button>
                        <DeleteModal
                            isOpen={isAlertModal}
                            closeModal={closeAlertModal}
                        >
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
                                onClick={closeAlertModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleDeleteSurvey}
                            >
                                Delete
                            </button>
                        </DeleteModal>
                    </div>
                ) :
                    (
                        <button
                            onClick={closeModal}
                            className="btn-cancel px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    )
                }

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn-publish px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
                >
                    {mode === 'edit' ? 'Update Survey' : 'Publish Survey'}
                </button>
            </div> */}
        </div>
    );
})
export default SurveyBuilder;
