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

  const handleAddressClick = () => {
    if (accommodation.address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(accommodation.address)}`;
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const checkInFormatted = formatDateTime(accommodation.checkIn);
  const checkOutFormatted = formatDateTime(accommodation.checkOut);
  const stayDuration = calculateDuration(accommodation.checkIn, accommodation.checkOut);

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
        {(accommodation.address || accommodation.nearbyStation) && (
          <div className="ticket-location-row">
            {accommodation.address && (
              <div className="ticket-detail-item clickable" onClick={handleAddressClick}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="detail-icon">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                </svg>
                <span className="detail-text">{accommodation.address}</span>
              </div>
            )}

            {accommodation.nearbyStation && (
              <div className="ticket-detail-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="detail-icon">
                  <path d="M12 2C8 2 6 3 6 6v8c0 2.21 1.79 4 4 4h4c2.21 0 4-1.79 4-4V6c0-3-2-4-6-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 11H7V7h10v4zM7 19l-1 1.5v.5h12v-.5L17 19H7z"/>
                </svg>
                <span className="detail-text">{accommodation.nearbyStation}</span>
              </div>
            )}
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
