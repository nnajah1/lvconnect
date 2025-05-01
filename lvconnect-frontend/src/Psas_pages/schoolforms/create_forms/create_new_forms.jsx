import React, { useState } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import SchoolLogo from "../psas_assets/image.png";
import "../psas_styling/create_new_form.css"; 

export default function CreateNewForms() {
  const [isOpen, setIsOpen] = useState(true);
  const [inputFields, setInputFields] = useState([
    { id: Date.now(), value: "" },
  ]);

  if (!isOpen) return null;

  const handleInputChange = (e, id) => {
    setInputFields((fields) =>
      fields.map((field) =>
        field.id === id ? { ...field, value: e.target.value } : field
      )
    );
  };

  const handleDeleteField = (id) => {
    setInputFields((fields) => fields.filter((field) => field.id !== id));
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <h1 className="form-title">Create New Form</h1>
          <button onClick={() => setIsOpen(false)} className="close-btn">
            <X size={22} />
          </button>
        </div>

        {/* Logo & Info */}
        <div className="form-info">
          <img
            src={SchoolLogo}
            alt="School Logo"
            className="school-logo"
          />
          <div className="school-details">
            <h3 className="school-name">
              LA VERDAD <br /> CHRISTIAN COLLEGE, INC.
            </h3>
            <p className="school-location">Apalit, Pampanga</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="input-section">
          {inputFields.map((field) => (
            <div key={field.id} className="input-wrapper">
              <textarea
                value={field.value}
                placeholder="Input text here"
                onChange={(e) => handleInputChange(e, field.id)}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="input-text"
              />
              <div className="trash-container">
                <button
                  onClick={() => handleDeleteField(field.id)}
                  className="trash-btn"
                  aria-label="Delete input field"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Field Button */}
        <div className="add-field">
          <button
            onClick={() =>
              setInputFields([...inputFields, { id: Date.now(), value: "" }])
            }
            className="add-btn"
          >
            + Add input field
          </button>
        </div>

        {/* Footer */}
        <div className="form-footer">
          <button className="import-btn">
            <Upload size={16} /> Import file
          </button>
          <div className="footer-buttons">
            <button className="upload-btn">Upload</button>
            <button className="draft-btn">Save Draft</button>
          </div>
        </div>
      </div>
    </div>
  );
}
