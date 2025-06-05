
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { getFormById, submitForm, updateDraftForm } from '@/services/school-formAPI';
import { useForms } from '@/context/FormsContext';
import { Button } from '../ui/button';
import api, { getSupabaseSignedUrl } from '@/services/axios';
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

const StudentEditForm = ({ formId, onSuccess, draftId = null, initialData = {}, closeModal }) => {
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
        console.error('Failed to load form:', err);
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, [formId]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      for (const [key, value] of Object.entries(initialData)) {
        setValue(key, value);
      }
    }
  }, [initialData, setValue]);

  if (loading) return <div className="p-4 flex items-center justify-center">Loading form...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!form) return <div className="p-4 text-red-600">Form not found.</div>;

  const { content = '', fields = [], title, description } = form;

  const handleImageUpload = async (file) => {
    if (!file) return null;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG or PNG files are allowed.");
      return null;
    }

    if (file.size > maxSize) {
      toast.error("File size must not exceed 2MB.");
      return null;
    }

    const image = new Image();
    image.src = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
      image.onload = async () => {
        URL.revokeObjectURL(image.src);

        if (image.width !== 600 || image.height !== 600) {
          toast.error("Image must be exactly 600x600 pixels.");
          reject(new Error("Invalid image dimensions"));
          return;
        }

        try {
          const filename = `2x2/${Date.now()}-${file.name}`;
          const { signedURL, path } = await getSupabaseSignedUrl({
            filename,
            content_type: file.type,
          });

          await fetch(signedURL, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });

          const publicUrl = `${import.meta.env.VITE_SUPABASE}/storage/v1/object/public/${path}`;
          resolve(publicUrl);
        } catch (error) {
          console.error(error);
          toast.error("Image upload failed.");
          reject(error);
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(image.src);
        toast.error("Invalid image file.");
        reject(new Error("Invalid image file"));
      };
    });
  };

  const validateFormData = (data, fields, status) => {
    const errors = [];
    let hasValidData = false;

    for (const field of fields) {
      const fieldName = field.field_data.name;
      const value = data[fieldName];
      const isRequired = field.is_required && status !== 'draft';

      // Check if we have any valid data
      if (value && (
        (typeof value === 'string' && value.trim() !== '') ||
        (Array.isArray(value) && value.length > 0) ||
        (value instanceof File && value.size > 0)
      )) {
        hasValidData = true;
      }

      // Check required fields
      if (isRequired && (
        !value ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'string' && value.trim() === '')
      )) {
        errors.push(`Field "${fieldName}" is required.`);
      }
    }

    return { errors, hasValidData };
  };

  const onSubmit = async (data, status = "pending") => {
    if (loading) return;

    // Check React Hook Form validation errors
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    // Custom validation
    const validation = validateFormData(data, fields, status);

    if (validation.errors.length > 0) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    if (!validation.hasValidData && status !== 'draft') {
      toast.error("Please fill out at least one field before submitting.");
      return;
    }

    setLoading(true);
    try {
      const updatedFields = {};
      const imageUploadPromises = [];

      // Process all fields
      for (const field of fields) {
        const fieldId = field.id;
        const fieldName = field.field_data.name;
        const type = field.field_data.type;
        const value = data[fieldName];

        // Skip empty values
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          continue;
        }

        if (type === "2x2_image" && value instanceof File) {
          imageUploadPromises.push(
            (async () => {
              try {
                const imageUrl = await handleImageUpload(value);

                if (imageUrl) {
                  updatedFields[fieldId] = imageUrl;
                }

                return {
                  fieldId,
                  fieldName,
                  success: !!imageUrl,
                };
              } catch (error) {
                console.error(`Image upload failed for ${fieldName}:`, error);
                return {
                  fieldId,
                  fieldName,
                  success: false,
                  error,
                };
              }
            })()
          );
        }
        else {
          // Handle non-image fields
          updatedFields[fieldId] = value;
        }
      }

      // Wait for all image uploads to complete
      if (imageUploadPromises.length > 0) {
        const uploadResults = await Promise.all(imageUploadPromises);

        // Check if any image uploads failed
        const failedUploads = uploadResults.filter(result => !result.success);
        if (failedUploads.length > 0) {
          failedUploads.forEach(result => {
            toast.error(`Image upload failed for "${result.fieldName}".`);
          });
          return;
        }
      }

      const payload = {
        fields: updatedFields,
        status
      };

      console.log('Submitting payload:', payload);

      let response;
      if (draftId) {
        response = await updateDraftForm(draftId, payload);
      } else {
        response = await submitForm(formId, payload);
      }

      // Success handling
      await fetchSubmitted();

      const message = status === 'draft'
        ? 'Form saved as draft successfully!'
        : 'Form submitted successfully!';
      toast.success(message);

      if (onSuccess) {
        onSuccess(formId);
      }

    } catch (err) {
      console.error('Form submission error:', err);

      // More detailed error handling
      let errorMessage = 'Form submission failed. Please try again.';

      if (err.response) {
        if (err.response.status === 422 && err.response.data.errors) {
          // Validation errors
          const validationErrors = Object.values(err.response.data.errors).flat();
          validationErrors.forEach(error => toast.error(error));
          return;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
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
            {loading ? 'Saving...' : 'Save as Draft'}
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={handleSubmit((data) => onSubmit(data, "pending"))}
          >
            {loading ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentEditForm;