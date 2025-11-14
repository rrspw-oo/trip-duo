import React, { useMemo } from "react";
import { differenceInDays } from "date-fns";

const TravelTimeTab = ({
  startDate,
  endDate,
  totalDays,
  setStartDate,
  setEndDate,
  onCalculateDays,
}) => {
  const hasDateChanged = useMemo(() => {
    if (!startDate || !endDate || totalDays === 0) return true;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) return true;
    const calculatedDays = differenceInDays(end, start) + 1;
    return calculatedDays !== totalDays;
  }, [startDate, endDate, totalDays]);

  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <label>開始日期:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>結束日期:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={onCalculateDays}
        className="btn"
        disabled={!hasDateChanged}
        style={{
          opacity: hasDateChanged ? 1 : 0.5,
          cursor: hasDateChanged ? "pointer" : "not-allowed",
        }}
      >
        計算天數
      </button>
      {totalDays > 0 && (
        <div className="travel-duration-result">
          <div className="duration-content">
            <span className="duration-label">旅行天數</span>
            <span className="duration-value">{totalDays} 天</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TravelTimeTab;
