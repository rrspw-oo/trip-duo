import React, { useState, useMemo } from "react";
import DOMPurify from "dompurify";

const EssentialsTab = ({
  essentials,
  planId,
  currentUser,
  onAddItem,
  onRemoveItem,
  onToggleUserCheck,
  onUpdateItem
}) => {
  const [newItem, setNewItem] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemText, setEditingItemText] = useState("");

  const addItem = () => {
    if (newItem.trim() && planId) {
      onAddItem(newItem.trim());
      setNewItem("");
    }
  };

  const startEditing = (id, text) => {
    setEditingItemId(id);
    setEditingItemText(text);
  };

  const saveEdit = (id) => {
    if (planId && editingItemText.trim()) {
      onUpdateItem(id, editingItemText.trim());
      setEditingItemId(null);
      setEditingItemText("");
    }
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditingItemText("");
  };

  const handleKeyPress = (e, id) => {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const sortedEssentials = useMemo(() => {
    return [...essentials].sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      return orderA - orderB;
    });
  }, [essentials]);

  return (
    <div className="tab-content">
      <h2>旅行必備</h2>
      <div className="form-group inline-form">
        <input
          type="text"
          id="new-essential-item"
          name="newItem"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
          placeholder="新增物品，如護照、換日幣"
          maxLength="200"
        />
        <button onClick={addItem} className="btn">
          新增
        </button>
      </div>
      <ul className="essentials-list">
        {sortedEssentials.map((item) => {
          const itemData = typeof item.text === 'string' ? { text: item.text, completed: false } : item;
          const isEditing = editingItemId === item.id;
          const checkedBy = itemData.checkedBy || {};
          const currentUserChecked = checkedBy[currentUser?.uid] || false;
          const isCompleted = itemData.completed || false;

          // Debug to window
          if (!window.debugEssentials) window.debugEssentials = {};
          window.debugEssentials[item.id] = {
            itemData,
            checkedBy,
            currentUserChecked,
            currentUserUid: currentUser?.uid,
            createdByName: itemData.createdByName
          };

          return (
            <li key={item.id} className={`essential-item ${isCompleted ? "completed bling-complete" : ""}`}>
              <div className="essential-content">
                <div className="essential-checkbox-area">
                  <input
                    type="checkbox"
                    checked={currentUserChecked}
                    onChange={(e) => {
                      window.debugCheckboxClick = {
                        itemId: item.id,
                        checked: e.target.checked,
                        itemData,
                        hasOnToggle: !!onToggleUserCheck
                      };
                      try {
                        onToggleUserCheck(item.id, itemData);
                      } catch (error) {
                        window.debugCheckboxError = error.message;
                        alert('Checkbox 錯誤: ' + error.message);
                      }
                    }}
                    className="essential-checkbox"
                  />
                </div>
                <div className="essential-main">
                  {isEditing ? (
                    <div className="essential-text-editing">
                      <input
                        type="text"
                        value={editingItemText}
                        onChange={(e) => setEditingItemText(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, item.id)}
                        onBlur={() => saveEdit(item.id)}
                        className="essential-edit-input"
                        maxLength="200"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <span
                      className="essential-text"
                      onClick={() => startEditing(item.id, itemData.text)}
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(itemData.text) }}
                    />
                  )}
                  {itemData.createdByName && (
                    <div className="essential-creator">
                      {itemData.createdByPhoto && (
                        <img
                          src={itemData.createdByPhoto}
                          alt={itemData.createdByName}
                          className="creator-avatar"
                        />
                      )}
                      <span className="creator-name">由 {itemData.createdByName} 新增</span>
                    </div>
                  )}
                  <div className="essential-check-status">
                    {Object.entries(checkedBy).map(([userId, checked]) => (
                      checked && (
                        <span key={userId} className="user-check-indicator">
                          ✓
                        </span>
                      )
                    ))}
                  </div>
                </div>
                <div className="essential-actions">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="btn-remove"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </li>
          );
        })}
        {essentials.length === 0 && <p>無必備物品</p>}
      </ul>
    </div>
  );
};

export default EssentialsTab;
