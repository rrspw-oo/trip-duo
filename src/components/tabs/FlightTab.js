import React, { useState, useEffect, useRef } from "react";
import FlightForm from "../flights/FlightForm";
import FlightCard from "../flights/FlightCard";
import ConfirmedFlightTicket from "../flights/ConfirmedFlightTicket";
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
  endDate,
  selectedFlightId,
  onSelectFlight,
  onConfirmFlight,
  confirmedFlight,
  onUpdateConfirmedFlight,
  onClearConfirmedFlight
}) => {
  const [activeSubTab, setActiveSubTab] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFlightId, setPendingFlightId] = useState(null);
  const [checkedFlightId, setCheckedFlightId] = useState(null);
  const [isEditingBookingInfo, setIsEditingBookingInfo] = useState(false);
  const hasInitialized = useRef(false);

  const hasConfirmedFlight = confirmedFlight !== null;

  // Auto-navigate to confirmed flight tab if confirmed flight exists
  useEffect(() => {
    if (confirmedFlight) {
      setActiveSubTab(3);
    }
  }, [confirmedFlight]);

  // Auto-determine if booking info needs editing (only on initial load)
  useEffect(() => {
    if (confirmedFlight && !hasInitialized.current) {
      const isIncomplete = !confirmedFlight.purchaseDate ||
                           !confirmedFlight.bookingCode ||
                           !confirmedFlight.outboundDepartureTerminal ||
                           !confirmedFlight.outboundArrivalTerminal ||
                           !confirmedFlight.returnDepartureTerminal ||
                           !confirmedFlight.returnArrivalTerminal;
      setIsEditingBookingInfo(isIncomplete);
      hasInitialized.current = true;
    }
  }, [confirmedFlight]);

  const handleCheckboxChange = (flightId, isChecked) => {
    if (isChecked) {
      setCheckedFlightId(flightId);
      setPendingFlightId(flightId);
      if (hasConfirmedFlight) {
        // If there's already a confirmed flight, show different message
        setShowConfirmModal(true);
      } else {
        setShowConfirmModal(true);
      }
    } else {
      setCheckedFlightId(null);
      setPendingFlightId(null);
    }
  };

  const handleConfirmSelection = () => {
    if (pendingFlightId) {
      onSelectFlight(pendingFlightId);
      onConfirmFlight(pendingFlightId);
      setShowConfirmModal(false);
      setPendingFlightId(null);
      setActiveSubTab(3);
      // Keep checkedFlightId to show selected state
    }
  };

  const handleCancelSelection = () => {
    setShowConfirmModal(false);
    setPendingFlightId(null);
    setCheckedFlightId(null);
  };

  const handleReselectFlight = () => {
    if (window.confirm('確定要重新選擇航班嗎？\n\n這將清除目前已確認的航班資訊。')) {
      onClearConfirmedFlight();
      setCheckedFlightId(null);
      setActiveSubTab(2);
    }
  };

  const handleSaveBookingInfo = () => {
    // Validate all required fields
    if (!confirmedFlight.purchaseDate) {
      alert('請填寫購買日期');
      return;
    }
    if (!confirmedFlight.bookingCode) {
      alert('請填寫訂位代號');
      return;
    }
    if (!confirmedFlight.outboundDepartureTerminal || !confirmedFlight.outboundArrivalTerminal) {
      alert('請填寫去程航廈資訊');
      return;
    }
    if (!confirmedFlight.returnDepartureTerminal || !confirmedFlight.returnArrivalTerminal) {
      alert('請填寫回程航廈資訊');
      return;
    }

    setIsEditingBookingInfo(false);
  };

  return (
    <div className="tab-content">
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
            onAddSuccess={() => setActiveSubTab(2)}
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
                        isSelected={selectedFlightId === flight.id}
                        isDisabled={checkedFlightId !== null && checkedFlightId !== flight.id}
                        onSelect={() => onSelectFlight(flight.id)}
                        onCheckboxChange={(isChecked) => handleCheckboxChange(flight.id, isChecked)}
                        showCheckbox={true}
                        isChecked={checkedFlightId === flight.id}
                      />
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {activeSubTab === 3 && (
          <div className="confirmed-flight-view">
            {confirmedFlight ? (
              <div className="confirmed-flight-container">
                <ConfirmedFlightTicket flight={confirmedFlight} />

                {isEditingBookingInfo ? (
                  <div className="confirmed-flight-details booking-info-edit-mode">
                    <h3>訂票資訊</h3>

                    <div className="booking-info-row">
                      <div className="confirmation-field">
                        <label>購買日期</label>
                        <input
                          type="date"
                          value={confirmedFlight.purchaseDate || ''}
                          onChange={(e) => onUpdateConfirmedFlight('purchaseDate', e.target.value)}
                        />
                      </div>
                      <div className="confirmation-field">
                        <label>訂位代號</label>
                        <input
                          type="text"
                          value={confirmedFlight.bookingCode || ''}
                          onChange={(e) => onUpdateConfirmedFlight('bookingCode', e.target.value)}
                          placeholder="請輸入訂位代號"
                          maxLength="20"
                        />
                      </div>
                    </div>

                    <div className="booking-info-section">
                      <h4>去程航廈資訊</h4>
                      <div className="booking-info-row">
                        <div className="confirmation-field">
                          <label>出發航廈</label>
                          <input
                            type="text"
                            value={confirmedFlight.outboundDepartureTerminal || ''}
                            onChange={(e) => onUpdateConfirmedFlight('outboundDepartureTerminal', e.target.value)}
                            placeholder="例如: 2"
                            maxLength="10"
                          />
                        </div>
                        <div className="confirmation-field">
                          <label>抵達航廈</label>
                          <input
                            type="text"
                            value={confirmedFlight.outboundArrivalTerminal || ''}
                            onChange={(e) => onUpdateConfirmedFlight('outboundArrivalTerminal', e.target.value)}
                            placeholder="例如: 1"
                            maxLength="10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="booking-info-section">
                      <h4>回程航廈資訊</h4>
                      <div className="booking-info-row">
                        <div className="confirmation-field">
                          <label>出發航廈</label>
                          <input
                            type="text"
                            value={confirmedFlight.returnDepartureTerminal || ''}
                            onChange={(e) => onUpdateConfirmedFlight('returnDepartureTerminal', e.target.value)}
                            placeholder="例如: 1"
                            maxLength="10"
                          />
                        </div>
                        <div className="confirmation-field">
                          <label>抵達航廈</label>
                          <input
                            type="text"
                            value={confirmedFlight.returnArrivalTerminal || ''}
                            onChange={(e) => onUpdateConfirmedFlight('returnArrivalTerminal', e.target.value)}
                            placeholder="例如: 2"
                            maxLength="10"
                          />
                        </div>
                      </div>
                    </div>

                    <button type="button" onClick={handleSaveBookingInfo} className="btn btn-large" style={{ width: '100%', marginTop: 'var(--space-lg)' }}>
                      儲存
                    </button>
                  </div>
                ) : (
                  <div className="confirmed-flight-details booking-info-view-mode">
                    <div className="booking-info-header">
                      <h3>訂位資訊</h3>
                      <button
                        type="button"
                        onClick={() => setIsEditingBookingInfo(true)}
                        className="icon-btn-edit"
                        title="編輯"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <p>尚未確認任何航班</p>
                <p className="empty-state-hint">請先在「航班列表」選擇航班後確認</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>確認選擇此航班</h3>
            <p>
              {checkedFlightId !== null && checkedFlightId !== pendingFlightId
                ? '確定要切換到此航班嗎？'
                : '確定要選擇此航班嗎？'}
            </p>
            <div className="modal-buttons">
              <button type="button" onClick={handleConfirmSelection} className="btn">
                確認
              </button>
              <button type="button" onClick={handleCancelSelection} className="btn-remove">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightTab;
