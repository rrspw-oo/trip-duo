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
  currentUser,
  userMetadata
}) => {
  const [showForm] = useState(true);

  // Get list of existing item names for duplicate checking
  const existingItemNames = Object.values(shoppingListItems).map(item => item.itemName);

  // Convert items object to array and sort: unpurchased first, then purchased
  const itemsArray = Object.entries(shoppingListItems)
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
        {itemsArray.length > 0 ? (
          <div className="items-section">
            <div className="items-list">
              {itemsArray.map(item => (
                <ShoppingListCard
                  key={item.id}
                  item={item}
                  currentUser={currentUser}
                  onToggleCheck={onToggleItemCheck}
                  onDelete={onDeleteShoppingItem}
                  userMetadata={userMetadata}
                />
              ))}
            </div>
          </div>
        ) : (
          !showForm && (
            <div className="empty-state">
              <p>尚未新增任何物品</p>
              <p className="empty-state-hint">點擊「+ 新增物品」開始建立清單</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ShoppingListTab;
