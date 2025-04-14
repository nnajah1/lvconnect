import React, { useEffect, useState } from 'react';
import { getForm, submitForm } from '@/services/school-formAPI';

const UserFormView = ({ formId }) => {
  const [form, setForm] = useState(null);
  const [fields, setFields] = useState([]);
  const [answers, setAnswers] = useState({});
  const [pdfUrl, setPdfUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getForm(formId);
        setForm(res.form);
        setFields(res.fields);
        setPdfUrl(res.form.has_pdf ? `/storage/${res.form.pdf_path}` : null);
      } catch (err) {
        console.error('Failed to load form:', err);
      }
    };
    fetchForm();
  }, [formId]);

  const handleChange = (fieldName, value) => {
    setAnswers({ ...answers, [fieldName]: value });
  };

  const handleSubmit = async () => {
    try {
      await submitForm(formId, {
        student_id: studentId,
        answers,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  if (!form) return <p>Loading form...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* PDF Viewer (left) */}
      {pdfUrl && (
        <div className="md:w-1/2 border shadow p-2">
          <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
        </div>
      )}

      {/* Form Fields (right) */}
      <div className={pdfUrl ? "md:w-1/2" : "w-full"}>
        <h2 className="text-xl font-bold mb-4">{form.title}</h2>

        {fields.map(field => (
          <div key={field.id} className="mb-4">
            <label className="block font-semibold mb-1">{field.field_data.label}</label>
            {renderFieldInput(field, answers[field.field_data.name], handleChange)}
          </div>
        ))}

        {!submitted ? (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            onClick={handleSubmit}
          >
            Submit
          </button>
        ) : (
          <p className="text-green-600 mt-4 font-semibold">Form submitted successfully!</p>
        )}
      </div>
    </div>
  );
};

export default UserFormView;

// Utility: Render Input Based on Type
const renderFieldInput = (field, value, handleChange) => {
  const { name, type, options } = field.field_data;

  switch (type) {
    case 'text':
      return (
        <input
          type="text"
          className="border p-2 w-full"
          value={value || ''}
          onChange={(e) => handleChange(name, e.target.value)}
        />
      );
    case 'textarea':
      return (
        <textarea
          className="border p-2 w-full"
          value={value || ''}
          onChange={(e) => handleChange(name, e.target.value)}
        />
      );
    case 'date':
      return (
        <input
          type="date"
          className="border p-2 w-full"
          value={value || ''}
          onChange={(e) => handleChange(name, e.target.value)}
        />
      );
    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => handleChange(name, e.target.checked)}
        />
      );
    case 'radio':
      return (
        <div>
          {(options || []).map((option, idx) => (
            <label key={idx} className="block">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={(e) => handleChange(name, e.target.value)}
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
      );
    case 'select':
      return (
        <select
          className="border p-2 w-full"
          value={value || ''}
          onChange={(e) => handleChange(name, e.target.value)}
        >
          <option value="">-- Select --</option>
          {(options || []).map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </select>
      );
    default:
      return null;
  }
};
