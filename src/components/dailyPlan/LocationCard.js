import React from "react";
import DOMPurify from "dompurify";

const LocationCard = ({ location, day, index, onRemove }) => {
  const handleAddressClick = () => {
    if (location.address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

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
      {location.address && (
        <div className="location-address" onClick={handleAddressClick}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="location-icon">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
          </svg>
          <span className="address-text">{location.address}</span>
        </div>
      )}

      <div className="location-tags">
        <span className="tag tag-transportation">{location.transportation}</span>
        <span className="tag tag-time">{location.timePeriod}</span>
        <span className="tag tag-category">{location.category}</span>
      </div>

      {(location.line || location.direction || location.targetStation || location.fare !== null) && (
        <div className="location-transport-details">
          {(location.line || location.direction || location.targetStation) && (
            <div className="transport-route">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="route-icon">
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
              </svg>
              <span className="route-text">
                {location.line && <span className="station-name">{location.line}</span>}
                {location.line && location.direction && <span className="route-separator"> / </span>}
                {location.direction && <span className="station-name">{location.direction}</span>}
                {(location.line || location.direction) && location.targetStation && <span className="route-arrow"> → </span>}
                {location.targetStation && <span className="station-name">{location.targetStation}</span>}
              </span>
            </div>
          )}
          {location.fare !== null && location.fare !== undefined && (
            <div className="transport-fare">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="fare-icon">
                <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
              </svg>
              <span className="fare-text">¥{location.fare.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {location.hasPass && (
        <div className="location-pass-info">
          <div className="pass-badge">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="pass-icon">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
            <span>{location.passName || '周遊券'}</span>
          </div>
          {(location.passPrice || location.passTime) && (
            <div className="pass-details-display">
              {location.passPrice && <span className="pass-price">¥{location.passPrice.toLocaleString()}</span>}
              {location.passTime && <span className="pass-time">{location.passTime}</span>}
            </div>
          )}
        </div>
      )}
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
