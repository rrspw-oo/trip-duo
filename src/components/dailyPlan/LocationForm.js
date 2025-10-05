import React, { useState } from "react";
import CustomDropdown from "../common/CustomDropdown";
import { TRANSPORTATION_OPTIONS, TIME_PERIOD_OPTIONS, CATEGORY_OPTIONS } from "../../constants/options";

const LocationForm = ({ day, onAddLocation }) => {
  const [locationName, setLocationName] = useState("");
  const [transportation, setTransportation] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddLocation = () => {
    if (locationName && transportation && timePeriod && category) {
      onAddLocation(day, {
        id: Date.now(),
        name: locationName,
        transportation,
        timePeriod,
        category,
        notes,
      });
      setLocationName("");
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
      <div className="form-row form-row-three">
        <CustomDropdown
          value={transportation}
          onChange={setTransportation}
          options={TRANSPORTATION_OPTIONS}
          placeholder="交通路線"
        />
        <CustomDropdown
          value={timePeriod}
          onChange={setTimePeriod}
          options={TIME_PERIOD_OPTIONS}
          placeholder="時段"
        />
        <CustomDropdown
          value={category}
          onChange={setCategory}
          options={CATEGORY_OPTIONS}
          placeholder="分類"
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
