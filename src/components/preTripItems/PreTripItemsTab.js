import React, { useState } from "react";
import PreTripItemForm from "./PreTripItemForm";
import PreTripItemCard from "./PreTripItemCard";

const PreTripItemsTab = ({
  preTripItems,
  newPreTripItem,
  setNewPreTripItem,
  onAddPreTripItem,
  onToggleItemCheck,
  onDeletePreTripItem,
  allUsers,
  currentUser,
  userMetadata
}) => {
  const [showForm, setShowForm] = useState(true);

  // Get list of existing item names for duplicate checking
  const existingItemNames = Object.values(preTripItems).map(item => item.itemName);

  // Separate shared and personal items
  const sharedItems = Object.entries(preTripItems)
    .filter(([_, item]) => item.isShared)
    .map(([id, item]) => ({ ...item, id }));

  const personalItems = Object.entries(preTripItems)
    .filter(([_, item]) => !item.isShared && item.addedBy === currentUser.uid)
    .map(([id, item]) => ({ ...item, id }));

  const handleAddItem = () => {
    onAddPreTripItem();
    setShowForm(false);
  };

  return (
    <div className="pretrip-items-tab">
      <div className="tab-header">
        <h2>行前必備清單</h2>
      </div>

      {showForm && (
        <div className="form-container">
          <PreTripItemForm
            newItem={newPreTripItem}
            setNewItem={setNewPreTripItem}
            onAddItem={handleAddItem}
            existingItemNames={existingItemNames}
          />
        </div>
      )}

      <div className="items-container">
        {sharedItems.length > 0 && (
          <div className="items-section">
            <h3 className="section-title">共同必備</h3>
            <div className="items-list">
              {sharedItems.map(item => (
                <PreTripItemCard
                  key={item.id}
                  item={item}
                  allUsers={allUsers}
                  currentUser={currentUser}
                  onToggleCheck={onToggleItemCheck}
                  onDelete={onDeletePreTripItem}
                  userMetadata={userMetadata}
                />
              ))}
            </div>
          </div>
        )}

        {personalItems.length > 0 && (
          <div className="items-section">
            <h3 className="section-title">個人必備</h3>
            <div className="items-list">
              {personalItems.map(item => (
                <PreTripItemCard
                  key={item.id}
                  item={item}
                  allUsers={allUsers}
                  currentUser={currentUser}
                  onToggleCheck={onToggleItemCheck}
                  onDelete={onDeletePreTripItem}
                  userMetadata={userMetadata}
                />
              ))}
            </div>
          </div>
        )}

        {sharedItems.length === 0 && personalItems.length === 0 && !showForm && (
          <div className="empty-state">
            <p>尚未新增任何物品</p>
            <p className="empty-state-hint">點擊「+ 新增物品」開始建立清單</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreTripItemsTab;
