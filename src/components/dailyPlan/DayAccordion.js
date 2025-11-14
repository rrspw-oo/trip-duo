import React, { useState, useRef, useEffect } from "react";
import LocationForm from "./LocationForm";
import LocationCard from "./LocationCard";

const DayAccordion = ({
  day,
  dayPlan,
  isExpanded,
  isCompleted,
  onToggleExpanded,
  onToggleCompleted,
  onAddLocation,
  onRemoveLocation,
  onUpdateLocation,
  onUpdateDayTitle,
  currentUser,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(dayPlan.title || "");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingLocationIndex, setEditingLocationIndex] = useState(null);
  const [editingLocationData, setEditingLocationData] = useState(null);
  const titleInputRef = useRef(null);

  // Update editingTitle when dayPlan.title changes
  useEffect(() => {
    setEditingTitle(dayPlan.title || "");
  }, [dayPlan.title]);

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = () => {
    if (editingTitle.trim() !== (dayPlan.title || "")) {
      onUpdateDayTitle(day, editingTitle);
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setEditingTitle(dayPlan.title || "");
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };
  // Convert locations to array if it's an object
  const locations = Array.isArray(dayPlan.locations)
    ? dayPlan.locations
    : Object.values(dayPlan.locations || {});

  const handleStartNewSchedule = () => {
    setEditingLocationIndex(null);
    setEditingLocationData(null);
    setShowScheduleForm(true);
  };

  const handleEditLocation = (_day, locationIndex, locationData) => {
    setEditingLocationIndex(locationIndex);
    setEditingLocationData(locationData);
    setShowScheduleForm(true);
    if (!isExpanded) {
      onToggleExpanded(day);
    }
  };

  const handleFormDismiss = () => {
    setShowScheduleForm(false);
    setEditingLocationIndex(null);
    setEditingLocationData(null);
  };

  return (
    <div className={`day-accordion ${isCompleted ? 'completed' : ''}`}>
      <div className="day-accordion-header">
        <div
          className="day-accordion-header-left"
          onClick={() => !isEditingTitle && onToggleExpanded(day)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-md)', cursor: isEditingTitle ? 'default' : 'pointer' }}
        >
          <h3>{day}</h3>
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              className="day-title-input"
              placeholder="例: 鎌倉江之島日"
              maxLength="50"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              {dayPlan.title ? (
                <span
                  className="day-title-display"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(true);
                  }}
                  title="點擊編輯標題"
                >
                  {dayPlan.title}
                </span>
              ) : (
                <span
                  className="day-title-placeholder"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(true);
                  }}
                  title="點擊新增標題"
                >
                  (點擊新增標題)
                </span>
              )}
            </>
          )}
          <span className="day-location-count">
            {locations.length} 個地點
          </span>
          <span className="accordion-arrow">
            {isExpanded ? "▲" : "▼"}
          </span>
        </div>
        <div className="day-complete-checkbox-container" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isCompleted || false}
            onChange={() => onToggleCompleted(day)}
            className="day-complete-checkbox"
            title="標記為已完成"
          />
        </div>
      </div>
      {isExpanded && (
        <div className="day-accordion-content">
          {!showScheduleForm ? (
            <button
              type="button"
              className="btn btn-add-schedule"
              onClick={handleStartNewSchedule}
            >
              + 新增行程
            </button>
          ) : (
            <LocationForm
              day={day}
              mode={editingLocationIndex !== null ? "edit" : "create"}
              initialLocation={editingLocationData}
              editingLocationIndex={editingLocationIndex}
              onAddLocation={onAddLocation}
              onUpdateLocation={onUpdateLocation}
              currentUser={currentUser}
              onScheduleSaved={handleFormDismiss}
              onCancel={handleFormDismiss}
            />
          )}
          <div className="locations-list">
            {locations.map((location, index) => (
              <LocationCard
                key={index}
                location={location}
                day={day}
                index={index}
                onRemove={onRemoveLocation}
                onEdit={handleEditLocation}
              />
            ))}
            {locations.length === 0 && (
              <p className="empty-state">尚未新增地點</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayAccordion;
