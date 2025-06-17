import { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function FormPDFGenerator({
  submissionId,
  content,
  data,
  loading,
  reviewedBy,
  title,
  headerImageUrl,
  footerImageUrl
}) {
  const [error, setError] = useState('');
  const contentRef = useRef();

  const htmlEncode = (str) => String(str).replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';');
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const renderContentWithAnswers = (content, data) => {
    if (!content || typeof content !== 'string') return '';
    if (!Array.isArray(data)) return content;

    let updatedContent = String(content);

    data.forEach(field => {
      try {
        const fieldName = field.field_name || '';
        const placeholder = `{{${htmlEncode(fieldName)}}}`;
        const rawAnswer = field.answer_data || '';
        const fieldType = field.form_field_data?.type || field.form_field?.field_data?.type;

        let formattedAnswer = `<span style="
          display: inline-block;
          min-width: 180px;
          border-bottom: 1px solid #cbd5e1;
          height: 24px;
        "></span>`;

        if (fieldType === '2x2_image' && rawAnswer) {
          const imageURL = data[0]?.image_urls?.[0];
          formattedAnswer = `<img src="${imageURL}" 
               alt="${fieldName}" 
               style="
                 width: 120px; 
                 height: 120px; 
                 object-fit: cover; 
                 border: 1px solid #3b82f6; 
                 border-radius: 6px;
                 margin: 4px;
                 vertical-align: middle;
               " 
               onerror="this.outerHTML='<span style=&quot;color: #9ca3af; font-style: italic;&quot;>[Image not available]</span>'"/>`;
        } else if (rawAnswer && String(rawAnswer).trim()) {
          formattedAnswer = `<span style="
            font-size: 16px;
            font-weight: 500;
            color: #1f2937;
          ">${String(rawAnswer)}</span>`;
        }

        const regex = new RegExp(escapeRegExp(placeholder), 'gi');
        updatedContent = updatedContent.replace(regex, formattedAnswer);
      } catch (err) {
        console.error('Error processing field:', field, err);
      }
    });

    // Replace any remaining placeholders with blank lines
    updatedContent = updatedContent.replace(/{{[^}]+}}/g, `<span style="
      display: inline-block;
      min-width: 180px;
      border-bottom: 1px solid #cbd5e1;
      height: 24px;
    "></span>`);

    return updatedContent;
  };

  const downloadPDF = () => {
    try {
      const element = contentRef.current;
      if (!element || !element.innerHTML) {
        setError('No content available for PDF generation');
        return;
      }

      const styledContent = `
        <div style="
          font-family: 'Segoe UI', sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: #ffffff;
          color: #1f2937;
          line-height: 1.6;
        ">

          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 26px; font-weight: 700; color: #1e40af;">${title}</h1>
            <p style="color: #6b7280; font-size: 14px;">Generated on ${new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>

          <div style="font-size: 15px; padding: 10px 0 30px 0;">
            ${element.innerHTML}
          </div>

          <div style="
            border-top: 2px solid #e5e7eb;
            padding-top: 12px;
            font-size: 14px;
            text-align: center;
            color: #6b7280;
          ">
            <p>Submission ID: ${submissionId} • Approved by PSAS Officer ID: ${reviewedBy}</p>
          </div>

        </div>
      `;

          // ${headerImageUrl ? `<img src="${headerImageUrl}" style="max-width: 100%; margin-bottom: 24px;" />` : ''}
          // ${footerImageUrl ? `<img src="${footerImageUrl}" style="max-width: 100%; margin-top: 24px;" />` : ''}
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = styledContent;
      document.body.appendChild(tempDiv);

      html2pdf().from(tempDiv).set({
        margin: 0.3,
        filename: `form-submission-${submissionId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', compress: true }
      }).save().then(() => {
        document.body.removeChild(tempDiv);
      }).catch((pdfError) => {
        console.error('PDF generation error:', pdfError);
        setError('Failed to generate PDF. Please try again.');
        document.body.removeChild(tempDiv);
      });
    } catch (err) {
      console.error('Download PDF error:', err);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-blue-600 font-medium">Loading form data...</div>;
  }

  if (error) {
    return <div className="text-red-600 bg-red-100 p-4 rounded">{error}</div>;
  }

  if (!content || !data) {
    return <div className="text-gray-500 text-center p-4">No available data for PDF generation</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <button
          onClick={downloadPDF}
          className="bg-blue-900 hover:bg-blue-800 text-white font-semibold p-2 rounded shadow-md transition"
        >
          Download PDF
        </button>
      </div>
      <div
        ref={contentRef}
        className="hidden"
        dangerouslySetInnerHTML={{ __html: renderContentWithAnswers(content, data) }}
      />
    </div>
  );
}
