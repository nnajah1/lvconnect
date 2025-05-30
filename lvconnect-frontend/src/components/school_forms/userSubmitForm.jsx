
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
import { toast } from 'react-toastify';

const generateFormFromContent = (content, fields, control) => {
  const fieldMap = {};
  fields.forEach((field) => {
    // Create the map using the `name` as the key
    fieldMap[field.field_data.name] = field;
  });

  const parts = content.split(/({{[^}]+}})/g);
  function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
  return parts.map((part, index) => {
    const match = part.match(/{{([^}]+)}}/);
    if (match) {
      const rawFieldName = match[1].trim();
      const fieldName = decodeHtml(rawFieldName);   // This should match field.name
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
            rules={{ required: field.is_required ? `${fieldName} is required` : false }}
            render={({ field: controllerField, fieldState }) => (
              <div>
                <label className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={controllerField.value || false}
                    onCheckedChange={controllerField.onChange}
                    className="h-4 w-4"
                  />
                </label>
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}
              </div>
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
            rules={{
              required: field.is_required ? `${fieldName} is required` : false,
              validate: fieldType === '2x2_image' ? (value) => {
                if (field.is_required && !value) {
                  return `${fieldName} is required`;
                }
                return true;
              } : undefined
            }}
            render={({ field: controllerField, fieldState }) => {
              switch (fieldType) {
                case 'text':
                  return (
                    <div>
                      <Input
                        {...controllerField}
                        type="text"
                        value={controllerField.value ?? ""}
                        className="w-full"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  );

                case 'textarea':
                  return (
                    <div>
                      <Textarea
                        {...controllerField}
                        value={controllerField.value ?? ""}
                        className="w-full min-h-[100px]"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  );

                case 'date':
                  return (
                    <div>
                      <Input
                        {...controllerField}
                        type="date"
                        value={controllerField.value ?? ""}
                        className="w-full"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  );

                case 'checkbox':
                  const selectedValues = Array.isArray(controllerField.value) ? controllerField.value : [];

                  return (
                    <div>
                      <div className="space-y-2">
                        {options.map((opt, i) => {
                          const isChecked = selectedValues.includes(opt);

                          return (
                            <div key={i} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${controllerField.name}-${i}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    controllerField.onChange([...selectedValues, opt]);
                                  } else {
                                    controllerField.onChange(selectedValues.filter(value => value !== opt));
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`${controllerField.name}-${i}`}
                                className="cursor-pointer"
                              >
                                {opt}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  );

                case 'radio':
                  return (
                    <div>
                      <RadioGroup
                        value={controllerField.value || ""}
                        onValueChange={controllerField.onChange}
                        className="space-y-2"
                      >
                        {options.map((opt, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`${controllerField.name}-${i}`} />
                            <Label htmlFor={`${controllerField.name}-${i}`} className="cursor-pointer">
                              {opt}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  );

                case 'select':
                  return (
                    <div>
                      <Select
                        value={controllerField.value ?? ""}
                        onValueChange={controllerField.onChange}
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
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  );

                case '2x2_image':
                  const currentFile = controllerField.value;
                  const isExistingImage = typeof currentFile === 'string';

                  return (
                    <div>
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
                          <Label htmlFor={`${controllerField.name}-upload`}>Image</Label>
                          <Input
                            id={`${controllerField.name}-upload`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                controllerField.onChange(file);
                                e.target.value = null; // reset input so same file can be re-selected
                              }
                            }}
                            className="cursor-pointer"
                          />
                        </div>

                        {!isExistingImage && controllerField.value instanceof File && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(controllerField.value) || "/placeholder.svg"}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-md border"
                            />
                          </div>
                        )}
                      </div>
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
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
  const { control, handleSubmit, getValues, setValue, formState: { errors } } = useForm();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchSubmitted } = useForms();

  useEffect(() => {
    const loadForm = async () => {
      setLoading(true);
      try {
        const response = await getFormById(formId);
        setForm({
          ...response.data.form,
          fields: response.data.fields,
        });

      } catch (err) {
        console.log('Failed to load form');
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
  // if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!form) return <div className="p-4 text-red-600">Form not found.</div>;

  const { content = '', fields = [], title, description } = form;

  const handleImageUpload = async (file) => {
    if (!file) return null; // Ensure function returns something

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG or PNG files are allowed.");
      return null;
    }

    // Check file size
    if (file.size > maxSize) {
      toast.error("File size must not exceed 2MB.");
      return null;
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = async () => {
        if (image.width !== 600 || image.height !== 600) {
          toast.error("Image must be exactly 600x600 pixels.");
          reject(null);
          return;
        }

        try {
          const formData = new FormData();
          formData.append("photo", file);

          const res = await api.post("/upload-2x2-image", formData);
          resolve(res.data.image_url);
        } catch (error) {
          toast.error("Image upload failed.");
          reject(null);
        }
      };

      image.onerror = () => {
        toast.error("Invalid image file.");
        reject(null);
      };
    });
  };

  const onSubmit = async (data, status = "pending") => {
    if (loading) return; // Prevent multiple submissions

    // Check if form has validation errors
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    // Improved empty form check
    const hasValidData = fields.some(field => {
      const fieldName = field.field_data.name;
      const value = data[fieldName];

      if (!value) return false;

      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      if (value instanceof File) return value.size > 0;

      return true;
    });

    if (!hasValidData) {
      toast.error("Please fill out at least one field before submitting.");
      return;
    }

    setLoading(true);
    try {
      let hasError = false;
      const updatedFields = {};

      for (const field of fields) {
        const fieldId = field.id;
        const fieldName = field.field_data.name;
        const type = field.field_data.type;
        const value = data[fieldName];

        // Check required fields for all types
        if (field.is_required && (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === ''))) {
          toast.error(`Field "${fieldName}" is required.`);
          hasError = true;
          continue;
        }

        if (type === "2x2_image") {
          if (value instanceof File) {
            try {
              const imagePath = await handleImageUpload(value);
              if (!imagePath) {
                hasError = true;
                toast.error(`Invalid image: "${fieldName}". Please fix before submitting.`);
              } else {
                updatedFields[fieldId] = imagePath;
              }
            } catch {
              hasError = true;
              toast.error(`Image upload failed for "${fieldName}".`);
            }
          } else if (typeof value === "string" && value.trim() !== "") {
            updatedFields[fieldId] = value;
          }
        } else {
          if (value) {
            updatedFields[fieldId] = value;
          }
        }
      }

      if (hasError) {
        console.error("Cannot save due to validation errors.");
        setLoading(false);
        return;
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
      toast.error("Form submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 space-y-6 bg-white rounded shadow">
      <form onSubmit={handleSubmit((data) => onSubmit(data, 'pending'))}>
        <h2 className="text-2xl font-semibold text-center">{title}</h2>
        <p className="text-gray-600 text-center">{description}</p>

        <div className='ql-editor border-1 mt-2'>
          {generateFormFromContent(content, fields, control)}
        </div>
        <div className="flex mt-4 gap-4 justify-end">
          <Button
            className="bg-gray-500"
            type="button"
            disabled={loading}
            onClick={handleSubmit((data) => onSubmit(data, "draft"))}
          >
            Save as Draft
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={handleSubmit((data) => onSubmit(data, "pending"))}
          >
            Submit for Review
          </Button>

        </div>
      </form>

    </div>

  );
};

export default StudentEditForm;