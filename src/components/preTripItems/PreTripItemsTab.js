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
  onUpdatePreTripItem,
  onAddOption,
  onSelectOption,
  onDeleteOption,
  allUsers,
  currentUser,
  userMetadata,
}) => {
  const [showForm] = useState(true);
  const [activeTab, setActiveTab] = useState('shared');

  // Get list of existing item names for duplicate checking
  const existingItemNames = Object.values(preTripItems).map(
    (item) => item.itemName
  );

  const otherUserId = allUsers.find(uid => uid !== currentUser.uid);

  const itemsToDisplay = Object.entries(preTripItems)
    .filter(([_, item]) => {
      if (activeTab === 'shared') {
        return item.isShared;
      } else if (activeTab === 'mine') {
        return !item.isShared && item.addedBy === currentUser.uid;
      } else if (activeTab === 'other') {
        return !item.isShared && item.addedBy === otherUserId;
      }
      return false;
    })
    .map(([id, item]) => ({ ...item, id }));

  const handleAddItem = () => {
    onAddPreTripItem();
  };

  return (
    <div className="pretrip-items-tab">
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
        <div className="unified-items-tabs">
          <button
            className={`unified-tab-btn ${activeTab === 'shared' ? 'active' : ''}`}
            onClick={() => setActiveTab('shared')}
          >
            共同必備
          </button>
          <button
            className={`unified-tab-btn ${activeTab === 'mine' ? 'active' : ''}`}
            onClick={() => setActiveTab('mine')}
          >
            個人必備
          </button>
          {otherUserId && (
            <button
              className={`unified-tab-btn ${activeTab === 'other' ? 'active' : ''}`}
              onClick={() => setActiveTab('other')}
            >
              {(() => {
                const userMeta = userMetadata?.[otherUserId];
                const userEmail = userMeta?.email || otherUserId;
                const userName = userEmail.split('@')[0];
                return userName;
              })()}
            </button>
          )}
        </div>

        <div className="items-list">
          {itemsToDisplay.length > 0 ? (
            itemsToDisplay.map((item) => (
              <PreTripItemCard
                key={item.id}
                item={item}
                allUsers={allUsers}
                currentUser={currentUser}
                onToggleCheck={onToggleItemCheck}
                onDelete={onDeletePreTripItem}
                onUpdate={onUpdatePreTripItem}
                onAddOption={onAddOption}
                onSelectOption={onSelectOption}
                onDeleteOption={onDeleteOption}
                userMetadata={userMetadata}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>此分類尚未新增任何物品</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreTripItemsTab;
