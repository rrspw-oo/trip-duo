import React, { useState } from "react";
import TagSelector from "../common/TagSelector";
import { TRANSPORTATION_OPTIONS, TIME_PERIOD_OPTIONS, CATEGORY_OPTIONS } from "../../constants/options";

const LocationForm = ({ day, onAddLocation }) => {
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [transportation, setTransportation] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddLocation = () => {
    if (locationName && transportation && timePeriod && category) {
      onAddLocation(day, {
        id: Date.now(),
        name: locationName,
        address,
        transportation,
        timePeriod,
        category,
        notes,
      });
      setLocationName("");
      setAddress("");
      setTransportation("");
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
