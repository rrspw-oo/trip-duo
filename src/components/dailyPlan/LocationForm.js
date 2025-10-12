import React, { useState } from "react";
import TagSelector from "../common/TagSelector";
import { TRANSPORTATION_OPTIONS, TIME_PERIOD_OPTIONS, CATEGORY_OPTIONS } from "../../constants/options";

const LocationForm = ({ day, onAddLocation, currentUser }) => {
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [transportation, setTransportation] = useState("");
  const [line, setLine] = useState("");
  const [direction, setDirection] = useState("");
  const [targetStation, setTargetStation] = useState("");
  const [fare, setFare] = useState("");
  const [hasPass, setHasPass] = useState(false);
  const [passName, setPassName] = useState("");
  const [passPrice, setPassPrice] = useState("");
  const [passTime, setPassTime] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddLocation = () => {
    if (locationName && transportation && timePeriod && category) {
      const locationData = {
        id: Date.now(),
        name: locationName,
        address,
        transportation,
        line: line.trim(),
        direction: direction.trim(),
        targetStation: targetStation.trim(),
        fare: fare ? parseFloat(fare) : null,
        hasPass,
        passName: hasPass && passName ? passName.trim() : null,
        passPrice: hasPass && passPrice ? parseFloat(passPrice) : null,
        passTime: hasPass && passTime ? passTime.trim() : null,
        timePeriod,
        category,
        notes,
      };

      // Add creator information if user is logged in
      if (currentUser) {
        locationData.createdBy = {
          email: currentUser.email,
          uid: currentUser.uid,
        };
      }

      onAddLocation(day, locationData);

      // Reset all form fields
      setLocationName("");
      setAddress("");
      setTransportation("");
      setLine("");
      setDirection("");
      setTargetStation("");
      setFare("");
      setHasPass(false);
      setPassName("");
      setPassPrice("");
      setPassTime("");
      setTimePeriod("");
      setCategory("");
      setNotes("");
    }
  };

  return (
    <div className="location-form">
      <div className="form-row">
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="地點名稱"
          className="location-input"
          maxLength="100"
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="地址 (選填)"
          className="location-input"
          maxLength="200"
        />
      </div>
      <div className="form-row">
        <TagSelector
          value={transportation}
          onChange={setTransportation}
          options={TRANSPORTATION_OPTIONS}
          placeholder="請選擇交通方式"
          label="交通路線"
        />
      </div>

      {transportation && (transportation === "地鐵" || transportation === "巴士") && (
        <>
          <div className="form-row form-row-two">
            <input
              type="text"
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder="線別 (例: 千代田線)"
              className="location-input"
              maxLength="50"
            />
            <input
              type="text"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              placeholder="終點站/方向 (例: 往北綾瀨方向)"
              className="location-input"
              maxLength="50"
            />
          </div>
          <div className="form-row form-row-two">
            <input
              type="text"
              value={targetStation}
              onChange={(e) => setTargetStation(e.target.value)}
              placeholder="目標站別 (例: 北千住站)"
              className="location-input"
              maxLength="50"
            />
            <input
              type="number"
              value={fare}
              onChange={(e) => setFare(e.target.value)}
              placeholder="票價 (選填)"
              className="location-input"
              min="0"
              step="1"
            />
          </div>

          <div className="form-row pass-toggle-row">
            <label className="pass-toggle-label">
              <input
                type="checkbox"
                checked={hasPass}
                onChange={(e) => setHasPass(e.target.checked)}
                className="pass-checkbox"
              />
              <span>使用周遊券</span>
            </label>
          </div>

          {hasPass && (
            <div className="pass-details">
              <div className="form-row">
                <input
                  type="text"
                  value={passName}
                  onChange={(e) => setPassName(e.target.value)}
                  placeholder="周遊券名稱 (例: 東京地鐵24小時券)"
                  className="location-input"
                  maxLength="50"
                />
              </div>
              <div className="form-row form-row-two">
                <input
                  type="number"
                  value={passPrice}
                  onChange={(e) => setPassPrice(e.target.value)}
                  placeholder="周遊券票價"
                  className="location-input"
                  min="0"
                  step="1"
                />
                <input
                  type="text"
                  value={passTime}
                  onChange={(e) => setPassTime(e.target.value)}
                  placeholder="使用時間 (例: 24小時)"
                  className="location-input"
                  maxLength="30"
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="form-row">
        <TagSelector
          value={timePeriod}
          onChange={setTimePeriod}
          options={TIME_PERIOD_OPTIONS}
          placeholder="請選擇時段"
          label="時段"
        />
      </div>
      <div className="form-row">
        <TagSelector
          value={category}
          onChange={setCategory}
          options={CATEGORY_OPTIONS}
          placeholder="請選擇分類"
          label="分類"
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="備註 (選填)"
          className="location-input"
        />
      </div>
      <button onClick={handleAddLocation} className="btn btn-add-location">
        新增地點
      </button>
    </div>
  );
};

export default LocationForm;
