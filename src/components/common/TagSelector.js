import React, { useState } from "react";

/**
 * TagSelector - Mobile-friendly tag-based selection component
 *
 * Replaces traditional dropdowns with a tag-based UI optimized for touch interfaces.
 * Supports "其他" (Other) option with custom text input.
 * Supports both single and multiple selection modes.
 *
 * @param {string|Array<string>} value - Currently selected value (string for single, array for multiple)
 * @param {function} onChange - Callback when selection changes
 * @param {Array<string>} options - Array of option strings
 * @param {string} placeholder - Placeholder text shown when no selection
 * @param {string} label - Label text displayed above tags
 * @param {boolean} multiple - Enable multiple selection mode (default: false)
 */
const TagSelector = ({ value, onChange, options, placeholder, label, multiple = false }) => {
  const [customValue, setCustomValue] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Normalize value to array for easier handling
  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

  const handleTagClick = (option) => {
    if (option === "其他") {
      setShowCustomInput(true);
    } else {
      if (multiple) {
        // Toggle selection in multiple mode
        const newValues = selectedValues.includes(option)
          ? selectedValues.filter(v => v !== option)
          : [...selectedValues, option];
        onChange(newValues);
      } else {
        // Replace selection in single mode
        setShowCustomInput(false);
        setCustomValue("");
        onChange(option);
      }
    }
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      if (multiple) {
        onChange([...selectedValues, customValue.trim()]);
      } else {
        onChange(customValue.trim());
      }
      setShowCustomInput(false);
      setCustomValue("");
    }
  };

  const handleCustomCancel = () => {
    setShowCustomInput(false);
    setCustomValue("");
  };

  const handleRemoveCustomValue = (customVal) => {
    if (multiple) {
      onChange(selectedValues.filter(v => v !== customVal));
    } else {
      onChange("");
    }
  };

  // Find custom values (values not in predefined options)
  const customValues = selectedValues.filter(v => !options.includes(v));
  const hasOtherSelected = customValues.length > 0;

  return (
    <div className="tag-selector">
      {label && <div className="tag-selector-label">{label}</div>}

      <div className="tag-container">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`tag ${selectedValues.includes(option) || (option === "其他" && hasOtherSelected) ? 'selected' : ''}`}
            onClick={() => handleTagClick(option)}
          >
            {option}
          </button>
        ))}
        {selectedValues.length === 0 && !showCustomInput && (
          <span className="tag-placeholder">{placeholder}</span>
        )}
        {customValues.map((customVal) => (
          <span key={customVal} className="tag-custom-value">
            {customVal}
            <button
              type="button"
              className="tag-remove-btn"
              onClick={() => handleRemoveCustomValue(customVal)}
              title="移除"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {showCustomInput && (
        <div className="tag-custom-input-container">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="請輸入自訂內容"
            className="tag-custom-input"
            maxLength="50"
            autoFocus
          />
          <div className="tag-custom-buttons">
            <button
              type="button"
              onClick={handleCustomSubmit}
              className="btn btn-small"
              disabled={!customValue.trim()}
            >
              確認
            </button>
            <button
              type="button"
              onClick={handleCustomCancel}
              className="btn-remove btn-small"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
