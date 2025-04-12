import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminReviewPage() {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get('/api/admin/submissions?status=pending');
      setSubmissions(res.data);
    } catch (err) {
      console.error('Error fetching submissions', err);
    }

};
const handleDecision = async (id, decision, remark = '') => {
    try {
      await axios.post(`/api/admin/submissions/${id}/review`, {
        status: decision,
        admin_remarks: remark
      });
      alert(`Submission ${decision}`);
      fetchSubmissions();
      setSelected(null);
    } catch (err) {
      console.error('Error updating status', err);
    }
};
const handlePrint = () => {
    window.print();
}

return (
    <div className="p-4">
    <h2>Pending Submissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="border p-4 rounded shadow">
            <h3 className="font-semibold">Submission #{submission.id}</h3>
            <p><strong>Form:</strong> {submission.form_title}</p>
            <p><strong>Submitted by:</strong> {submission.submitted_by_name}</p>
            <button onClick={() => setSelected(submission)} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
              Review
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Review Submission #{selected.id}</h3>
            {selected.answers.map((ans, idx) => (
              <div key={idx} className="mb-2">
                <strong>{ans.field_name}:</strong> {ans.answer_data?.answer || 'N/A'}
              </div>
            ))}
            
            <textarea
              placeholder="Admin remarks (optional)"
              onChange={(e) => setSelected({ ...selected, admin_remarks: e.target.value })}
              className="w-full border p-2 mb-4"
            />

            <div className="flex gap-2">
              <button onClick={() => handleDecision(selected.id, 'approved', selected.admin_remarks)} className="bg-green-500 text-white px-4 py-2 rounded">
                Approve
              </button>
              <button onClick={() => handleDecision(selected.id, 'rejected', selected.admin_remarks)} className="bg-red-500 text-white px-4 py-2 rounded">
                Reject
              </button>
              <button onClick={handlePrint} className="bg-gray-500 text-white px-4 py-2 rounded">
                Print
              </button>
              <button onClick={() => setSelected(null)} className="ml-auto text-sm underline">
                Cancel
              </button>
            </div>
            </div>
            </div>
      )}
      </div>
);
}