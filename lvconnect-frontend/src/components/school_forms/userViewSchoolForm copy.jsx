import { useEffect, useState } from 'react';
import { downloadSubmission, getSubmittedFormById, reviewSubmission } from '@/services/school-formAPI';
import { useForms } from '@/context/FormsContext';
import { toast } from 'react-toastify';
import StudentEditForm from './userSubmitForm';
import { Button } from '../ui/button';
import { InfoModal, WarningModal } from '../dynamic/alertModal';
import FormPdfGenerator from './downloadForms';


// Helper: Escape RegExp for placeholder replacement
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper: HTML encode to avoid injection
const htmlEncode = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// Helper: Render form content with answers
const renderContentWithAnswers = (content, submissionData) => {
  if (!content) return '';

  const baseURL = import.meta.env.VITE_BASE_URL;
  let updatedContent = content;

  submissionData.forEach(field => {
    const placeholder = `{{${htmlEncode(field.field_name)}}}`;
    const rawAnswer = field.answer_data || '';
    const fieldType = field.form_field_data?.type;

    let formattedAnswer = '[Not answered]'; // default fallback

    if (fieldType === '2x2_image' && rawAnswer) {
      const imageURL = rawAnswer.startsWith('http') ? rawAnswer : `${baseURL}${rawAnswer}`;
      formattedAnswer = `<img 
        src="${imageURL}" 
        alt="${field.field_name}" 
        style="width: 128px; height: 128px; object-fit: cover; border: 1px solid #ccc; border-radius: 0.5rem;" 
        onerror="this.outerHTML = '<span>[Not answered]</span>'" 
      />`;
    } else if (rawAnswer) {
      formattedAnswer = rawAnswer;
    }

    const regex = new RegExp(escapeRegExp(placeholder), 'gi');
    updatedContent = updatedContent.replace(regex, formattedAnswer);
  });

  // Replace any leftover placeholders
  updatedContent = updatedContent.replace(/{{[^}]+}}/g, '[Not answered]');

  return updatedContent;
};

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
      const { title, description, content } = submission.form_type;

      const renderedContent = renderContentWithAnswers(content, submissionData);

      setForm({
        ...submission,
        data: submissionData,
        renderedContent,
        title,
        description
      });

      await fetchForms();
      await fetchSubmitted();
    } catch (err) {
      console.error(err);
      setError('Failed to view form.');
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
      loadForm();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.');
    } finally {
      setIsReviewing(false);
    }
  };

  if (loading) return <div className="p-4">Loading form...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!form) return <div className="p-4 text-red-600">Form not found.</div>;

  const { renderedContent, title, description, created_at, status } = form;

  return (
    <div className="w-[50vw] p-4 space-y-4">
      {isEditing ? (
        <StudentEditForm
          formId={form.form_type_id}
          draftId={form.id}
          initialData={Object.fromEntries(form.data.map(field => [field.field_name, field.answer_data]))}
          onSuccess={() => {
            setIsEditing(false);
            loadForm();
          }}
        />
      ) : (
        <>
          <div className='flex justify-between'>
            <div>
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="text-gray-600">{description}</p>
              <p className="text-sm text-gray-400">Submitted at: {new Date(created_at).toLocaleString()}</p>
              <p className="text-sm text-blue-600">Status: {status}</p>
            </div>
            <div>
              {userRole === 'student' && status === 'draft' && !isEditing && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Draft
                </button>
              )}
              {status === 'approved' && (
                <FormPdfGenerator submissionId={formId} />
              )}
            </div>
          </div>
          <div id={`submission-${formId}`} className="ql-editor mt-6 p-4 border rounded-md" dangerouslySetInnerHTML={{ __html: renderedContent }} />

        </>
      )}

      {/* Admin Review Section for PSAS */}
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
          <h3
            className={`font-semibold mb-1 ${form.status === 'approved' ? 'text-green-700' : 'text-red-700'
              }`}
          >
            Admin Remarks
          </h3>
          <p
            className={`text-sm whitespace-pre-wrap ${form.status === 'approved' ? 'text-green-800' : 'text-red-800'
              }`}
          >
            {form.admin_remarks}
          </p>
        </div>
      )}
    </div>
  );
};


export default ShowSubmission;
