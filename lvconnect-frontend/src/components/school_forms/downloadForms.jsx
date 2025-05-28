import React, { useEffect, useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import api from '@/services/axios';

export default function FormPDFGenerator({ submissionId }) {
  const [content, setContent] = useState('');
  const [submissionData, setSubmissionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const contentRef = useRef();

  useEffect(() => {
    api.get(`/approved-form-data/${submissionId}`)
      .then(res => {
        setContent(res.data.content);
        setSubmissionData(res.data.submission_data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load form data');
      })
      .finally(() => setLoading(false));
  }, [submissionId]);

  const htmlEncode = (str) => String(str).replace(/[\u00A0-\u9999<>\&]/gim, i => '&#'+i.charCodeAt(0)+';');
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const renderContentWithAnswers = (content, submissionData) => {
    if (!content) return '';
    const baseURL = import.meta.env.VITE_BASE_URL;
    let updatedContent = content;

    submissionData.forEach(field => {
      const placeholder = `{{${htmlEncode(field.field_name)}}}`;
      const rawAnswer = field.answer_data || '';
      const fieldType = field.form_field_data?.type;

      let formattedAnswer = `<span style="
        color: #9ca3af;
        font-style: italic;
        text-decoration: underline;
        text-decoration-style: dashed;
        text-decoration-color: #cbd5e1;
        padding: 2px 4px;
        background: #f8fafc;
        border-radius: 2px;
      ">[Not answered]</span>`;

      if (fieldType === '2x2_image' && rawAnswer) {
        const imageURL = rawAnswer.startsWith('http') ? rawAnswer : `${baseURL}${rawAnswer}`;
        formattedAnswer = `<img src="${imageURL}" 
             alt="${field.field_name}" 
             style="
               width: 120px; 
               height: 120px; 
               object-fit: cover; 
               border: 1px solid #3b82f6; 
               border-radius: 6px;
               margin: 0 4px;
               vertical-align: middle;
             " 
             onerror="this.outerHTML='<span style=&quot;color: #9ca3af; font-style: italic;&quot;>[Image not available]</span>'"/>`;
      } else if (rawAnswer) {
        formattedAnswer = `<span style="
          color: #1f2937;
          font-weight: 500;
          padding: 2px 4px;
          background: #f0f9ff;
          border-radius: 3px;
          border-bottom: 2px solid #3b82f6;
        ">${rawAnswer}</span>`;
      }

      const regex = new RegExp(escapeRegExp(placeholder), 'gi');
      updatedContent = updatedContent.replace(regex, formattedAnswer);
    });

    updatedContent = updatedContent.replace(/{{[^}]+}}/g, `<span style="
      color: #9ca3af;
      font-style: italic;
      text-decoration: underline;
      text-decoration-style: dashed;
      text-decoration-color: #cbd5e1;
      padding: 2px 4px;
      background: #f8fafc;
      border-radius: 3px;
    ">[Not answered]</span>`);
    
    return updatedContent;
  };

  const downloadPDF = () => {
    const element = contentRef.current;
    
    // Add beautiful styling to the PDF content
    const styledContent = `
      <div style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        background: #ffffff;
        color: #1f2937;
        line-height: 1.6;
      ">
        <div style="
          text-align: center;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 24px;
          margin-bottom: 40px;
        ">
          <h1 style="
            font-size: 28px;
            font-weight: 700;
            color: #1e40af;
            margin: 0 0 12px 0;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          ">Form Submission</h1>
          <p style="
            color: #6b7280;
            font-size: 16px;
            margin: 0;
            font-weight: 500;
          ">Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        
        <div style="
          background: #ffffff;
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);
          font-size: 16px;
          line-height: 1.8;
        ">
          ${element.innerHTML}
        </div>
        
        <div style="
          margin-top: 40px;
          padding-top: 24px;
          border-top: 2px solid #f1f5f9;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        ">
          <p style="margin: 0; font-weight: 500;">
            Submission ID: ${submissionId} • Approved by PSAS Officer
          </p>
        </div>
      </div>
    `;

    // Create temporary element for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = styledContent;
    document.body.appendChild(tempDiv);

    html2pdf().from(tempDiv).set({
      margin: 0.3,
      filename: `form-submission-${submissionId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait',
        compress: true
      }
    }).save().then(() => {
      document.body.removeChild(tempDiv);
    }).catch(() => {
      document.body.removeChild(tempDiv);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span className="text-blue-600 font-medium">Loading form data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <button 
          onClick={downloadPDF} 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 transform hover:scale-105"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download PDF</span>
        </button>
      </div>
      
      {/* Hidden content for PDF generation */}
      <div 
        ref={contentRef} 
        className="hidden"
        dangerouslySetInnerHTML={{ __html: renderContentWithAnswers(content, submissionData) }}
      />
    </div>
  );
}