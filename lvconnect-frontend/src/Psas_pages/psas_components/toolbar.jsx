import React, { useState, useEffect, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuAlignLeft, LuAlignRight, LuAlignCenter } from "react-icons/lu";
import { SketchPicker } from "react-color";

export default function CreateForm() {
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
      choices: ["Option 1"],
      showColorPicker: false,
    },
  ]);

  const colorPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setInputFields((prev) =>
          prev.map((field) =>
            field.showColorPicker ? { ...field, showColorPicker: false } : field
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

  const handleInputChange = (e, id) => {
    setInputFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, value: e.target.value } : field
      )
    );
  };

  const handleFocus = (id) => {
    setInputFields((prev) =>
      prev.map((field) => ({
        ...field,
        showToolbar: field.id === id,
      }))
    );
  };

  const handleStyleChange = (id, style, value) => {
    setInputFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, [style]: value } : field))
    );
  };

  const handleFieldTypeChange = (id, fieldType) => {
    const needsChoices = ["Multiple Choice", "Checkboxes", "Dropdown"];
    setInputFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? {
              ...field,
              fieldType,
              choices: needsChoices.includes(fieldType)
                ? field.choices.length ? field.choices : ["Option 1"]
                : [],
            }
          : field
      )
    );
  };

  const handleChoiceChange = (id, index, value) => {
    setInputFields((prev) =>
      prev.map((field) =>
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
    setInputFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? { ...field, choices: [...field.choices, ""] }
          : field
      )
    );
  };

  const handleDeleteChoice = (id, index) => {
    setInputFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? {
              ...field,
              choices: field.choices.filter((_, i) => i !== index),
            }
          : field
      )
    );
  };

  const toggleColorPicker = (id) => {
    setInputFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? { ...field, showColorPicker: !field.showColorPicker }
          : field
      )
    );
  };

  const handleColorChange = (color, id) => {
    setInputFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, textColor: color.hex } : field
      )
    );
  };

  const toggleResponseValidation = (id) => {
    setInputFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? { ...field, showValidation: !field.showValidation }
          : field
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto shadow-xl overflow-hidden">
      {inputFields.map((field) => (
        <div
          key={field.id}
          className="border border-gray-400 rounded-2xl p-4 shadow-md space-y-4 bg-white relative"
        >
          {/* Main Text Input */}
          <textarea
            value={field.value}
            placeholder="Input text here"
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

          {/* Toolbar */}
          {field.showToolbar && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {/* Font Size */}
              <select
                value={field.fontSize}
                onChange={(e) => handleStyleChange(field.id, "fontSize", e.target.value)}
                className="p-2 border rounded"
              >
                {["12px", "14px", "16px", "18px", "20px", "22px", "24px"].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>

              {/* Font Family */}
              <select
                value={field.fontFamily}
                onChange={(e) => handleStyleChange(field.id, "fontFamily", e.target.value)}
                className="p-2 border rounded"
              >
                {["sans-serif", "serif", "monospace"].map((fam) => (
                  <option key={fam} value={fam}>{fam}</option>
                ))}
              </select>

              {/* Color Picker */}
              <div className="relative" ref={colorPickerRef}>
                <button
                  onClick={() => toggleColorPicker(field.id)}
                  className="w-5 h-5 rounded-full border"
                  style={{ backgroundColor: field.textColor }}
                />
                {field.showColorPicker && (
                  <div className="absolute z-50 mt-2">
                    <SketchPicker
                      color={field.textColor}
                      onChangeComplete={(color) => handleColorChange(color, field.id)}
                    />
                  </div>
                )}
              </div>

              {/* Style Toggles */}
              <div className="flex gap-2">
                {[
                  ["isBold", "B", "font-bold"],
                  ["isItalic", "I", "italic"],
                  ["isUnderline", "U", "underline"],
                  ["isStrikethrough", "S", "line-through"],
                ].map(([style, label, className]) => (
                  <button
                    key={style}
                    onClick={() => handleStyleChange(field.id, style, !field[style])}
                    className={`${className} ${field[style] ? "text-black" : "text-gray-600"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Alignment */}
              <div className="flex gap-2">
                {[
                  ["left", <LuAlignLeft />],
                  ["center", <LuAlignCenter />],
                  ["right", <LuAlignRight />],
                ].map(([align, icon]) => (
                  <button
                    key={align}
                    onClick={() => handleStyleChange(field.id, "textAlign", align)}
                    className={field.textAlign === align ? "text-black" : "text-gray-600"}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Field Type */}
              <select
                value={field.fieldType}
                onChange={(e) => handleFieldTypeChange(field.id, e.target.value)}
                className="border rounded p-2"
              >
                {[
                  "Text",
                  "Multiple Choice",
                  "Checkboxes",
                  "Dropdown",
                  "Short answer",
                  "Paragraph",
                  "Date",
                ].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          {/* Render Field Types */}
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
                    className="w-full text-sm pt-[10px] pb-[2px] h-[40px] bg-transparent border-0 border-b border-gray-300 focus:outline-none resize-none"
                    placeholder="Option"
                  />
                  <button
                    onClick={() => handleDeleteChoice(field.id, index)}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddChoice(field.id)}
                className="text-blue-600 text-sm"
              >
                + Add option
              </button>
            </div>
          )}

          {field.fieldType === "Short answer" && (
            <>
              <div className="w-full border-b border-gray-300">
                <textarea
                  rows={1}
                  placeholder="Short answer text"
                  className="w-full p-2 text-sm bg-transparent focus:outline-none resize-none"
                  disabled
                />
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
                    <div className={`block w-10 h-6 rounded-full ${field.showValidation ? "bg-[#1E2A78]" : "bg-gray-300"}`} />
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${field.showValidation ? "translate-x-4" : ""}`} />
                  </div>
                  <span className="ml-3 text-gray-700 text-sm">Response validation</span>
                </label>
              </div>
              {field.showValidation && (
                <div className="space-y-1">
                  {["Number", "Email", "URL"].map((type) => (
                    <div key={type} className="flex items-start space-x-3">
                      <div className="pt-[10px]">
                        <input type="radio" name={`validation-${field.id}`} className="h-[18px] w-[18px]"
                        disabled
                        />
                      </div>
                      <span className="text-gray-500 text-sm pt-[10px]">{type}</span>
                      
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {field.fieldType === "Paragraph" && (
            <div className="w-full border-b border-gray-300">
              <textarea
                rows={3}
                placeholder="Long answer text"
                className="w-full p-2 text-sm bg-transparent focus:outline-none resize-none"
                disabled
              />
            </div>
          )}

          {field.fieldType === "Date" && (
            <div className="w-full">
              <input
                type="date"
                className="w-full border-b border-gray-300 px-2 py-2 text-sm bg-transparent focus:outline-none"
                disabled
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
