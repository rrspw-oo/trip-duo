import React from "react";

const ConfirmedAccommodationTicket = ({ accommodation }) => {
  // Calculate stay duration
  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "---";
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffMs = checkOutDate - checkInDate;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) {
      return `${days}天 ${hours}小時`;
    }
    return `${hours}小時`;
  };

  // Format date and time
  const formatDateTime = (datetime) => {
    if (!datetime) return { date: '', time: '', weekday: '' };
    const dt = new Date(datetime);
    const date = dt.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric'
    });
    const time = dt.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const weekday = dt.toLocaleDateString('zh-TW', {
      weekday: 'short'
    });
    return { date, time, weekday };
  };

  const openMapsWindow = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAddressClick = () => {
    if (accommodation.mapsUrl) {
      openMapsWindow(accommodation.mapsUrl);
      return;
    }
    if (accommodation.address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(accommodation.address)}`;
      openMapsWindow(mapsUrl);
    }
  };

  const checkInFormatted = formatDateTime(accommodation.checkIn);
  const checkOutFormatted = formatDateTime(accommodation.checkOut);
  const stayDuration = calculateDuration(accommodation.checkIn, accommodation.checkOut);
  const stationLabel = accommodation.subwayStation || accommodation.nearbyStation || "";
  const subwayLine = accommodation.subwayLine || "";
  const arrivalMethods = Array.isArray(accommodation.arrivalMethods)
    ? accommodation.arrivalMethods
    : Object.values(accommodation.arrivalMethods || {});

  return (
    <div className="confirmed-ticket-container">
      <div className="accommodation-name-header">{accommodation.name || '住宿名稱'}</div>

      {/* Combined Ticket Card */}
      <div className="ticket-card combined-ticket accommodation-ticket">
        {/* Check-in Section */}
        <div className="ticket-section check-in-section">
          <div className="ticket-label-top">Check-in</div>
          <div className="ticket-route-compact">
            <div className="ticket-location-compact accommodation-time">
              <div className="ticket-time-compact">{checkInFormatted.time}</div>
              <div className="ticket-date-with-weekday">{checkInFormatted.date} （{checkInFormatted.weekday}）</div>
            </div>
          </div>
        </div>

        <div className="ticket-divider"></div>

        {/* Check-out Section */}
        <div className="ticket-section check-out-section">
          <div className="ticket-label-top">Check-out</div>
          <div className="ticket-route-compact">
            <div className="ticket-location-compact accommodation-time">
              <div className="ticket-time-compact">{checkOutFormatted.time}</div>
              <div className="ticket-date-with-weekday">{checkOutFormatted.date} （{checkOutFormatted.weekday}）</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="accommodation-ticket-details">
        {(accommodation.address || stationLabel || accommodation.mapsUrl) && (
          <div className="ticket-location-row">
            {accommodation.address && (
              <div className="ticket-detail-item clickable" onClick={handleAddressClick}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="detail-icon">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                </svg>
                <span className="detail-text">{accommodation.address}</span>
              </div>
            )}

            {stationLabel && (
              <div className="ticket-detail-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="detail-icon">
                  <path d="M12 2C8 2 6 3 6 6v8c0 2.21 1.79 4 4 4h4c2.21 0 4-1.79 4-4V6c0-3-2-4-6-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 11H7V7h10v4zM7 19l-1 1.5v.5h12v-.5L17 19H7z"/>
                </svg>
                <div className="station-label-group">
                  {subwayLine && <span className="subway-line-pill">{subwayLine}</span>}
                  <span className="detail-text">{stationLabel}</span>
                </div>
              </div>
            )}
            {accommodation.mapsUrl && (
              <div className="ticket-detail-item clickable" onClick={() => openMapsWindow(accommodation.mapsUrl)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="detail-icon">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="detail-text">開啟 Google 地圖</span>
              </div>
            )}
          </div>
        )}

        {arrivalMethods.length > 0 && (
          <div className="arrival-ticket-list">
            <div className="section-label">抵達方式</div>
            <ul>
              {arrivalMethods.map((method, index) => (
                <li key={method.id || `arrival-${index}`}>
                  <div className="arrival-entry">
                    <div className="arrival-number">{index + 1}</div>
                    <div className="arrival-columns">
                      <div className="arrival-col">
                        <span className="arrival-label">線別</span>
                        <span className="arrival-value">{method.line || "—"}</span>
                      </div>
                      <div className="arrival-col">
                        <span className="arrival-label">站別</span>
                        <span className="arrival-value">{method.station || "—"}</span>
                      </div>
                      <div className="arrival-col">
                        <span className="arrival-label">票價 (JPY)</span>
                        <span className="arrival-value">{method.fare || "—"}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {accommodation.amenities && accommodation.amenities.length > 0 && (
          <div className="ticket-detail-section">
            <div className="section-label">住宿提供</div>
            <div className="amenities-tags-compact">
              {accommodation.amenities.map((amenity, index) => (
                <span key={index} className="tag tag-amenity-compact">{amenity}</span>
              ))}
            </div>
          </div>
        )}

        {accommodation.notes && (
          <div className="ticket-detail-section notes-section">
            <div className="section-label">備註</div>
            <span className="detail-text notes-text">{accommodation.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmedAccommodationTicket;
