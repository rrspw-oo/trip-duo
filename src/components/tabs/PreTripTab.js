import React from "react";
import TravelTimeTab from "./TravelTimeTab";
import FlightTab from "./FlightTab";
import AccommodationTab from "../accommodations/AccommodationTab";
import PreTripItemsTab from "../preTripItems/PreTripItemsTab";

const PreTripTab = ({
  activePreTripSubTab,

  // Travel Time props
  startDate,
  endDate,
  totalDays,
  setStartDate,
  setEndDate,
  onCalculateDays,

  // Flight props
  flights,
  newFlight,
  setNewFlight,
  editingFlightId,
  editedFlight,
  onAddFlight,
  onStartEditFlight,
  onSaveEditFlight,
  onCancelEditFlight,
  onDeleteFlight,
  onUpdateEditedFlightField,
  onFlightVote,
  onAddFlightComment,
  onDeleteFlightComment,
  currentUser,
  selectedFlightId,
  onSelectFlight,
  onConfirmFlight,
  confirmedFlight,
  onUpdateConfirmedFlight,
  onClearConfirmedFlight,

  // Accommodation props
  confirmedAccommodation,
  onSaveConfirmedAccommodation,
  onClearConfirmedAccommodation,

  // Pre-trip items props
  preTripItems,
  newPreTripItem,
  setNewPreTripItem,
  onAddPreTripItem,
  onToggleItemCheck,
  onDeletePreTripItem,
  onUpdatePreTripItem,
  allUsers,
  userMetadata,
}) => {
  return (
    <section className="tab-content pre-trip-tab-content">
      <div className="pre-trip-shell">
        <div className="pre-trip-sub-tab-content">
          {activePreTripSubTab === 1 && (
            <TravelTimeTab
              startDate={startDate}
              endDate={endDate}
              totalDays={totalDays}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCalculateDays={onCalculateDays}
            />
          )}

          {activePreTripSubTab === 2 && (
            <FlightTab
              flights={flights}
              newFlight={newFlight}
              setNewFlight={setNewFlight}
              editingId={editingFlightId}
              editedFlight={editedFlight}
              onAddFlight={onAddFlight}
              onStartEdit={onStartEditFlight}
              onSaveEdit={onSaveEditFlight}
              onCancelEdit={onCancelEditFlight}
              onDeleteFlight={onDeleteFlight}
              onUpdateEditedField={onUpdateEditedFlightField}
              onVote={onFlightVote}
              onAddComment={onAddFlightComment}
              onDeleteComment={onDeleteFlightComment}
              currentUser={currentUser}
              startDate={startDate}
              endDate={endDate}
              selectedFlightId={selectedFlightId}
              onSelectFlight={onSelectFlight}
              onConfirmFlight={onConfirmFlight}
              confirmedFlight={confirmedFlight}
              onUpdateConfirmedFlight={onUpdateConfirmedFlight}
              onClearConfirmedFlight={onClearConfirmedFlight}
            />
          )}

          {activePreTripSubTab === 3 && (
            <AccommodationTab
              confirmedAccommodation={confirmedAccommodation}
              onSaveConfirmedAccommodation={onSaveConfirmedAccommodation}
              onClearConfirmedAccommodation={onClearConfirmedAccommodation}
            />
          )}

          {activePreTripSubTab === 4 && (
            <PreTripItemsTab
              preTripItems={preTripItems}
              newPreTripItem={newPreTripItem}
              setNewPreTripItem={setNewPreTripItem}
              onAddPreTripItem={onAddPreTripItem}
              onToggleItemCheck={onToggleItemCheck}
              onDeletePreTripItem={onDeletePreTripItem}
              onUpdatePreTripItem={onUpdatePreTripItem}
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

export default PreTripTab;
