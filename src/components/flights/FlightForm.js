import React from "react";
import CustomDropdown from "../common/CustomDropdown";
import { AIRLINE_OPTIONS } from "../../constants/options";

const FlightForm = ({ newFlight, setNewFlight, onAddFlight, onAddSuccess, startDate, endDate }) => {
  // Helper function to extract time from datetime string
  const getTimePart = (datetime) => datetime ? datetime.split('T')[1] || '' : '';

  const handleAddFlight = () => {
    // Call the add function
    onAddFlight();

    // Check if all required fields are filled to determine success
    if (
      newFlight.airline &&
      newFlight.outboundDeparture &&
      newFlight.outboundArrival &&
      newFlight.returnDeparture &&
      newFlight.returnArrival &&
      newFlight.price
    ) {
      // If successful, call the success callback
      if (onAddSuccess) {
        onAddSuccess();
      }
    }
  };

  const handleOutboundDepartureTimeChange = (e) => {
    const newTime = e.target.value;
    const newDeparture = startDate + 'T' + newTime;
    setNewFlight({ ...newFlight, outboundDeparture: newDeparture });
  };

  const handleOutboundArrivalTimeChange = (e) => {
    const newTime = e.target.value;
    const newArrival = startDate + 'T' + newTime;
    setNewFlight({ ...newFlight, outboundArrival: newArrival });
  };

  const handleReturnDepartureTimeChange = (e) => {
    const newTime = e.target.value;
    const newDeparture = endDate + 'T' + newTime;
    setNewFlight({ ...newFlight, returnDeparture: newDeparture });
  };

  const handleReturnArrivalTimeChange = (e) => {
    const newTime = e.target.value;
    const newArrival = endDate + 'T' + newTime;
    setNewFlight({ ...newFlight, returnArrival: newArrival });
  };

  return (
    <div className="flight-form">
      <div className="flight-form-section outbound-section">
        <div className="flight-form-header">
          <span className="flight-type-tag outbound">去程</span>
          <input
            type="date"
            value={startDate || ''}
            disabled
            placeholder="yyyy/mm/dd"
            className="synced-date header-date"
          />
        </div>
        <div className="flight-time-inputs">
          <div className="time-input-group">
            <label>起飛時間</label>
            <input
              type="time"
              value={getTimePart(newFlight.outboundDeparture)}
              onChange={handleOutboundDepartureTimeChange}
              placeholder="--:--"
            />
          </div>
          <div className="time-input-group">
            <label>抵達時間</label>
            <input
              type="time"
              value={getTimePart(newFlight.outboundArrival)}
              onChange={handleOutboundArrivalTimeChange}
              placeholder="--:--"
            />
          </div>
        </div>
        <div className="flight-comment-input">
          <label>去程備註</label>
          <textarea
            placeholder="例如：預計提前2小時到機場、搭乘捷運前往..."
            value={newFlight.outboundComment}
            onChange={(e) =>
              setNewFlight({ ...newFlight, outboundComment: e.target.value })
            }
            maxLength="500"
            rows="2"
          />
        </div>
      </div>

      <div className="flight-form-section return-section">
        <div className="flight-form-header">
          <span className="flight-type-tag return">回程</span>
          <input
            type="date"
            value={endDate || ''}
            disabled
            placeholder="yyyy/mm/dd"
            className="synced-date header-date"
          />
        </div>
        <div className="flight-time-inputs">
          <div className="time-input-group">
            <label>起飛時間</label>
            <input
              type="time"
              value={getTimePart(newFlight.returnDeparture)}
              onChange={handleReturnDepartureTimeChange}
              placeholder="--:--"
            />
          </div>
          <div className="time-input-group">
            <label>抵達時間</label>
            <input
              type="time"
              value={getTimePart(newFlight.returnArrival)}
              onChange={handleReturnArrivalTimeChange}
              placeholder="--:--"
            />
          </div>
        </div>
        <div className="flight-comment-input">
          <label>回程備註</label>
          <textarea
            placeholder="例如：預計提前3小時到機場、注意退稅時間..."
            value={newFlight.returnComment}
            onChange={(e) =>
              setNewFlight({ ...newFlight, returnComment: e.target.value })
            }
            maxLength="500"
            rows="2"
          />
        </div>
      </div>

      <div className="flight-form-footer">
        <CustomDropdown
          value={newFlight.airline}
          onChange={(value) => setNewFlight({ ...newFlight, airline: value })}
          options={AIRLINE_OPTIONS}
          placeholder="航空公司"
        />
        <input
          placeholder="票價"
          value={newFlight.price}
          onChange={(e) =>
            setNewFlight({ ...newFlight, price: e.target.value })
          }
          maxLength="20"
        />
        <button onClick={handleAddFlight} className="btn">
          新增航班
        </button>
      </div>
    </div>
  );
};

export default FlightForm;
