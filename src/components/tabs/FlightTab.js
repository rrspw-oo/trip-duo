import React, { useState } from "react";
import FlightForm from "../flights/FlightForm";
import FlightCard from "../flights/FlightCard";
import { FLIGHT_SUB_TABS } from "../../constants/options";

const FlightTab = ({
  flights,
  newFlight,
  setNewFlight,
  editingId,
  editedFlight,
  onAddFlight,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteFlight,
  onUpdateEditedField,
  onVote,
  onAddComment,
  onDeleteComment,
  currentUser,
  startDate,
  endDate
}) => {
  const [activeSubTab, setActiveSubTab] = useState(1);

  return (
    <div className="tab-content">
      <h2>機票確認</h2>

      {/* Sub-tabs navigation */}
      <div className="sub-tabs">
        {FLIGHT_SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`sub-tab ${activeSubTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      <div className="sub-tab-content">
        {activeSubTab === 1 && (
          <FlightForm
            newFlight={newFlight}
            setNewFlight={setNewFlight}
            onAddFlight={onAddFlight}
            startDate={startDate}
            endDate={endDate}
          />
        )}

        {activeSubTab === 2 && (
          <div className="flights-list">
            {(() => {
              // Group flights by airline
              const groupedFlights = flights.reduce((acc, flight) => {
                const airline = flight.airline || '未命名航空';
                if (!acc[airline]) {
                  acc[airline] = [];
                }
                acc[airline].push(flight);
                return acc;
              }, {});

              return Object.entries(groupedFlights).map(([airline, airlineFlights]) => (
                <div key={airline} className="airline-group">
                  <div className="airline-group-header">
                    <h3>{airline}</h3>
                  </div>
                  <div className="airline-flights">
                    {airlineFlights.map((flight) => (
                      <FlightCard
                        key={flight.id}
                        flight={flight}
                        isEditing={editingId === flight.id}
                        editedFlight={editedFlight}
                        onStartEdit={() => onStartEdit(flight.id)}
                        onSaveEdit={() => onSaveEdit(flight.id)}
                        onCancelEdit={onCancelEdit}
                        onDelete={() => onDeleteFlight(flight.id)}
                        onUpdateField={onUpdateEditedField}
                        onVote={() => onVote(flight.id)}
                        onAddComment={(text) => onAddComment(flight.id, text)}
                        onDeleteComment={(commentId) => onDeleteComment(flight.id, commentId)}
                        currentUser={currentUser}
                      />
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightTab;
