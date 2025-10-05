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
      {location.createdBy && (
        <div className="location-creator">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
          </svg>
          <span className="creator-email">{location.createdBy.email}</span>
        </div>
      )}
      {location.notes && (
        <div className="location-notes">
          <small>{location.notes}</small>
        </div>
      )}
    </div>
  );
};

export default LocationCard;
