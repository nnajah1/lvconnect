

import React, { useState, useEffect, useRef } from "react";
import { X, Trash2, Upload, FileDown } from "lucide-react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuAlignLeft, LuAlignRight, LuAlignCenter } from "react-icons/lu";
import { SketchPicker } from "react-color";
import SchoolLogo from "../psas_assets/image.png";

export default function CreateForm() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const [inputFields, setInputFields] = useState([
    {
      id: Date.now(),
      value: "",
      fontSize: "18px",
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrikethrough: false,
      fontFamily: "sans-serif",
      textColor: "#000000",
      textAlign: "left",
      showToolbar: false,
      fieldType: "Text",
      choices: "",
      showColorPicker: false,
    },
  ]);

  const colorPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target)
      ) {
        setInputFields((prevFields) =>
          prevFields.map((field) =>
            field.showColorPicker
              ? { ...field, showColorPicker: false }
              : field
          )
        );
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTextClasses = (field) => {
    let classes = "w-full focus:outline-none p-2 border-b";
    if (field.isBold) classes += " font-bold";
    if (field.isItalic) classes += " italic";
    if (field.isUnderline) classes += " underline";
    if (field.isStrikethrough) classes += " line-through";
    return classes;
  };

  const handleAddInputField = () => {
    setInputFields([
      ...inputFields,
      {
        id: Date.now(),
        value: "",
        fontSize: "18px",
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrikethrough: false,
        fontFamily: "sans-serif",
        textColor: "#000000",
        textAlign: "left",
        showToolbar: false,
        fieldType: "Text",
        choices: ["Option 1"],
        showColorPicker: false,
        showValidation: false,
      },
    ]);
  };

  const toggleResponseValidation = (id) => {
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? { ...field, showValidation: !field.showValidation }
          : field
      )
    );
  };

  const handleInputChange = (e, id) => {
    const updatedFields = inputFields.map((field) =>
      field.id === id ? { ...field, value: e.target.value } : field
    );
    setInputFields(updatedFields);
  };

  const handleFocus = (id) => {
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? { ...field, showToolbar: true }
          : { ...field, showToolbar: false }
      )
    );
  };

  const handleStyleChange = (id, style, value) => {
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, [style]: value } : field
      )
    );
  };

  const handleFieldTypeChange = (id, fieldType) => {
    const needsChoices = ["Multiple Choice", "Checkboxes", "Dropdown"];
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? {
              ...field,
              fieldType,
              choices: needsChoices.includes(fieldType)
                ? field.choices.length === 0
                  ? ["Option 1"]
                  : field.choices
                : [],
            }
          : field
      )
    );
  };

  const handleChoiceChange = (id, index, value) => {
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? {
              ...field,
              choices: field.choices.map((c, i) => (i === index ? value : c)),
            }
          : field
      )
    );
  };

  const handleAddChoice = (id) => {
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, choices: [...field.choices, ""] } : field
      )
    );
  };

  const handleDeleteChoice = (id, index) => {
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? {
              ...field,
              choices: field.choices.filter((_, i) => i !== index),
            }
          : field
      )
    );
  };

  const handleDeleteField = (id) => {
    setInputFields(inputFields.filter((field) => field.id !== id));
  };

  const toggleColorPicker = (id) => {
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? { ...field, showColorPicker: !field.showColorPicker }
          : field
      )
    );
  };

  const handleColorChange = (color, id) => {
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, textColor: color.hex } : field
      )
    );
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto shadow-xl overflow-hidden">
        {/* Header */}
        <div className="pt-6 pb-10 px-6 border-b border-gray-200 relative">
          <h1 className="text-xl font-semibold text-[#1E2A78] text-center absolute left-1/2 transform -translate-x-1/2">
            Create New Form
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-black p-1 rounded absolute right-6 top-6"
          >
            <X size={22} />
          </button>
        </div>

        {/* Logo & Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 px-6 pt-6">
          <img
            src={SchoolLogo}
            alt="School Logo"
            className="w-20 h-20 object-cover rounded-full border border-gray-300"
          />
          <div className="leading-snug">
            <h3 className="text-[1.1rem] sm:text-[1.25rem] text-[#1E2A78]">
              LA VERDAD <br /> CHRISTIAN COLLEGE, INC.
            </h3>
            <p className="text-sm text-gray-600">Apalit, Pampanga</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="m-6 space-y-6">
          {inputFields.map((field) => (
            <div key={field.id} className="border border-gray-400 rounded-2xl p-4 shadow-md space-y-4 relative bg-white">
              <textarea
                value={field.value}
                placeholder={field.value ? "" : "Input text here"}
                onFocus={() => handleFocus(field.id)}
                onChange={(e) => handleInputChange(e, field.id)}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className={`${getTextClasses(field)} resize-none pb-[2px] h-[40px] border-b border-gray-300`}
                style={{
                  fontSize: field.fontSize,
                  fontFamily: field.fontFamily,
                  color: field.textColor,
                  textAlign: field.textAlign,
                  overflow: "hidden",
                }}
              />

              {field.showToolbar && (
                <StylingToolbar
                  field={field}
                  onStyleChange={handleStyleChange}
                  onFieldTypeChange={handleFieldTypeChange}
                  onColorChange={handleColorChange}
                  toggleColorPicker={toggleColorPicker}
                  colorPickerRef={colorPickerRef}
                />
              )}

              {/* Choices */}
              {["Multiple Choice", "Checkboxes", "Dropdown"].includes(field.fieldType) && (
                <div className="space-y-2">
                  {field.choices.map((choice, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="pt-[12px]">
                        {field.fieldType === "Multiple Choice" && <input type="radio" disabled className="h-[18px] w-[18px]" />}
                        {field.fieldType === "Checkboxes" && <input type="checkbox" disabled className="h-[18px] w-[18px]" />}
                        {field.fieldType === "Dropdown" && <RiArrowDropDownLine size={20} className="text-gray-500" />}
                      </div>
                      <textarea
                        value={choice}
                        onChange={(e) => handleChoiceChange(field.id, index, e.target.value)}
                        className="w-full text-sm text-gray-800 pt-[10px] pb-[2px] h-[40px] bg-transparent border-0 border-b border-gray-300 focus:outline-none resize-none"
                        placeholder="Option"
                      />
                      <button onClick={() => handleDeleteChoice(field.id, index)} className="ml-2 text-red-500 text-sm">✕</button>
                    </div>
                  ))}
                  <button onClick={() => handleAddChoice(field.id)} className="text-blue-600 text-sm">+ Add option</button>
                </div>
              )}

              {/* Short Answer */}
              {field.fieldType === "Short answer" && (
                <>
                  <div className="w-full border-b border-gray-300">
                    <textarea disabled rows={1} placeholder="Short answer text" className="w-full p-2 text-sm text-gray-800 bg-transparent resize-none" />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={field.showValidation}
                          onChange={() => toggleResponseValidation(field.id)}
                          className="sr-only"
                        />
                        <div className={`block w-10 h-6 rounded-full ${field.showValidation ? "bg-[#1E2A78]" : "bg-gray-300"}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${field.showValidation ? "translate-x-4" : ""}`} />
                      </div>
                      <span className="ml-3 text-gray-700 text-sm">Response validation</span>
                    </label>
                  </div>

                  {field.showValidation && (
      <div className="space-y-1">
        {["Number", "Email", "URL"].map((validationType) => (
          <div key={validationType} className="flex items-start space-x-3">
            {/* Option Icons */}
            <div className="pt-[10px]">
              <input
                type="radio"
                name={`validation-${field.id}`}
                className="h-[18px] w-[18px] text-gray-400"
              />
            </div>

            {/* Editable single-line input for validation options */}
            <span className="text-gray-500 text-sm pt-[10px]">{validationType}</span>

            {/* No delete button for validation */}
          </div>
        ))}
      </div>
    )}
  </>
)}
              {/* Paragraph */}
              {field.fieldType === "Paragraph" && (
                <textarea disabled rows={3} placeholder="Long answer text" className="w-full border-b border-gray-300 p-2 text-sm text-gray-800 bg-transparent resize-none" />
              )}

              {/* Date */}
              {field.fieldType === "Date" && (
                <input type="date" disabled className="w-full border-b border-gray-300 px-2 py-2 text-sm text-gray-800 bg-transparent" />
              )}

              <div className="flex justify-end">
                <button onClick={() => handleDeleteField(field.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Field Button */}
        <div className="px-6 pb-4">
          <button onClick={handleAddInputField} className="border border-sky-400 text-sky-500 font-medium rounded px-4 py-2 hover:bg-sky-50 transition">
            + Add input field
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 pb-6">
          <button className="flex items-center gap-2 bg-[#1E2A78] text-white px-4 py-2 rounded hover:bg-[#1B256B] transition">
            <Upload size={16} /> Import file
          </button>
          <div className="flex gap-2">
            <button className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-400 transition">Upload</button>
            <button className="border border-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition">Save Draft</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// StylingToolbar (inline component)
function StylingToolbar({
  field,
  onStyleChange,
  onFieldTypeChange,
  onColorChange,
  toggleColorPicker,
  colorPickerRef,
  options = {},
}) {
  const {
    fontSizes = ["12px", "14px", "16px", "18px", "20px", "22px", "24px"],
    fontFamilies = ["sans-serif", "serif", "monospace"],
    fieldTypes = ["Text", "Multiple Choice", "Checkboxes", "Dropdown", "Short answer", "Paragraph", "Date"],
    alignments = [
      { label: <LuAlignLeft />, value: "left" },
      { label: <LuAlignCenter />, value: "center" },
      { label: <LuAlignRight />, value: "right" },
    ],
  } = options;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
      <select value={field.fontSize} onChange={(e) => onStyleChange(field.id, "fontSize", e.target.value)} className="p-2 border rounded">
        {fontSizes.map((size) => <option key={size} value={size}>{size}</option>)}
      </select>
      <select value={field.fontFamily} onChange={(e) => onStyleChange(field.id, "fontFamily", e.target.value)} className="p-2 border rounded">
        {fontFamilies.map((font) => <option key={font} value={font}>{font}</option>)}
      </select>
      <div className="relative" ref={colorPickerRef}>
        <button onClick={() => toggleColorPicker(field.id)} className="w-5 h-5 rounded-full border" style={{ backgroundColor: field.textColor }} />
        {field.showColorPicker && (
          <div className="absolute z-50 mt-2">
            <SketchPicker color={field.textColor} onChangeComplete={(color) => onColorChange(color, field.id)} />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onStyleChange(field.id, "isBold", !field.isBold)} className={`font-bold ${field.isBold ? "text-black" : "text-gray-600"}`}>B</button>
        <button onClick={() => onStyleChange(field.id, "isItalic", !field.isItalic)} className={`italic ${field.isItalic ? "text-black" : "text-gray-600"}`}>I</button>
        <button onClick={() => onStyleChange(field.id, "isUnderline", !field.isUnderline)} className={`underline ${field.isUnderline ? "text-black" : "text-gray-600"}`}>U</button>
        <button onClick={() => onStyleChange(field.id, "isStrikethrough", !field.isStrikethrough)} className={`line-through ${field.isStrikethrough ? "text-black" : "text-gray-600"}`}>S</button>
      </div>
      <div className="flex gap-2">
        {alignments.map(({ label, value }) => (
          <button key={value} onClick={() => onStyleChange(field.id, "textAlign", value)} className={field.textAlign === value ? "text-black" : "text-gray-600"}>
            {label}
          </button>
        ))}
      </div>
      <select value={field.fieldType} onChange={(e) => onFieldTypeChange(field.id, e.target.value)} className="border rounded p-2">
        {fieldTypes.map((type) => <option key={type} value={type}>{type}</option>)}
      </select>
    </div>
  );
}
