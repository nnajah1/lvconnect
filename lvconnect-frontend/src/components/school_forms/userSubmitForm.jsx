
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { getFormById, submitForm, updateDraftForm } from '@/services/school-formAPI';
import SwitchComponent from '../school_updates/modals/switch';
import { useForms } from '@/context/FormsContext';
import { Button } from '../ui/button';
import api from '@/services/axios';


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
            defaultValue={fieldType === 'checkbox' ? false : ''}
            control={control}
            render={({ field }) => {
              switch (fieldType) {
                case 'text':
                  return <input {...field} type="text" value={field.value ?? ""} className="border p-2 w-full rounded" />;
                case 'textarea':
                  return <textarea {...field} value={field.value ?? ""} className="border p-2 w-full rounded" />;
                case 'date':
                  return <input {...field} type="date" value={field.value ?? ""} className="border p-2 w-full rounded" />;
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
                            {...field}
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
                    <select {...field} value={field.value ?? ""} className="border p-2 w-full rounded">
                      <option value="">Select an option</option>
                      {options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  );
                case '2x2_image':
                  const currentFile = field.value;
                  const isExistingImage = typeof currentFile === 'string';

                  return (
                    <div className="space-y-2">
                      {isExistingImage && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600 break-all">
                            Uploaded:{' '}
                            <a
                              href={currentFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              {currentFile.split('/').pop()}
                            </a>
                          </p>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            field.onChange(file);
                            e.target.value = null; // reset input so same file can be re-selected
                          }
                        }}
                        className="border p-2 w-full rounded"
                      />

                      {!isExistingImage && field.value instanceof File && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(field.value)}
                            alt="Preview"
                            className="w-32 h-32 object-cover border rounded"
                          />
                        </div>
                      )}
                    </div>
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

const StudentEditForm = ({ formId, onSuccess, draftId = null, initialData = {}, }) => {
  const { control, handleSubmit, getValues, setValue } = useForm();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchSubmitted } = useForms();

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

  useEffect(() => {
    if (initialData) {
      for (const [key, value] of Object.entries(initialData)) {
        setValue(key, value);
      }
    }
  }, [initialData, setValue]);

  if (loading) return <div className="p-4">Loading form...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!form) return <div className="p-4 text-red-600">Form not found.</div>;

  const { content = '', fields = [], title, description } = form;

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    const res = await api.post('/upload-2x2-image', formData);
    return res.data.image_url;
  };
  const onSubmit = async (data, status = 'pending') => {
    setLoading(true);
    try {
      const updatedFields = {};

      for (const field of fields) {
        const fieldId = field.id;
        const fieldName = field.field_data.name;
        const type = field.field_data.type;

        if (type === '2x2_image') {
          const file = data[fieldName];
          if (file instanceof File) {
            const imagePath = await handleImageUpload(file);
            updatedFields[fieldId] = imagePath;
          } else if (typeof file === 'string') {
            updatedFields[fieldId] = file;
          }
        } else {
          updatedFields[fieldId] = data[fieldName];
        }
      }

      const payload = { fields: updatedFields, status };
      if (draftId) {
        await updateDraftForm(draftId, payload);
      } else {
        await submitForm(formId, payload);
      }

      await fetchSubmitted();
      if (onSuccess) onSuccess(formId);
    } catch (err) {
      console.error(err);
      alert('Form submission failed.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, 'pending'))} className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>

      {generateFormFromContent(content, fields, control)}

      <div className="flex gap-4">
        <Button className=' bg-amber-500' type="button" onClick={() => onSubmit(getValues(), 'draft')}>
          Save as Draft
        </Button>
        <Button type="submit">
          Submit for Review
        </Button>
      </div>
    </form>
  );
};

export default StudentEditForm;