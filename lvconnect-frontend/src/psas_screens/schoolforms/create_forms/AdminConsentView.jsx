import React from 'react';
import logo from '../assets/lv-logo.png';
import '@/psas_screens/psas_styling/AdminConsentView.css';

const AdminConsentView = ({ adminData = {}, studentResponse = {} }) => {
  const {
    formTitle,
    dataPrivacyNotice,
    privacyNoticeDescription,
    notice,
    consentStatement,
  } = adminData;

  const {
    responses = [],
    parentGuardianName,
    emergencyContact = {},
  } = studentResponse;

  return (
    <div className="admin-consent-wrapper">
      <div className="admin-consent-container">
        <div className="admin-consent-header">
          <img src={logo} alt="LVCC Logo" className="h-16 w-16 object-contain" />
          <div className="admin-consent-title-text">
            <h2 className="text-lg font-bold leading-tight">La Verdad</h2>
            <h3 className="text-lg font-bold leading-tight">Christian College, Inc.</h3>
            <p className="text-sm">Apalit, Pampanga</p>
          </div>
        </div>

        {formTitle && (
          <div className="admin-form-title">
            <h1>{formTitle}</h1>
          </div>
        )}

        {dataPrivacyNotice && (
          <div className="admin-privacy-notice">
            <h2>{dataPrivacyNotice}</h2>
            <div className="admin-text">{privacyNoticeDescription}</div>
          </div>
        )}

        {consentStatement && (
          <div className="admin-consent-statement admin-text">
            {consentStatement}
          </div>
        )}

        <div className="space-y-4">
          {responses.map((item, index) => (
            <div key={index} className="admin-response">
              <div className="admin-label">{item.label}:</div>
              <div className="admin-value">{item.value}</div>
            </div>
          ))}

          {notice && (
            <div className="admin-notice">
              <div className="admin-text">{notice}</div>
            </div>
          )}

          {parentGuardianName && (
            <div className="admin-parent-info">
              <div className="admin-label">Parent/Guardian Name:</div>
              <div className="admin-value">{parentGuardianName}</div>
            </div>
          )}

          {(emergencyContact.name || emergencyContact.number) && (
            <>
              <div className="admin-emergency-section">
                <div className="admin-section-label">Emergency Contact Information:</div>
              </div>
              {emergencyContact.name && (
                <div className="admin-response">
                  <div className="admin-label">Emergency Contact Name:</div>
                  <div className="admin-value">{emergencyContact.name}</div>
                </div>
              )}
              {emergencyContact.number && (
                <div className="admin-response">
                  <div className="admin-label">Emergency Contact Number:</div>
                  <div className="admin-value">{emergencyContact.number}</div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="admin-buttons">
          <button className="admin-button approve">Approve</button>
          <button className="admin-button reject">Reject</button>
          <button className="admin-button close">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AdminConsentView;
