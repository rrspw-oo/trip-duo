import React, { useState, useEffect, useRef } from "react";
import { searchStations, getInitialStations } from "../../utils/stationData";

/**
 * StationAutocomplete - Auto-complete input for selecting train stations
 *
 * @param {string} value - Current input value
 * @param {function} onChange - Callback when value changes
 * @param {string} placeholder - Placeholder text
 * @param {string} className - Additional CSS class
 * @param {number} maxLength - Maximum input length
 * @param {string} filterByLine - Optional line name to filter stations by
 */
const StationAutocomplete = ({
  value,
  onChange,
  placeholder,
  className = "",
  maxLength = 50,
  filterByLine = null
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      onChange("");
    } else {
      const matches = searchStations(newValue, filterByLine);
      setSuggestions(matches.slice(0, 10)); // Limit to 10 suggestions
      setShowSuggestions(matches.length > 0);
    }
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    // Show stations when focusing on empty input (filtered by line if specified)
    if (inputValue.trim() === "") {
      const initialStations = getInitialStations(filterByLine, 15);
      setSuggestions(initialStations);
      setShowSuggestions(initialStations.length > 0);
    } else {
      const matches = searchStations(inputValue, filterByLine);
      setSuggestions(matches.slice(0, 10));
      setShowSuggestions(matches.length > 0);
    }
  };

  const handleSelectStation = (station) => {
    setInputValue(station);
    onChange(station);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectStation(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`station-autocomplete ${className}`} ref={wrapperRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="location-input"
        maxLength={maxLength}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="station-suggestions">
          {suggestions.map((station, index) => (
            <div
              key={station}
              className={`station-suggestion-item ${
                index === selectedIndex ? "selected" : ""
              }`}
              onClick={() => handleSelectStation(station)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="station-icon">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              <span>{station}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StationAutocomplete;
