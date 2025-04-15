import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import api from '@/services/axios';
const FormView = ({ formId }) => {
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch form details
    api.get(`/forms/${formId}`)
      .then(response => {
        setForm(response.data);
      })
      .catch(err => {
        setError('Form not found');
      });
  }, [formId]);

  const handleChange = (e, fieldId) => {
    const { value } = e.target;
    setAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const answersArray = Object.keys(answers).map(key => ({
        field_id: key,
        answer_data: answers[key],
        field_name: form.fields.find(field => field.id === parseInt(key)).label,
      }));
      await axios.post(`/api/forms/${formId}/submit`, { answers: answersArray });
      alert('Form submitted successfully');
    } catch (error) {
      alert('Error submitting form');
    }
  };

  if (error) return <p>{error}</p>;
  if (!form) return <p>Loading form...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{form.title}</h2>
      <p>{form.description}</p>

      {form.fields.map(field => (
        <div key={field.id}>
          <label>{field.label}</label>

          {field.type === 'text' && (
            <input
              type="text"
              value={answers[field.id] || ''}
              onChange={(e) => handleChange(e, field.id)}
            />
          )}

          {field.type === 'textarea' && (
            <textarea
              value={answers[field.id] || ''}
              onChange={(e) => handleChange(e, field.id)}
            />
          )}

          {field.type === 'checkbox' && (
            <input
              type="checkbox"
              checked={answers[field.id] || false}
              onChange={(e) => handleChange(e, field.id)}
            />
          )}

          {/* Handle other input types similarly */}
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
};

export default FormView;