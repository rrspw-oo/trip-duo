import React, { useMemo } from "react";
import { differenceInDays } from "date-fns";

const TravelTimeTab = ({
  startDate,
  endDate,
  totalDays,
  setStartDate,
  setEndDate,
  onCalculateDays
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
      <h2>旅行時間</h2>
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
      <button
        onClick={onCalculateDays}
        className="btn"
        disabled={!hasDateChanged}
        style={{
          opacity: hasDateChanged ? 1 : 0.5,
          cursor: hasDateChanged ? 'pointer' : 'not-allowed'
        }}
      >
        計算天數
      </button>
      {totalDays > 0 && <p className="result">總共 {totalDays} 天</p>}
    </>
  );
};

export default TravelTimeTab;
