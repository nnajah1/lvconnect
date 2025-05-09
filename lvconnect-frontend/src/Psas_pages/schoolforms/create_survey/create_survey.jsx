import React, { useState } from "react";
import { RiArrowDropDownLine, RiDeleteBin6Line } from "react-icons/ri";
import {
  QUESTION_TYPES,
  isChoiceBased,
  createEmptyQuestion,
} from "../../../utils/surveyUtils";
import "@/Psas_pages/psas_styling/create_new_survey.css";

export default function CreateFormation() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleQuestionChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question: value } : q))
    );
  };

  const handleTypeChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              type: value,
              choices: isChoiceBased(value) ? [""] : [],
              files: value === "File upload" ? q.files : [],
            }
          : q
      )
    );
  };

  const handleChoiceChange = (qid, index, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              choices: q.choices.map((c, i) => (i === index ? value : c)),
            }
          : q
      )
    );
  };

  const addChoice = (qid) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, choices: [...q.choices, ""] } : q
      )
    );
  };

  const removeChoice = (qid, index) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? { ...q, choices: q.choices.filter((_, i) => i !== index) }
          : q
      )
    );
  };

  const toggleRequired = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, required: !q.required } : q))
    );
  };

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const handleFileUpload = (qid, files) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              files: [...q.files, ...Array.from(files)],
            }
          : q
      )
    );
  };

  const handleFileDelete = (qid, index) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              files: q.files.filter((_, i) => i !== index),
            }
          : q
      )
    );
  };

  return (
    <div className="create-form-container">
      <div className="form-title">
        <h2>Create New Survey</h2>
      </div>

      <hr className="divider" />

      <div className="flex flex-col space-y-1 mb-3">
        <input
          type="date"
          className="survey-input"
        />

        <input
          type="text"
          placeholder="Survey Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="survey-input survey-input-title"
        />

        <textarea
          placeholder="Survey Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="survey-textarea survey-description"
        />
      </div>

      {questions.map((q, index) => (
        <div key={q.id} className="question-card">
          <div className="question-header">
            <div className="flex-1">
              <textarea
                placeholder={`Question ${index + 1}`}
                value={q.question}
                onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                className="question-input"
              />
            </div>

            <select
              value={q.type}
              onChange={(e) => handleTypeChange(q.id, e.target.value)}
              className="select-type"
            >
              {QUESTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Choice-based options */}
          {isChoiceBased(q.type) && (
            <div className="choice-list">
              {q.choices.map((choice, index) => (
                <div key={index} className="choice-container">
                  <div className="choice-icon">
                    {q.type === "Multiple choice" && (
                      <input type="radio" disabled className="h-[18px] w-[18px]" />
                    )}
                    {q.type === "Checkboxes" && (
                      <input type="checkbox" disabled className="h-[18px] w-[18px]" />
                    )}
                    {q.type === "Dropdown" && (
                      <RiArrowDropDownLine size={20} className="text-gray-500" />
                    )}
                  </div>

                  <textarea
                    value={choice}
                    onChange={(e) =>
                      handleChoiceChange(q.id, index, e.target.value)
                    }
                    className="choice-textarea"
                    placeholder="Option"
                  />
                  <button
                    onClick={() => removeChoice(q.id, index)}
                    className="btn-remove-choice"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => addChoice(q.id)}
                className="add-choice-btn"
              >
                + Add option
              </button>
            </div>
          )}

          {q.type === "Short answer" && (
            <textarea
              rows={1}
              placeholder="Short answer text"
              className="survey-textarea"
              disabled
            />
          )}

          {q.type === "File upload" && (
            <div className="upload-box">
              <input
                type="file"
                onChange={(e) => handleFileUpload(q.id, e.target.files)}
                className="upload-input"
                multiple
              />
              <ul className="file-list">
                {q.files?.map((file, idx) => (
                  <li key={idx} className="file-item">
                    <span className="text-blue-600">{file.name}</span>
                    <button
                      onClick={() => handleFileDelete(q.id, idx)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="question-actions">
            <div className="required-toggle">
              <label className="text-sm text-gray-700">Required</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={() => toggleRequired(q.id)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="h-5 w-px bg-gray-300" />

            <button
              onClick={() => deleteQuestion(q.id)}
              className="text-red-500 hover:text-red-700"
            >
              <RiDeleteBin6Line size={18} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="btn-add-question"
      >
        + Add question
      </button>

      <div className="publish-actions">
        <button className="btn-publish">Publish</button>
        <button className="btn-cancel">Cancel</button>
      </div>
    </div>
  );
}
