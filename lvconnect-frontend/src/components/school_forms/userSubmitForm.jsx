
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { getFormById, submitForm, updateDraftForm } from '@/services/school-formAPI';
import { useForms } from '@/context/FormsContext';
import { Button } from '../ui/button';
import api from '@/services/axios';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroupItem } from '../ui/radio-group';
import { RadioGroup } from '@radix-ui/react-radio-group';

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

      const fieldType = field.field_data.type;
      const options = field.field_data.options || [];

      if (fieldType === 'single_checkbox') {
        return (
          <Controller
            key={index}
            name={fieldName}
            defaultValue={false}
            control={control}
            render={({ field }) => (
              <label className="inline-flex items-center space-x-2">
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                  className="h-4 w-4"
                />
              </label>
            )}
          />
        );
      }

      return (
        <div key={index} className="my-4">
          <Controller
            name={fieldName}
            defaultValue={fieldType === 'checkbox' ? [] : ''}
            control={control}
            render={({ field }) => {
              switch (fieldType) {
                case 'text':
                  return (
                    <Input
                      {...field}
                      type="text"
                      value={field.value ?? ""}
                      className="w-full"
                    />
                  );

                case 'textarea':
                  return (
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      className="w-full min-h-[100px]"
                    />
                  );

                case 'date':
                  return (
                    <Input
                      {...field}
                      type="date"
                      value={field.value ?? ""}
                      className="w-full"
                    />
                  );

                case 'checkbox':
                  const selectedValues = Array.isArray(field.value) ? field.value : [];

                  return (
                    <div className="space-y-2">
                      {options.map((opt, i) => {
                        const isChecked = selectedValues.includes(opt);

                        return (
                          <div key={i} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${field.name}-${i}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...selectedValues, opt]);
                                } else {
                                  field.onChange(selectedValues.filter(value => value !== opt));
                                }
                              }}
                            />
                            <Label
                              htmlFor={`${field.name}-${i}`}
                              className="cursor-pointer"
                            >
                              {opt}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  );

                case 'radio':
                  return (
                    <RadioGroup
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      className="space-y-2"
                    >
                      {options.map((opt, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt} id={`${field.name}-${i}`} />
                          <Label htmlFor={`${field.name}-${i}`} className="cursor-pointer">
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  );

                case 'select':
                  return (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent
                        className=" bg-white">
                        {options.map((opt, i) => (
                          <SelectItem key={i} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );

                case '2x2_image':
                  const currentFile = field.value;
                  const isExistingImage = typeof currentFile === 'string';

                  return (
                    <div className="space-y-3">
                      {isExistingImage && (
                        <div className="mb-2">
                          <p className="text-sm text-muted-foreground break-all">
                            Uploaded:{' '}
                            <a
                              href={currentFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline hover:text-primary/80 transition-colors"
                            >
                              {currentFile.split('/').pop()}
                            </a>
                          </p>
                        </div>
                      )}

                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor={`${field.name}-upload`}>Image</Label>
                        <Input
                          id={`${field.name}-upload`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              e.target.value = null; // reset input so same file can be re-selected
                            }
                          }}
                          className="cursor-pointer"
                        />
                      </div>

                      {!isExistingImage && field.value instanceof File && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(field.value) || "/placeholder.svg"}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-md border"
                          />
                        </div>
                      )}
                    </div>
                  );

                default:
                  return (
                    <div className="p-2 border border-destructive/50 bg-destructive/10 rounded-md">
                      <span className="text-destructive font-medium">Unsupported field type</span>
                    </div>
                  );
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
      <h2 className="text-2xl font-semibold text-center">{title}</h2>
      <p className="text-gray-600 text-center">{description}</p>

      <div className='ql-editor border-1 mt-2'>
        {generateFormFromContent(content, fields, control)}
      </div>

      <div className="flex gap-4 justify-end">
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