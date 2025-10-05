import React from "react";
import DayAccordion from "../dailyPlan/DayAccordion";

const DailyPlanTab = ({
  totalDays,
  dailyPlans,
  skippedDays,
  expandedDays,
  onToggleDayExpanded,
  onToggleDayCompleted,
  onAddLocation,
  onRemoveLocation,
  startDate
}) => {
  // Generate all days based on totalDays
  const allDays = Array.from({ length: totalDays }, (_, i) => `Day ${i + 1}`);

  // Helper function to check if a day is in the past
  const isDayPast = (dayString) => {
    if (!startDate) return false;
    const dayNum = parseInt(dayString.replace("Day ", ""));
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + dayNum - 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate < today;
  };

  // Sort days: incomplete and future first, then completed/past (both in numerical order)
  const sortedDays = allDays.sort((a, b) => {
    const numA = parseInt(a.replace("Day ", ""));
    const numB = parseInt(b.replace("Day ", ""));

    const isCompletedA = skippedDays[a] || isDayPast(a);
    const isCompletedB = skippedDays[b] || isDayPast(b);

    if (isCompletedA !== isCompletedB) {
      return isCompletedA ? 1 : -1;
    }

    return numA - numB;
  });

  const visibleDays = sortedDays;

  return (
    <div className="tab-content">
      <h2>每日規劃</h2>
      {totalDays > 0 ? (
        visibleDays.map((day) => (
          <DayAccordion
            key={day}
            day={day}
            dayPlan={dailyPlans[day] || { locations: {} }}
            isExpanded={expandedDays[day]}
            isCompleted={skippedDays[day] || isDayPast(day)}
            onToggleExpanded={onToggleDayExpanded}
            onToggleCompleted={onToggleDayCompleted}
            onAddLocation={onAddLocation}
            onRemoveLocation={onRemoveLocation}
          />
        ))
      ) : (
        <p>請先設定旅行時間以生成每日規劃</p>
      )}
    </div>
  );
};

export default DailyPlanTab;
