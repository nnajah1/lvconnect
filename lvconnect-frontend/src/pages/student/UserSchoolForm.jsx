import React, { useState, useEffect } from 'react';
import api from '@/services/axios';

const VisibleForms = () => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch visible forms from the backend
    api.get('forms/visible')
      .then(response => {
        setForms(response.data);
      })
      .catch(err => {
        setError('Error fetching forms');
      });
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Visible Forms</h2>
      <ul>
        {forms.length === 0 ? (
          <li>No visible forms available.</li>
        ) : (
          forms.map(form => (
            <li key={form.id}>
              <h3>{form.title}</h3>
              <p>{form.description}</p>
              <a href={`/form/${form.id}`}>View Form</a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default VisibleForms;
