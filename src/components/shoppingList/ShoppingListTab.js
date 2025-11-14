import React, { useState } from "react";
import ShoppingListForm from "./ShoppingListForm";
import ShoppingListCard from "./ShoppingListCard";

const ShoppingListTab = ({
  shoppingListItems,
  newShoppingItem,
  setNewShoppingItem,
  onAddShoppingItem,
  onToggleItemCheck,
  onDeleteShoppingItem,
  onUpdateShoppingItem,
  allUsers,
  currentUser,
  userMetadata
}) => {
  const [showForm] = useState(true);
  const [activeTab, setActiveTab] = useState('mine');

  const otherUserId = allUsers?.find(uid => uid !== currentUser.uid);

  // Get list of existing item names for duplicate checking
  const existingItemNames = Object.values(shoppingListItems).map(item => item.itemName);

  // Filter items based on active tab
  const itemsToDisplay = Object.entries(shoppingListItems)
    .filter(([_, item]) => {
      if (activeTab === 'mine') {
        return item.addedBy === currentUser.uid;
      } else if (activeTab === 'other') {
        return item.addedBy === otherUserId;
      }
      return false;
    })
    .map(([id, item]) => ({ ...item, id }))
    .sort((a, b) => {
      // Unpurchased items first
      if (a.isPurchased !== b.isPurchased) {
        return a.isPurchased ? 1 : -1;
      }
      // Then sort by timestamp (newest first)
      return (b.timestamp || 0) - (a.timestamp || 0);
    });

  const handleAddItem = () => {
    onAddShoppingItem();
  };

  return (
    <div className="pretrip-items-tab">
      <div className="tab-header">
        <h2>想買清單</h2>
      </div>

      {showForm && (
        <div className="form-container">
          <ShoppingListForm
            newItem={newShoppingItem}
            setNewItem={setNewShoppingItem}
            onAddItem={handleAddItem}
            existingItemNames={existingItemNames}
          />
        </div>
      )}

      <div className="items-container">
        <div className="unified-items-tabs">
          <button
            className={`unified-tab-btn ${activeTab === 'mine' ? 'active' : ''}`}
            onClick={() => setActiveTab('mine')}
          >
            個人想買
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
            itemsToDisplay.map(item => (
              <ShoppingListCard
                key={item.id}
                item={item}
                currentUser={currentUser}
                onToggleCheck={onToggleItemCheck}
                onDelete={onDeleteShoppingItem}
                onUpdate={onUpdateShoppingItem}
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

export default ShoppingListTab;
