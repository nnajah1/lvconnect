import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import * as pdfjsLib from 'pdfjs-dist';
import SwitchComponent from "@/components/school_updates/modals/switch";
import { createForm, saveFormFields } from '@/services/school-formAPI';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

const FormBuilder = () => {
  const [formFields, setFormFields] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [instructions, setInstructions] = useState('');
  const { register, handleSubmit, control, } = useForm();
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState();

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
  }, []);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      setError('Only PDF files are allowed');
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
      quill.setText(modifiedText); // Or use quill.clipboard.dangerouslyPasteHTML if needed

      setInstructions(modifiedText);
      setFormFields(fields);

      renderPdfPage(1, pdf);
    };
    reader.readAsArrayBuffer(file);
  };

  const extractFieldsFromText = (text) => {
    const lines = text.split('\n');
    const fields = [];
    const modifiedLines = [];

    lines.forEach((line) => {
      let match, field;
      if ((match = line.match(/^(.+?):\s*(?:_{2,}|\.\.\.\.)?/))) {
        const label = match[1].trim();
        const name = label.toLowerCase().replace(/[^a-z0-9]/gi, '_');

        field = {
          id: crypto.randomUUID(),
          name,
          label,
          type: 'text',
          required: false,
          x: 0,
          y: 0,
          width: 100,
          height: 40,
        };

        modifiedLines.push(`${label}: {{${name}}}`);
      } else if ((match = line.match(/^(.+?):\s*\[ \]$/))) {
        const label = match[1].trim();
        const name = label.toLowerCase().replace(/[^a-z0-9]/gi, '_');

        field = {
          id: crypto.randomUUID(),
          name,
          label,
          type: 'checkbox',
          required: false,
          x: 0,
          y: 0,
          width: 100,
          height: 40,
        };

        modifiedLines.push(`${label}: {{${name}}}`);
      } else if ((match = line.match(/^(.+?):\s*\( \)$/))) {
        const label = match[1].trim();
        const name = label.toLowerCase().replace(/[^a-z0-9]/gi, '_');

        field = {
          id: crypto.randomUUID(),
          name,
          label,
          type: 'radio',
          required: false,
          x: 0,
          y: 0,
          width: 100,
          height: 40,
        };

        modifiedLines.push(`${label}: {{${name}}}`);
      } else {
        modifiedLines.push(line); // Keep original line
      }

      if (field) {
        fields.push(field);
      }
    });

    return {
      modifiedText: modifiedLines.join('\n'),
      fields,
    };
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
    const placeholder = `{{${field.name}}}`;
    const quill = quillRef.current;
    const editorContent = quill.getText();

    if (editorContent.includes(placeholder)) {
      return;
    }
    const cursorPosition = quill.getSelection()?.index || quill.getLength();
    quill.insertText(cursorPosition, placeholder, 'bold', 'user');
  };

  const removeField = (id) => {
    const field = formFields.find(f => f.id === id);

    if (field) {
      const placeholder = `{{${field.name}}}`;
      const quill = quillRef.current;

      const editorContent = quill.getText();
      const startIndex = editorContent.indexOf(placeholder);

      if (startIndex !== -1) {
        quill.deleteText(startIndex, placeholder.length);
      }

      setFormFields(formFields.filter(f => f.id !== id));
    }
  };

  const updateField = (id, key, value) => {
    setFormFields(prevFields =>
      prevFields.map(field =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };


  const onSubmit = async (data) => {
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

      alert('Form created successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
      setError('There was an error creating the form.');
    }
  };

  return (
    <div className="p-4">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold mb-4">Create a Form</h2>
          <Controller
            name="is_visible"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <SwitchComponent
                label="Visible to Users"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <input {...register('title')} placeholder="Form Title" className="border p-2 w-full" required />
        <textarea {...register('description')} placeholder="Description" className="border p-2 w-full" />
        <input type="file" accept="application/pdf" onChange={handlePdfUpload} />

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
                    value={field.label}
                    onChange={(e) => updateField(field.id, 'label', e.target.value)}
                    className="border p-1 w-full mb-2"
                  />
                  <select
                    value={field.type}
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
                        value={field.options?.join(', ') || ''}
                        onChange={(e) =>
                          updateField(field.id, 'options', e.target.value.split(',').map(opt => opt.trim()))
                        }
                        className="border p-2 w-full"
                        placeholder="e.g. Option 1, Option 2"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => insertFieldToEditor(field)}
                      className="bg-blue-200 text-sm px-2 py-1 rounded"
                    >Insert</button>
                    <button
                      onClick={() => removeField(field.id)}
                      className="bg-red-200 text-sm px-2 py-1 rounded"
                    >Delete</button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addField} type="button" className="mt-2 bg-gray-300 px-4 py-1">Add Field</button>
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Form</button>
      </form>
    </div>
  );
};

export default FormBuilder;