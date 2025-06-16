
import React, { useState, useEffect } from 'react';
import StudentEditForm from './userSubmitForm';
import FormPdfGenerator from './downloadForms';

const ShowSubmission = ({ form, userRole, closeModal, loadForm }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!form) {
    return <div className="p-4 text-red-600">Form not found.</div>;
  }
  const { created_at, status, data } = form;
  // console.log(form)
  // console.log(form.reviewed_by)
  return (
    <div className="w-[50vw] p-4 space-y-4">
      {isEditing ? (
        <StudentEditForm
          formId={form.form_type_id}
          draftId={form.id}
          initialData={Object.fromEntries(data.map(field => [field.field_name, field.answer_data]))}
          onSuccess={() => {
            setIsEditing(false);
            loadForm();
          }}
        />
      ) : (
        <>
          <div className='flex justify-between'>
            <div>
              <p className=" text-gray-400">Submitted at: {new Date(created_at).toLocaleString()}</p>
              <p className=" text-blue-600">Status: {status}</p>
            </div>
            <div className="flex flex-col gap-2">
              {userRole === 'student' && status === 'draft' && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Draft
                </button>
              )}

            </div>
          </div>
          <div id="form-content" className="mt-8 max-w-4xl mx-auto">
          
            {/* Form Fields */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {data.map((field, index) => {
                const fieldType = field.form_field_data?.type;
                const rawAnswer = field.answer_data || '';
                let answer = '[Not answered]';

                if (fieldType === '2x2_image' && rawAnswer) {
                  const imageURL = data[0]?.image_urls?.[0];
                  answer = (
                    <div className="flex justify-start">
                      <img
                        src={imageURL}
                        alt={field.field_name}
                        className="w-32 h-32 object-cover border border-gray-300 rounded-lg shadow-sm"
                        onError={(e) => (e.target.outerHTML = '<span class="text-gray-400 italic">[Image not available]</span>')}
                      />
                    </div>
                  );
                  
                } else if (rawAnswer) {
                  answer = rawAnswer;
                }
                return (
                  <div
                    key={index}
                    className={`px-6 py-5 ${index !== data.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors duration-150`}
                  >
                    {/* Field Label */}
                    <div className="flex items-center mb-3">
                      <div className="w-4 h-4 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">{field.field_name}</h3>
                    </div>

                    {/* Field Answer */}
                    <div className="ml-9">
                      <div className="bg-gray-50 rounded-md p-4 border-l-4 border-blue-500">
                        {typeof answer === 'string' ? (
                          <p className={` ${answer === '[Not answered]' ? 'text-gray-400 italic' : 'text-gray-700'}`}>
                            {answer}
                          </p>
                        ) : (
                          answer
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {userRole === 'student' && form.admin_remarks && (
        <div
          className={`mt-4 p-4 border rounded ${form.status === 'approved'
            ? 'border-green-300 bg-green-50'
            : 'border-red-300 bg-red-50'
            }`}
        >
          <h3 className={`font-semibold mb-1 ${form.status === 'approved' ? 'text-green-700' : 'text-red-700'}`}>
            Admin Remarks
          </h3>
          <p className={` whitespace-pre-wrap ${form.status === 'approved' ? 'text-green-800' : 'text-red-800'}`}>
            {form.admin_remarks}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShowSubmission;
