import React, { useState } from "react";
import DailyItineraryTab from "./DailyItineraryTab";
import ShoppingListTab from "../shoppingList/ShoppingListTab";
import { DAILY_PLAN_SUB_TABS } from "../../constants/options";

const DailyPlanTab = ({
  // Daily itinerary props
  totalDays,
  dailyPlans,
  skippedDays,
  expandedDays,
  onToggleDayExpanded,
  onToggleDayCompleted,
  onAddLocation,
  onRemoveLocation,
  startDate,

  // Shopping list props
  shoppingListItems,
  newShoppingItem,
  setNewShoppingItem,
  onAddShoppingItem,
  onToggleShoppingItemCheck,
  onDeleteShoppingItem,
  currentUser,
  userMetadata
}) => {
  const [activeDailyPlanSubTab, setActiveDailyPlanSubTab] = useState(1);

  return (
    <div className="tab-content pre-trip-tab-content">
      <h2>每日規劃</h2>

      {/* Daily plan sub-tabs navigation */}
      <div className="pre-trip-sub-tabs">
        {DAILY_PLAN_SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`pre-trip-sub-tab ${activeDailyPlanSubTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveDailyPlanSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daily plan sub-tab content */}
      <div className="pre-trip-sub-tab-content">
        {activeDailyPlanSubTab === 1 && (
          <DailyItineraryTab
            totalDays={totalDays}
            dailyPlans={dailyPlans}
            skippedDays={skippedDays}
            expandedDays={expandedDays}
            onToggleDayExpanded={onToggleDayExpanded}
            onToggleDayCompleted={onToggleDayCompleted}
            onAddLocation={onAddLocation}
            onRemoveLocation={onRemoveLocation}
            startDate={startDate}
          />
        )}

        {activeDailyPlanSubTab === 2 && (
          <ShoppingListTab
            shoppingListItems={shoppingListItems}
            newShoppingItem={newShoppingItem}
            setNewShoppingItem={setNewShoppingItem}
            onAddShoppingItem={onAddShoppingItem}
            onToggleItemCheck={onToggleShoppingItemCheck}
            onDeleteShoppingItem={onDeleteShoppingItem}
            currentUser={currentUser}
            userMetadata={userMetadata}
          />
        )}
      </div>
    </div>
  );
};

export default DailyPlanTab;
