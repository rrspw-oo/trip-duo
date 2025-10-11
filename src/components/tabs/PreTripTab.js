import React, { useState } from "react";
import TravelTimeTab from "./TravelTimeTab";
import FlightTab from "./FlightTab";
import AccommodationTab from "../accommodations/AccommodationTab";
import PreTripItemsTab from "../preTripItems/PreTripItemsTab";
import { PRETRIP_SUB_TABS } from "../../constants/options";

const PreTripTab = ({
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
  accommodations,
  newAccommodation,
  setNewAccommodation,
  editingAccommodationId,
  editedAccommodation,
  onAddAccommodation,
  onStartEditAccommodation,
  onSaveEditAccommodation,
  onCancelEditAccommodation,
  onDeleteAccommodation,
  onUpdateEditedAccommodationField,
  onAccommodationVote,
  onAddAccommodationComment,
  onDeleteAccommodationComment,
  selectedAccommodationId,
  onSelectAccommodation,
  onConfirmAccommodation,
  confirmedAccommodation,
  onUpdateConfirmedAccommodation,
  onClearConfirmedAccommodation,

  // Pre-trip items props
  preTripItems,
  newPreTripItem,
  setNewPreTripItem,
  onAddPreTripItem,
  onToggleItemCheck,
  onDeletePreTripItem,
  allUsers,
  userMetadata,
}) => {
  const [activePreTripSubTab, setActivePreTripSubTab] = useState(1);

  return (
    <div className="tab-content pre-trip-tab-content">
      <h2>行前安排</h2>

      {/* Pre-trip sub-tabs navigation */}
      <div className="pre-trip-sub-tabs">
        {PRETRIP_SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`pre-trip-sub-tab ${activePreTripSubTab === tab.id ? "active" : ""}`}
            onClick={() => setActivePreTripSubTab(tab.id)}
          >
            <span className="desktop-label">{tab.label}</span>
            <span className="mobile-label">{tab.mobileLabel}</span>
          </button>
        ))}
      </div>

      {/* Pre-trip sub-tab content */}
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
            accommodations={accommodations}
            newAccommodation={newAccommodation}
            setNewAccommodation={setNewAccommodation}
            editingId={editingAccommodationId}
            editedAccommodation={editedAccommodation}
            onAddAccommodation={onAddAccommodation}
            onStartEdit={onStartEditAccommodation}
            onSaveEdit={onSaveEditAccommodation}
            onCancelEdit={onCancelEditAccommodation}
            onDeleteAccommodation={onDeleteAccommodation}
            onUpdateEditedField={onUpdateEditedAccommodationField}
            onVote={onAccommodationVote}
            onAddComment={onAddAccommodationComment}
            onDeleteComment={onDeleteAccommodationComment}
            currentUser={currentUser}
            startDate={startDate}
            endDate={endDate}
            selectedAccommodationId={selectedAccommodationId}
            onSelectAccommodation={onSelectAccommodation}
            onConfirmAccommodation={onConfirmAccommodation}
            confirmedAccommodation={confirmedAccommodation}
            onUpdateConfirmedAccommodation={onUpdateConfirmedAccommodation}
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
            allUsers={allUsers}
            currentUser={currentUser}
            userMetadata={userMetadata}
          />
        )}
      </div>
    </div>
  );
};

export default PreTripTab;
