import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import * as pdfjsLib from 'pdfjs-dist';
import SwitchComponent from "@/components/school_updates/modals/switch";
import { createForm, saveFormFields } from '@/services/school-formAPI';
import { extractFieldsFromText } from '@/utils/pdfUtils';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

const FormBuilder = ({ mode = 'create', initialData, initialFields, onSubmit, error, onSuccess }) => {


  const [pdfFile, setPdfFile] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [instructions, setInstructions] = useState('');
  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      is_visible: false
    }
  });
  const [formFields, setFormFields] = useState(initialFields || []);
  const [deletedFields, setDeletedFields] = useState([]);
  const [deletedFieldIds, setDeletedFieldIds] = useState([]);

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const canvasRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState();

  useEffect(() => {

    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ font: [] }, { size: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean']
          ]
        },
        formats: [
          'font', 'size', 'bold', 'italic', 'underline', 'strike',
          'color', 'background', 'list', 'align', 'link', 'image'
        ]
      });

      quillRef.current.on('text-change', () => {
        setInstructions(quillRef.current.root.innerHTML);
      });
    }

    if (initialData?.content && quillRef.current) {
      quillRef.current.root.innerHTML = initialData.content;
      setInstructions(initialData.content);
    }

    if (initialData) {
      setValue('title', initialData.title || '');
      setValue('description', initialData.description || '');
      setValue('is_visible', initialData.is_visible ?? false);
    }

    if (initialFields?.length) {
      const normalizedFields = initialFields.map(field => ({
        ...field,
        ...field.field_data, // flatten field_data into the root
      }));
      setFormFields(normalizedFields);
    }

  }, [initialData, initialFields]);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      setLocalError('Only PDF files are allowed');
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const typedarray = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
      const page = await pdf.getPage(1);

      const textContent = await page.getTextContent();
      const rawText = textContent.items.map(item => item.str).join('\n');
      setOcrText(rawText);

      const { modifiedText, fields } = extractFieldsFromText(rawText);

      // Insert into Quill
      const quill = quillRef.current;
      quill.setText(modifiedText);

      setInstructions(modifiedText);
      setFormFields(fields);

      renderPdfPage(1, pdf);
    };
    reader.readAsArrayBuffer(file);
  };

  const renderPdfPage = (pageNumber, pdf) => {
    pdf.getPage(pageNumber).then((page) => {
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({
        canvasContext: context,
        viewport: viewport
      });
    });
  };

  const addField = () => {
    const newField = {
      id: Date.now(),
      name: `field_${formFields.length + 1}`,
      label: `Field ${formFields.length + 1}`,
      type: 'text',
      required: false,
    };
    setFormFields([...formFields, newField]);
    insertFieldToEditor(newField);
  };

  const insertFieldToEditor = (field) => {
    const quill = quillRef.current;
    const editorContent = quill.getText();
    const placeholder = `{{${field.label}}}`;

    const existing = formFields
      .filter(f => f.id === field.id && f.label !== field.label)
      .map(f => `{{${f.label}}}`);

    existing.forEach(old => {
      const startIndex = editorContent.indexOf(old);
      if (startIndex !== -1) {
        quill.deleteText(startIndex, old.length);
      }
    });

    if (editorContent.includes(placeholder)) return;
    const cursorPosition = quill.getSelection()?.index || quill.getLength();
    quill.insertText(cursorPosition, placeholder, 'bold', 'user');
  };

  const removeField = (id) => {
    setFormFields(prev => {
      const index = prev.findIndex(f => f.id === id);
      const field = prev[index];
      const updated = [...prev.slice(0, index), ...prev.slice(index + 1)];

      // Track for restore
      setDeletedFields(old => [...old, { field, index }]);

      // Track for backend delete
      if (typeof id === 'number') { // means it's a real DB ID
        setDeletedFieldIds(prev => [...prev, id]);
      }

      return updated;
    });

    // Also remove placeholder from Quill 
    const field = formFields.find(f => f.id === id);
    const placeholder = `{{${field.label}}}`;
    const quill = quillRef.current;
    const startIndex = quill.getText().indexOf(placeholder);
    if (startIndex !== -1) {
      quill.deleteText(startIndex, placeholder.length);
    }
  };

  const restoreField = (id) => {
    const toRestore = deletedFields.find(item => item.field.id === id);
    if (!toRestore) return;

    setFormFields(prev => {
      const updated = [...prev];
      updated.splice(toRestore.index, 0, toRestore.field); // insert at original index
      return updated;
    });

    setDeletedFields(prev => prev.filter(item => item.field.id !== id));

    if (typeof id === 'number') {
      setDeletedFieldIds(prev => prev.filter(deletedId => deletedId !== id));
    }

    // Insert the restored field placeholder into the Quill editor
    const quill = quillRef.current;
    const placeholder = `{{${toRestore.field.label}}}`;

    // Check if the field already exists to avoid duplicates
    const editorContent = quill.getText();
    if (!editorContent.includes(placeholder)) {
      const cursorPosition = quill.getSelection()?.index || quill.getLength();
      quill.insertText(cursorPosition, placeholder, 'bold', 'user');
    }
  };


  const updateField = (id, key, value) => {
    setFormFields(prevFields =>
      prevFields.map(field =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const handleCreateForm = async (data) => {
    if (isLoading) return;
    setIsLoading(true);

    if (mode === 'edit') {
      data.content = instructions;
      onSubmit(data, formFields, deletedFieldIds);
      setIsLoading(false);
    } else {
      try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('content', instructions); // HTML from Quill
        if (pdfFile) {
          formData.append('pdf', pdfFile); // 
        }
        formData.append('is_visible', data.is_visible ? 1 : 0);

        const formRes = await createForm(formData);
        const formId = formRes.data.form.id;

        await saveFormFields(formId, formFields);

        if (onSuccess) onSuccess(formId);
      } catch (error) {
        console.error('Form submission error:', error);
        setLocalError('There was an error creating the form.');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      {(error || localError) && (
        <p className="text-red-500 text-center mb-4">{error || localError}</p>
      )}

      <form onSubmit={handleSubmit(handleCreateForm)} className="space-y-4">
        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold mb-4">Create a Form</h2>
          <Controller
            name="is_visible"
            control={control}
            render={({ field }) => (
              <SwitchComponent
                label="Visible to Users"
                checked={!!field.value}
                onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
              />
            )}
          />
        </div>

        <input {...register('title')} placeholder="Form Title" className="border p-2 w-full" required />
        <textarea {...register('description')} placeholder="Description" className="border p-2 w-full" />
        {mode !== 'edit' && (
          <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
        )}

        <div className={`grid ${pdfFile ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mt-6`}>
          {pdfFile && (
            <div>
              <h3 className="font-semibold mb-2">PDF Preview</h3>
              <canvas ref={canvasRef} className="border w-full max-h-[500px] overflow-auto" />
            </div>
          )}

          <div className="flex flex-col min-h-0">
            <h3 className="font-semibold mb-2">Editor</h3>
            <div
              ref={editorRef}
              className="bg-white border rounded p-2 min-h-[200px] max-h-[500px] overflow-auto"
            />
          </div>

          <div className="flex flex-col min-h-0">
            <h3 className="font-semibold mb-2">Form Fields</h3>
            <div className="overflow-auto max-h-[500px] space-y-2 pr-1">
              {formFields.map((field, i) => (
                <div key={field.id} className="border p-2 rounded">
                  <div className='flex items-center justify-between gap-2'>
                    <h4 className="font-medium mb-1">Field {i + 1}</h4>
                    <label className="flex items-center gap-2">
                      Required
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                        className="m-auto"
                      />
                    </label>
                  </div>

                  <input
                    value={field.label || ''}
                    onChange={(e) => updateField(field.id, 'label', e.target.value)}
                    className="border p-1 w-full mb-2"
                  />
                  <select
                    value={field.type || ''}
                    onChange={(e) => updateField(field.id, 'type', e.target.value)}
                    className="border p-1 w-full mb-2"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Paragraph</option>
                    <option value="date">Date</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Multiple Choice</option>
                    <option value="select">Dropdown</option>
                    <option value="2x2_image">2x2 Image</option>
                  </select>

                  {['radio', 'select'].includes(field.type) && (
                    <div className="mt-2">
                      <label className="block font-medium">Options (comma-separated)</label>
                      <input
                        type="text"
                        value={(field.options && field.options.join(', ')) || ''}
                        onChange={(e) =>
                          updateField(field.id, 'options', e.target.value.split(',').map(opt => opt.trim()))
                        }
                        className="border p-2 w-full"
                        placeholder="e.g. Option 1, Option 2"
                        required
                      />
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => insertFieldToEditor(field)}
                      type="button"
                      className="bg-blue-200 text-sm px-2 py-1 rounded"
                    >Insert</button>
                    <button
                      onClick={() => removeField(field.id)}
                      type="button"
                      className="bg-red-200 text-sm px-2 py-1 rounded"
                    >Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {deletedFields.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Deleted Fields</h4>
                <div className="space-y-2">
                  {deletedFields.map(({ field }) => (
                    <div key={field.id} className="border p-2 rounded bg-gray-50 flex justify-between items-center">
                      <span>{field.label || 'Untitled Field'}</span>
                      <button
                        onClick={() => restoreField(field.id)}
                        className="text-sm bg-green-200 px-2 py-1 rounded"
                      >Restore</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={addField} type="button" className="mt-2 bg-gray-300 px-4 py-1">Add Field</button>
          </div>
        </div>
        <div className=' space-x-2 flex justify-end'>
          <button type="submit" disabled={isLoading} className={`px-4 py-2 rounded cursor-pointer ${isLoading ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}>
            {isLoading ? 'Saving...' : 'Save Form'}
          </button>

          {/* <button onClick={deleteForm} disabled={isLoading} className={`px-4 py-2 rounded cursor-pointer ${isLoading ? 'bg-gray-400' : 'bg-red-500 text-white'}`}>
            {isLoading ? 'Deleting...' : 'Delete Form'}
          </button> */}
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;