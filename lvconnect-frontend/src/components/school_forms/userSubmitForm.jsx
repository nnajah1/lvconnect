
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { getFormById, submitForm } from '@/services/school-formAPI';


const generateFormFromContent = (content, fields, control) => {
  const fieldMap = {};
  fields.forEach((field) => {
    // Create the map using the `name` as the key
    fieldMap[field.field_data.name] = field;
  });

  const parts = content.split(/({{[^}]+}})/g);

  return parts.map((part, index) => {
    const match = part.match(/{{([^}]+)}}/);
    if (match) {
      const fieldName = match[1].trim();  // This should match field.name
      const field = fieldMap[fieldName];

      if (!field) {
        return <span key={index} className="text-red-500">[Unknown field: {fieldName}]</span>;
      }

      const label = field.field_data.label;
      const fieldType = field.field_data.type;
      const options = field.field_data.options || [];

      return (
        <div key={index} className="my-4">
          {/* <label className="block font-medium mb-1">{label}</label> */}
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => {
              switch (fieldType) {
                case 'text':
                  return <input {...field} type="text" className="border p-2 w-full rounded" />;
                case 'textarea':
                  return <textarea {...field} className="border p-2 w-full rounded" />;
                case 'date':
                  return <input {...field} type="date" className="border p-2 w-full rounded" />;
                case 'checkbox':
                  return (
                    <input
                      {...field}
                      type="checkbox"
                      className="mr-2"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  );
                case 'radio':
                  return (
                    <div className="space-y-1">
                      {options.map((opt, i) => (
                        <label key={i} className="block">
                          <input
                            type="radio"
                            value={opt}
                            checked={field.value === opt}
                            onChange={() => field.onChange(opt)}
                            className="mr-2"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  );
                case 'select':
                  return (
                    <select {...field} className="border p-2 w-full rounded">
                      <option value="">Select an option</option>
                      {options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  );
                case '2x2_image':
                  return (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files[0])}
                      className="border p-2 w-full rounded"
                    />
                  );
                default:
                  return <span className="text-red-500">Unsupported field type</span>;
              }
            }}
          />
        </div>
      );
    }
    
    return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
  });
};

const StudentView = ({ formId, onSuccess }) => {
  const { control, handleSubmit } = useForm();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const response = await getFormById(formId);
        setForm({
          ...response.data.form,
          fields: response.data.fields,
        });
        
      } catch (err) {
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, [formId]);

  if (loading) return <div className="p-4">Loading form...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!form) return <div className="p-4 text-red-600">Form not found.</div>;

  const { content = '', fields = [], title, description } = form;

  const onSubmit = async (data) => {
    try {
      const payload = {
        fields: {}, 
      };
  
      fields.forEach((field) => {
        const fieldId = field.id;
        const fieldName = field.field_data.name;
        payload.fields[fieldId] = data[fieldName];
      });
      
      const response = await submitForm(formId, payload);


      if (response.status === 201) {
        alert('Form submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>

      {generateFormFromContent(content, fields, control)}

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default StudentView;