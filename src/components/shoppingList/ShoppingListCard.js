import React, { useState, useRef, useEffect } from "react";
import { getUserInitials, getAvatarColor } from "../../utils/firebaseHelpers";

const ShoppingListCard = ({
  item,
  currentUser,
  onToggleCheck,
  onDelete,
  onUpdate,
  userMetadata
}) => {
  const { itemName, addedBy, isPurchased = false, timestamp } = item;
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(itemName);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleCheck = () => {
    onToggleCheck(item.id);
  };

  const handleDelete = () => {
    if (window.confirm(`確定要刪除「${itemName}」嗎？`)) {
      onDelete(item.id);
    }
  };

  const handleSaveEdit = () => {
    if (editedName.trim() && editedName !== itemName) {
      onUpdate(item.id, { itemName: editedName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(itemName);
    setIsEditing(false);
  };

  // Format timestamp
  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Get creator initials from metadata or fallback to UID
  const creatorMetadata = userMetadata?.[addedBy];
  const creatorEmail = creatorMetadata?.email || addedBy;
  const creatorInitials = getUserInitials(creatorEmail);
  const createdTime = formatTimestamp(timestamp);

  // Get user info
  const userEmail = userMetadata?.[addedBy]?.email || addedBy;
  const userInitials = getUserInitials(userEmail);
  const avatarColor = getAvatarColor(userEmail);

  return (
    <div className={`pretrip-item-card ${isPurchased ? 'completed' : ''}`}>
      <div className="item-content">
        <div className="item-timestamp">
          {creatorInitials} {createdTime}
        </div>

        <div className="item-main">
          <div className="item-name">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="item-name-input"
                autoFocus
                maxLength={100}
              />
            ) : (
              <span className={isPurchased ? 'strikethrough' : ''}>{itemName}</span>
            )}
          </div>

          <div className="item-avatars">
            <div
              className={`user-avatar-check ${isPurchased ? 'checked' : 'unchecked'}`}
              style={{
                backgroundColor: isPurchased ? avatarColor : 'transparent',
                borderColor: avatarColor,
                color: isPurchased ? 'white' : avatarColor
              }}
              onClick={handleToggleCheck}
              title={`${userEmail} (點擊切換)`}
              role="button"
            >
              {userInitials}
            </div>
          </div>

          {!isEditing && (
            <div className="item-menu-container" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="btn-menu"
                title="選項"
              >
                ⋮
              </button>
              {showMenu && (
                <div className="item-dropdown-menu">
                  <div
                    className="menu-option"
                    onClick={() => {
                      setShowMenu(false);
                      setIsEditing(true);
                    }}
                  >
                    編輯
                  </div>
                  <div
                    className="menu-option menu-option-danger"
                    onClick={() => {
                      setShowMenu(false);
                      handleDelete();
                    }}
                  >
                    刪除
                  </div>
                </div>
              )}
            </div>
          )}

          {isEditing && (
            <div className="edit-actions">
              <button onClick={handleSaveEdit} className="btn-save" title="儲存">
                ✓
              </button>
              <button onClick={handleCancelEdit} className="btn-cancel" title="取消">
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListCard;
