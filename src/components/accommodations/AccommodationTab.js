import React, { useState, useEffect } from "react";
import AccommodationForm from "./AccommodationForm";
import AccommodationCard from "./AccommodationCard";
import ConfirmedAccommodationTicket from "./ConfirmedAccommodationTicket";
import { ACCOMMODATION_SUB_TABS } from "../../constants/options";

const AccommodationTab = ({
  accommodations,
  newAccommodation,
  setNewAccommodation,
  editingId,
  editedAccommodation,
  onAddAccommodation,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteAccommodation,
  onUpdateEditedField,
  onVote,
  onAddComment,
  onDeleteComment,
  currentUser,
  startDate,
  endDate,
  selectedAccommodationId,
  onSelectAccommodation,
  onConfirmAccommodation,
  confirmedAccommodation,
  onUpdateConfirmedAccommodation,
  onClearConfirmedAccommodation
}) => {
  const [activeSubTab, setActiveSubTab] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAccommodationId, setPendingAccommodationId] = useState(null);
  const [checkedAccommodationId, setCheckedAccommodationId] = useState(null);

  const hasConfirmedAccommodation = confirmedAccommodation !== null;

  // Auto-navigate to confirmed accommodation tab if confirmed accommodation exists
  useEffect(() => {
    if (confirmedAccommodation) {
      setActiveSubTab(3);
    }
  }, [confirmedAccommodation]);

  const handleCheckboxChange = (accommodationId, isChecked) => {
    if (isChecked) {
      setCheckedAccommodationId(accommodationId);
      setPendingAccommodationId(accommodationId);
      setShowConfirmModal(true);
    } else {
      setCheckedAccommodationId(null);
      setPendingAccommodationId(null);
    }
  };

  const handleConfirmSelection = () => {
    if (pendingAccommodationId) {
      onSelectAccommodation(pendingAccommodationId);
      onConfirmAccommodation(pendingAccommodationId);
      setShowConfirmModal(false);
      setPendingAccommodationId(null);
      setActiveSubTab(3);
    }
  };

  const handleCancelSelection = () => {
    setShowConfirmModal(false);
    setPendingAccommodationId(null);
    setCheckedAccommodationId(null);
  };

  const handleReselectAccommodation = () => {
    if (window.confirm('確定要重新選擇住宿嗎？\\n\\n這將清除目前已確認的住宿資訊。')) {
      onClearConfirmedAccommodation();
      setCheckedAccommodationId(null);
      setActiveSubTab(2);
    }
  };

  return (
    <div className="tab-content accommodation-tab-content">
      {/* Sub-tabs navigation */}
      <div className="sub-tabs">
        {ACCOMMODATION_SUB_TABS.map((tab) => (
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
          <AccommodationForm
            newAccommodation={newAccommodation}
            setNewAccommodation={setNewAccommodation}
            onAddAccommodation={onAddAccommodation}
            onAddSuccess={() => setActiveSubTab(2)}
            startDate={startDate}
            endDate={endDate}
          />
        )}

        {activeSubTab === 2 && (
          <div className="accommodations-list">
            {accommodations.length === 0 ? (
              <div className="empty-state">
                <p>尚未新增任何住宿</p>
                <p className="empty-state-hint">請先在「新增住宿」頁面新增住宿選項</p>
              </div>
            ) : (
              accommodations.map((accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  accommodation={accommodation}
                  isEditing={editingId === accommodation.id}
                  editedAccommodation={editedAccommodation}
                  onStartEdit={() => onStartEdit(accommodation.id)}
                  onSaveEdit={() => onSaveEdit(accommodation.id)}
                  onCancelEdit={onCancelEdit}
                  onDelete={() => onDeleteAccommodation(accommodation.id)}
                  onUpdateField={onUpdateEditedField}
                  onVote={() => onVote(accommodation.id)}
                  onAddComment={(text) => onAddComment(accommodation.id, text)}
                  onDeleteComment={(commentId) => onDeleteComment(accommodation.id, commentId)}
                  currentUser={currentUser}
                  isSelected={selectedAccommodationId === accommodation.id}
                  isDisabled={checkedAccommodationId !== null && checkedAccommodationId !== accommodation.id}
                  onCheckboxChange={(isChecked) => handleCheckboxChange(accommodation.id, isChecked)}
                  showCheckbox={true}
                  isChecked={checkedAccommodationId === accommodation.id}
                />
              ))
            )}
          </div>
        )}

        {activeSubTab === 3 && (
          <div className="confirmed-accommodation-view">
            {confirmedAccommodation ? (
              <div className="confirmed-accommodation-container">
                <ConfirmedAccommodationTicket accommodation={confirmedAccommodation} />
                <div className="confirmed-accommodation-details">
                  <h3>訂房資訊</h3>
                  <div className="confirmation-field">
                    <label>預訂日期</label>
                    <input
                      type="date"
                      value={confirmedAccommodation.bookingDate || ''}
                      onChange={(e) => onUpdateConfirmedAccommodation('bookingDate', e.target.value)}
                    />
                  </div>
                  <div className="confirmation-field">
                    <label>訂位代號</label>
                    <input
                      type="text"
                      value={confirmedAccommodation.bookingCode || ''}
                      onChange={(e) => onUpdateConfirmedAccommodation('bookingCode', e.target.value)}
                      placeholder="請輸入訂位代號"
                      maxLength="20"
                    />
                  </div>
                  <div className="confirmation-field">
                    <label>訂房網址</label>
                    <input
                      type="url"
                      value={confirmedAccommodation.bookingUrl || ''}
                      onChange={(e) => onUpdateConfirmedAccommodation('bookingUrl', e.target.value)}
                      placeholder="請貼上訂房網址"
                      maxLength="500"
                    />
                  </div>
                  <div className="confirmation-field">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={confirmedAccommodation.isPaid || false}
                        onChange={(e) => onUpdateConfirmedAccommodation('isPaid', e.target.checked)}
                      />
                      <span>已轉帳</span>
                    </label>
                  </div>
                  <div className="confirmation-field">
                    <button onClick={handleReselectAccommodation} className="btn btn-large" style={{ width: '100%' }}>
                      重新選擇住宿
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>尚未確認任何住宿</p>
                <p className="empty-state-hint">請先在「住宿列表」選擇住宿後確認</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>確認選擇此住宿</h3>
            <p>確定要選擇此住宿嗎？</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmSelection} className="btn">
                確認
              </button>
              <button onClick={handleCancelSelection} className="btn-remove">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationTab;
