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
  onUpdateLocation,
  onUpdateDayTitle,
  startDate,

  // Shopping list props
  shoppingListItems,
  newShoppingItem,
  setNewShoppingItem,
  onAddShoppingItem,
  onToggleShoppingItemCheck,
  onDeleteShoppingItem,
  onUpdateShoppingItem,
  allUsers,
  currentUser,
  userMetadata,
}) => {
  const [activeDailyPlanSubTab, setActiveDailyPlanSubTab] = useState(1);

  return (
    <section className="tab-content pre-trip-tab-content">
      <div className="pre-trip-shell">
        <nav className="pre-trip-sub-tabs" aria-label="每日規劃分類">
          {DAILY_PLAN_SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`pre-trip-sub-tab ${
                activeDailyPlanSubTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveDailyPlanSubTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

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
              onUpdateLocation={onUpdateLocation}
              onUpdateDayTitle={onUpdateDayTitle}
              startDate={startDate}
              currentUser={currentUser}
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
              onUpdateShoppingItem={onUpdateShoppingItem}
              allUsers={allUsers}
              currentUser={currentUser}
              userMetadata={userMetadata}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default DailyPlanTab;
