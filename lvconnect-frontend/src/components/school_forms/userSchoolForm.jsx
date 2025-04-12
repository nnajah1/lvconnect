import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import axios from 'axios';

const UserForm = ({ formId }) => {
  const [formFields, setFormFields] = useState([]);
  const { control, handleSubmit, register, setValue } = useForm();

  // Fetch the form fields from the server
  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const response = await axios.get(`/api/forms/${formId}/fields`);
        setFormFields(response.data.fields); // Assuming the response contains the fields
      } catch (error) {
        console.error('Error fetching form fields:', error);
      }
    };

    fetchFormFields();
  }, [formId]);

  // Submit the filled form
  const onSubmit = (data) => {
    console.log('Form Data:', data);
    // Send data to the server for saving/submission
    axios.post('/api/submit-form', { formId, data })
      .then((response) => {
        alert('Form submitted successfully');
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        alert('Error submitting form');
      });
  };

  return (
    <div className="user-form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Fill the Form</h2>
        {formFields.length > 0 ? (
          formFields.map((field, index) => (
            <div key={index} className="form-field">
              <label>{field.label}</label>

              {/* Render different input types based on the field type */}
              {field.type === 'text' && (
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue=""
                  render={({ field }) => <input {...field} className="form-input" />}
                />
              )}

              {field.type === 'textarea' && (
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue=""
                  render={({ field }) => <textarea {...field} className="form-input" />}
                />
              )}

              {field.type === 'checkbox' && (
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <input type="checkbox" {...field} className="form-checkbox" />
                  )}
                />
              )}

              {field.type === 'select' && (
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <select {...field} className="form-input">
                      {field.options?.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}

              {/* Add other field types as necessary (radio, date, etc.) */}
            </div>
          ))
        ) : (
          <p>Loading form...</p>
        )}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;
