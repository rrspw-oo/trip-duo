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
  onRemoveLocation
}) => {
  // Sort days: incomplete first, then completed (both in numerical order)
  const sortedDays = Object.keys(dailyPlans).sort((a, b) => {
    const numA = parseInt(a.replace("Day ", ""));
    const numB = parseInt(b.replace("Day ", ""));

    const isCompletedA = skippedDays[a];
    const isCompletedB = skippedDays[b];

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
            isCompleted={skippedDays[day]}
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
