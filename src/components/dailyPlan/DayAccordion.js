import React from "react";
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
}) => {
  // Convert locations to array if it's an object
  const locations = Array.isArray(dayPlan.locations)
    ? dayPlan.locations
    : Object.values(dayPlan.locations || {});

  return (
    <div className={`day-accordion ${isCompleted ? 'completed' : ''}`}>
      <div className="day-accordion-header">
        <div
          className="day-accordion-header-left"
          onClick={() => onToggleExpanded(day)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-md)', cursor: 'pointer' }}
        >
          <h3>{day}</h3>
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
          <LocationForm day={day} onAddLocation={onAddLocation} />
          <div className="locations-list">
            {locations.map((location, index) => (
              <LocationCard
                key={index}
                location={location}
                day={day}
                index={index}
                onRemove={onRemoveLocation}
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
