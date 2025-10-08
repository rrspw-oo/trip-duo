import React from "react";
import TagSelector from "../common/TagSelector";
import { AMENITIES_OPTIONS } from "../../constants/options";

const AccommodationForm = ({ newAccommodation, setNewAccommodation, onAddAccommodation, onAddSuccess, startDate, endDate }) => {
  // Helper function to extract time from datetime string
  const getTimePart = (datetime) => datetime ? datetime.split('T')[1] || '' : '';

  const handleAmenitiesChange = (selectedAmenities) => {
    setNewAccommodation({ ...newAccommodation, amenities: selectedAmenities });
  };

  const handleCheckInTimeChange = (e) => {
    const newTime = e.target.value;
    const newCheckIn = startDate + 'T' + newTime;
    setNewAccommodation({ ...newAccommodation, checkIn: newCheckIn });
  };

  const handleCheckOutTimeChange = (e) => {
    const newTime = e.target.value;
    const newCheckOut = endDate + 'T' + newTime;
    setNewAccommodation({ ...newAccommodation, checkOut: newCheckOut });
  };

  const handleAddAccommodation = () => {
    // Call the add function
    onAddAccommodation();

    // Check if all required fields are filled to determine success
    if (
      newAccommodation.name &&
      newAccommodation.checkIn &&
      newAccommodation.checkOut &&
      newAccommodation.price
    ) {
      // If successful, call the success callback
      if (onAddSuccess) {
        onAddSuccess();
      }
    }
  };

  return (
    <div className="accommodation-form">
      <div className="form-section">
        <div className="form-row">
          <div className="input-group">
            <label>住宿名稱</label>
            <input
              type="text"
              placeholder="請輸入住宿名稱"
              value={newAccommodation.name}
              onChange={(e) => setNewAccommodation({ ...newAccommodation, name: e.target.value })}
              className="accommodation-input"
              maxLength="100"
            />
          </div>
        </div>

        <div className="form-row form-row-two">
          <div className="datetime-input-group">
            <label>Check-in</label>
            <div className="datetime-split">
              <input
                type="date"
                value={startDate || ''}
                disabled
                className="synced-date"
              />
              <input
                type="time"
                value={getTimePart(newAccommodation.checkIn)}
                onChange={handleCheckInTimeChange}
                placeholder="--:--"
              />
            </div>
          </div>
          <div className="datetime-input-group">
            <label>Check-out</label>
            <div className="datetime-split">
              <input
                type="date"
                value={endDate || ''}
                disabled
                className="synced-date"
              />
              <input
                type="time"
                value={getTimePart(newAccommodation.checkOut)}
                onChange={handleCheckOutTimeChange}
                placeholder="--:--"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>住宿地址</label>
            <input
              type="text"
              placeholder="請輸入住宿地址"
              value={newAccommodation.address}
              onChange={(e) => setNewAccommodation({ ...newAccommodation, address: e.target.value })}
              className="accommodation-input"
              maxLength="200"
            />
          </div>
        </div>

        <div className="form-row form-row-two">
          <div className="input-group">
            <label>附近車站</label>
            <input
              type="text"
              placeholder="請輸入附近車站"
              value={newAccommodation.nearbyStation}
              onChange={(e) => setNewAccommodation({ ...newAccommodation, nearbyStation: e.target.value })}
              className="accommodation-input"
              maxLength="100"
            />
          </div>
          <div className="input-group">
            <label>住宿價格</label>
            <input
              type="text"
              placeholder="請輸入住宿價格"
              value={newAccommodation.price}
              onChange={(e) => setNewAccommodation({ ...newAccommodation, price: e.target.value })}
              className="accommodation-input"
              maxLength="20"
            />
          </div>
        </div>

        <div className="form-row">
          <TagSelector
            value={newAccommodation.amenities || []}
            onChange={handleAmenitiesChange}
            options={AMENITIES_OPTIONS}
            placeholder="請選擇備品"
            label="住宿提供"
            multiple={true}
          />
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>備註</label>
            <textarea
              placeholder="備註 (選填)"
              value={newAccommodation.notes}
              onChange={(e) => setNewAccommodation({ ...newAccommodation, notes: e.target.value })}
              className="accommodation-textarea"
              maxLength="500"
              rows="3"
            />
          </div>
        </div>

        <button onClick={handleAddAccommodation} className="btn btn-large">
          新增住宿
        </button>
      </div>
    </div>
  );
};

export default AccommodationForm;
