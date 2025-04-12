// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { createForm, extractPdfFields } from '@/services/school-formAPI';
// import PdfUploader from '../components/FormBuilder/PdfUploader';
// import FieldEditor from '../components/FormBuilder/FieldEditor';
// import FormPreview from '../components/FormBuilder/FormPreview';
// import Toolbox from '../components/FormBuilder/Toolbox';

// const CreateFormPage = () => {
//   const [fields, setFields] = useState([]);
//   const [activeField, setActiveField] = useState(null);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [isPdfMode, setIsPdfMode] = useState(false);
//   const navigate = useNavigate();
//   const { register, handleSubmit } = useForm();

//   const handlePdfUpload = async (file) => {
//     try {
//       const response = await extractPdfFields(file);
//       setFields(response.data.fields);
//       setPdfFile(file);
//       setIsPdfMode(true);
//     } catch (error) {
//       console.error('Error extracting PDF fields:', error);
//     }
//   };

//   const addField = (fieldType) => {
//     const newField = {
//       id: Date.now().toString(),
//       type: fieldType,
//       label: `${fieldType} Field`,
//       required: false,
//       options: fieldType === 'select' || fieldType === 'radio' ? ['Option 1', 'Option 2'] : undefined,
//       placeholder: '',
//     };
//     setFields([...fields, newField]);
//     setActiveField(newField.id);
//   };

//   const updateField = (fieldId, updates) => {
//     setFields(fields.map(field => 
//       field.id === fieldId ? { ...field, ...updates } : field
//     ));
//   };

//   const removeField = (fieldId) => {
//     setFields(fields.filter(field => field.id !== fieldId));
//     if (activeField === fieldId) {
//       setActiveField(null);
//     }
//   };

//   const onSubmit = async (formData) => {
//     try {
//       const formToSave = {
//         title: formData.title,
//         has_pdf: isPdfMode,
//         pdf_path: isPdfMode ? pdfFile.name : null,
//         content: JSON.stringify(fields),
//       };
      
//       const response = await createForm(formToSave);
//       navigate(`/forms/${response.data.id}`);
//     } catch (error) {
//       console.error('Error saving form:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Create New Form</h1>
      
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Form Title</label>
//           <input
//             {...register('title', { required: true })}
//             className="w-full p-2 border rounded"
//             placeholder="Enter form title"
//           />
//         </div>

//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="md:w-1/4">
//             <Toolbox onAddField={addField} />
//             {!isPdfMode && (
//               <PdfUploader onUpload={handlePdfUpload} />
//             )}
//           </div>

//           <div className="md:w-1/2">
//             {fields.length > 0 ? (
//               <FieldEditor
//                 fields={fields}
//                 activeField={activeField}
//                 onFieldSelect={setActiveField}
//                 onFieldUpdate={updateField}
//                 onFieldRemove={removeField}
//               />
//             ) : (
//               <div className="p-8 border-2 border-dashed rounded-lg text-center">
//                 {isPdfMode ? (
//                   <p>No fields detected in PDF. Add fields manually.</p>
//                 ) : (
//                   <p>Add fields from the toolbox or upload a PDF to extract fields.</p>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="md:w-1/4">
//             <FormPreview fields={fields} />
//           </div>
//         </div>

//         <div className="mt-6">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Save Form
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateFormPage;