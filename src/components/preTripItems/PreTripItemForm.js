import React from "react";

const PreTripItemForm = ({ newItem, setNewItem, onAddItem, existingItemNames }) => {
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
          <label>物品名稱</label>
          <input
            type="text"
            value={newItem.itemName}
            onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
            placeholder="例如：護照、日幣、eSIM"
            maxLength="50"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="checkbox-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newItem.isShared}
              onChange={(e) => setNewItem({ ...newItem, isShared: e.target.checked })}
            />
            <span>共同必備</span>
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-large">
        新增物品
      </button>
    </form>
  );
};

export default PreTripItemForm;
