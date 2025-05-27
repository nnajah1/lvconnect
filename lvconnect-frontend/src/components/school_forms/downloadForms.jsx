import React from 'react';
import html2pdf from 'html2pdf.js';

const FormPdfGenerator = ({ submissionId }) => {
  const handleGeneratePdf = () => {
    // Get the container with the rendered content
    const element = document.getElementById(`submission-${submissionId}`);
    if (!element) {
      alert('Form content not found.');
      return;
    }

    const opt = {
      margin:       0.5,
      filename:     `submission-${submissionId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };

  return (
    <button 
      className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      onClick={handleGeneratePdf}
    >
      Download PDF
    </button>
  );
};

export default FormPdfGenerator;
