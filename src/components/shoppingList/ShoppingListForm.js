import React from "react";

const ShoppingListForm = ({ newItem, setNewItem, onAddItem, existingItemNames }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newItem.itemName.trim()) {
      alert('請輸入物品名稱');
      return;
    }

    // Check for duplicate item names
    if (existingItemNames.includes(newItem.itemName.trim())) {
      alert('此物品已存在，無法重複新增');
      return;
    }

    onAddItem();
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <div className="form-row">
        <div className="form-field">
          <label>想買的物品</label>
          <input
            type="text"
            value={newItem.itemName}
            onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
            placeholder="例如：藥妝、零食、紀念品"
            maxLength="50"
            required
          />
        </div>
      </div>

      <button type="submit" className="btn btn-large">
        新增物品
      </button>
    </form>
  );
};

export default ShoppingListForm;
