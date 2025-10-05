import React from "react";
import DOMPurify from "dompurify";

const LocationCard = ({ location, day, index, onRemove }) => {
  return (
    <div className="location-card">
      <div className="location-card-header">
        <h4 className="location-name" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(location.name) }} />
        <button
          onClick={() => onRemove(day, index)}
          className="btn-delete-location"
        >
          ✕
        </button>
      </div>
      <div className="location-tags">
        <span className="tag tag-transportation">{location.transportation}</span>
        <span className="tag tag-time">{location.timePeriod}</span>
        <span className="tag tag-category">{location.category}</span>
      </div>
      {location.notes && (
        <div className="location-notes">
          <small>{location.notes}</small>
        </div>
      )}
    </div>
  );
};

export default LocationCard;
