import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import * as pdfjsLib from 'pdfjs-dist';
import SwitchComponent from "@/components/dynamic/switch";
import { createForm, saveFormFields, deleteForm } from '@/services/school-formAPI';
import { extractFieldsFromText } from '@/utils/pdfUtils';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

import { useForms } from '@/context/FormsContext';
import ConfirmationModal from '@/components/dynamic/DeleteModal';
import { toast } from 'react-toastify';
import { DeleteModal } from '../dynamic/alertModal';

const FormBuilder = ({ mode = 'create', initialData, initialFields, onSubmit, onSuccess, onDelete, closeModal }) => {

  const { fetchForms, fetchSubmitted } = useForms();

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
  const [previousFieldNames, setPreviousFieldNames] = useState({});
  const [formFields, setFormFields] = useState(initialFields || []);
  const [deletedFields, setDeletedFields] = useState([]);
  const [deletedFieldIds, setDeletedFieldIds] = useState([]);

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const canvasRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState();

  const [isAlertModal, setIsAlertModal] = useState(false);
  const openAlertModal = () => setIsAlertModal(true);
  const closeAlertModal = () => setIsAlertModal(false);

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

    // if (initialData?.content && quillRef.current) {
    //   quillRef.current.root.innerHTML = initialData.content;
    //   setInstructions(initialData.content);
    // }
    if (initialData?.content && quillRef.current) {
    const cleanedHTML = initialData.content.trim().replace(/(<p><br><\/p>)+$/g, '');
    quillRef.current.clipboard.dangerouslyPasteHTML(cleanedHTML);
    setInstructions(cleanedHTML);
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
      id: crypto.randomUUID(),
      name: `Field ${formFields.length + 1}`,
      type: 'text',
      required: false,
    };
    setFormFields([...formFields, newField]);
    insertFieldToEditor(newField);
  };

  const insertFieldToEditor = (field) => {
    const quill = quillRef.current;
    if (!quill) return;

    const oldName = previousFieldNames[field.id];
    const newPlaceholder = `{{${field.name}}}`;

    const editorText = quill.getText();

    if (oldName && oldName !== field.name) {
      const oldPlaceholder = `{{${oldName}}}`;
      // const editorText = quill.getText();
      const startIndex = editorText.indexOf(oldPlaceholder);

      if (startIndex !== -1) {
        // Replace old placeholder with the new one at the exact position
        quill.deleteText(startIndex, oldPlaceholder.length);
        quill.insertText(startIndex, newPlaceholder, 'user');
        return;
      }
    }

    // If not previously inserted or already replaced, insert at cursor
    if (!editorText.includes(newPlaceholder)) {
    const selection = quill.getSelection();
    const insertAt = selection?.index ?? editorText.trimEnd().length;

    // Insert without a newline
    quill.insertText(insertAt, newPlaceholder, 'user');
    quill.setSelection(insertAt + newPlaceholder.length);
  }
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
    const placeholder = `{{${field.name}}}`;
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
    const placeholder = `{{${toRestore.field.name}}}`;

    // Check if the field already exists to avoid duplicates
    const editorContent = quill.getText();
    if (!editorContent.includes(placeholder)) {
      const cursorPosition = quill.getSelection()?.index || quill.getLength();
      quill.insertText(cursorPosition, placeholder, 'user');
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

    try {
      const cleanedContent = instructions?.trim().replace(/\s+/g, ' ')
      .replace(/(<p><br><\/p>)+$/g, '') // Remove trailing <p><br></p>
      .replace(/<p><br><\/p>/g, '');    // Remove any <p><br></p> anywhere;
      if (mode === 'edit') {
        data.content = cleanedContent;
        await onSubmit(data, formFields, deletedFieldIds);
        if (onSuccess) onSuccess();
      } else {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('content', cleanedContent);
        if (pdfFile) {
          formData.append('pdf', pdfFile);
        }
        formData.append('is_visible', data.is_visible ? 1 : 0);

        const formRes = await createForm(formData);
        const formId = formRes.data.form.id;

        await saveFormFields(formId, formFields);
        await fetchForms();
        await fetchSubmitted();
        if (onSuccess) onSuccess(formId);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(
        mode === 'edit'
          ? 'There was an error updating the form.'
          : 'There was an error creating the form.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteForm = async () => {
    if (!initialData.id) return;
    try {
      await deleteForm(initialData.id);
      await fetchForms();
      await fetchSubmitted();
      if (onDelete) onDelete(initialData.id);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete form.');
    }
    closeAlertModal();
  };

  return (
    <div className="p-4">

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

        <input {...register('title')} placeholder="Form Title" className="border p-2 w-full rounded" required />
        <textarea {...register('description')} placeholder="Description" className="border p-2 w-full rounded bg-white" />
        {mode !== 'edit' && (
          <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
        )}

        <div className={`grid ${pdfFile
          ? 'grid-cols-[300px_450px_250px]' // Custom 3-column widths
          : 'grid-cols-[1fr_250px]' // Custom 2-column widths
          } gap-4 mt-6`}>
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
                    value={field.name || ''}
                    onFocus={() => {
                      setPreviousFieldNames((prev) => ({
                        ...prev,
                        [field.id]: field.name, // Store current name
                      }));
                    }}
                    onChange={(e) => updateField(field.id, 'name', e.target.value)}
                    className="border p-1 w-full mb-2"
                  />
                  <Select
                    value={field.type}
                    onValueChange={(value) => updateField(field.id, 'type', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Paragraph</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="checkbox">Checkbox Group</SelectItem>
                      <SelectItem value="single_checkbox">Single Checkbox</SelectItem>
                      <SelectItem value="radio">Multiple Choice</SelectItem>
                      <SelectItem value="select">Dropdown</SelectItem>
                      <SelectItem value="2x2_image">2x2 Image</SelectItem>
                    </SelectContent>
                  </Select>

                  {['radio', 'select', 'checkbox'].includes(field.type) && (
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
                      <span>{field.name || 'Untitled Field'}</span>
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
      
          {mode === 'edit' ? (
            <div>
              <button
                type="button"
                onClick={openAlertModal}
                className="text-red-600 border border-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
              <DeleteModal
                isOpen={isAlertModal}
                closeModal={closeAlertModal}
              >
                {/* Action buttons inside the modal */}
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
                  onClick={closeAlertModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleDeleteForm}
                >
                  Delete
                </button>
              </DeleteModal>
            </div>
          ) :
            (
              <button
                onClick={closeModal}
                className="btn-cancel px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            )
          }
            <button type="submit" disabled={isLoading} className={`px-4 py-2 rounded cursor-pointer ${isLoading ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}>
            {isLoading ? 'Saving...' : 'Save Form'}
          </button>

        </div>
      </form>


    </div>


  );
};

export default FormBuilder;