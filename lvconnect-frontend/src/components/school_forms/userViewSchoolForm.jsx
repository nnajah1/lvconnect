
import React, { useState, useEffect } from 'react';
import { downloadSubmission, getSubmittedFormById, reviewSubmission } from '@/services/school-formAPI';
import { useForms } from '@/context/FormsContext';
import { toast } from 'react-toastify';
import StudentEditForm from './userSubmitForm';
import FormPdfGenerator from './downloadForms';

import html2pdf from 'html2pdf.js';

const ShowSubmission = ({ formId, userRole }) => {
  const { fetchForms, fetchSubmitted } = useForms();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadForm = async () => {
    try {
      const response = await getSubmittedFormById(formId);
      const submission = response.data.submission;
      const submissionData = response.data.submission_data;
      const title = submission.form_type.title;
      const description = submission.form_type.description;
      const content = submission.form_type.content;

      setForm({
        ...submission,
        data: submissionData,
        title,
        description,
        content,
      });
      await fetchForms();
      await fetchSubmitted();
    } catch (err) {
      setError('Failed to view form');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForm();
  }, [formId]);

  const handleReview = async (status) => {
    setIsReviewing(true);
    try {
      await reviewSubmission(form.id, { status, admin_remarks: adminRemarks });
      toast.success(`Submission ${status} successfully!`);
      loadForm(); // reload updated status
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.');
    } finally {
      setIsReviewing(false);
    }
  };

  if (loading) return <div className="p-4">Loading form...</div>;
  if (!form) return <div className="p-4 text-red-600">Form not found.</div>;

  const { title, description, created_at, status, data } = form;

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
              {/* <h2 className="text-2xl font-semibold">{title}</h2>s */}
              <p className="text-sm text-gray-400">Submitted at: {new Date(created_at).toLocaleString()}</p>
              <p className="text-sm text-blue-600">Status: {status}</p>
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

              {status === 'approved' && <FormPdfGenerator submissionId={formId} />}
            </div>
          </div>
          <div id="form-content" className="mt-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white border-b-2 border-blue-500 rounded-t-lg p-2 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 text-center">{title}</h2>
            </div>

            {/* Form Fields */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {data.map((field, index) => {
                const fieldType = field.form_field_data?.type;
                const rawAnswer = field.answer_data || '';
                const baseURL = import.meta.env.VITE_BASE_URL;
                let answer = '[Not answered]';

                if (fieldType === '2x2_image' && rawAnswer) {
                  const imageURL = rawAnswer.startsWith('http') ? rawAnswer : `${baseURL}${rawAnswer}`;
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
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">{field.field_name}</h3>
                    </div>

                    {/* Field Answer */}
                    <div className="ml-9">
                      <div className="bg-gray-50 rounded-md p-4 border-l-4 border-blue-500">
                        {typeof answer === 'string' ? (
                          <p className={`text-sm ${answer === '[Not answered]' ? 'text-gray-400 italic' : 'text-gray-700'}`}>
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

      {userRole === 'psas' && status === 'pending' && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50 space-y-4">
          <h3 className="text-lg font-semibold">Admin Review</h3>
          <textarea
            className="w-full p-2 border"
            rows="4"
            placeholder="Add your remarks here..."
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleReview('approved')}
              disabled={isReviewing}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => handleReview('rejected')}
              disabled={isReviewing}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        </div>
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
          <p className={`text-sm whitespace-pre-wrap ${form.status === 'approved' ? 'text-green-800' : 'text-red-800'}`}>
            {form.admin_remarks}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShowSubmission;
