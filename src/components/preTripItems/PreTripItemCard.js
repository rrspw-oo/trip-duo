import React, { useState, useRef, useEffect } from "react";
import { getUserInitials, getAvatarColor } from "../../utils/firebaseHelpers";

const PreTripItemCard = ({
  item,
  allUsers,
  currentUser,
  onToggleCheck,
  onDelete,
  onUpdate,
  userMetadata,
  onAddOption,
  onSelectOption,
  onDeleteOption
}) => {
  const { itemName, addedBy, isShared, checkedBy = [], timestamp, options = {}, selectedOption } = item;
  const [showOptions, setShowOptions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(itemName);
  const menuRef = useRef(null);

  // Calculate completion status
  const isCompleted = isShared
    ? allUsers.every(uid => checkedBy.includes(uid))
    : checkedBy.includes(addedBy);

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
    onToggleCheck(item.id, currentUser.uid);
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

  // Format timestamp - only time, no day
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

  // Get options info
  const optionsArray = Object.entries(options || {}).map(([id, opt]) => ({ ...opt, id }));
  const hasOptions = optionsArray.length > 0;
  const selectedOpt = selectedOption ? options[selectedOption] : null;

  // Prepare user list for display
  const usersToDisplay = isShared ? allUsers : [addedBy];

  return (
    <div className={`pretrip-item-card ${isCompleted ? 'completed' : ''}`}>
      <div className="item-content">
        {/* Row 1: Timestamp */}
        <div className="item-timestamp">
          {creatorInitials} {createdTime}
        </div>

        {/* Row 2: Item name + avatars + delete */}
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
              <span className={isCompleted ? 'strikethrough' : ''}>{itemName}</span>
            )}
            {selectedOpt && !isEditing && (
              <span className="selected-option-badge">
                ✓ {selectedOpt.name} - ¥{selectedOpt.price}
              </span>
            )}
          </div>

          {/* User avatars */}
          <div className="item-avatars">
            {usersToDisplay.map(uid => {
              const isChecked = checkedBy.includes(uid);
              const userMeta = userMetadata?.[uid];
              const userEmail = userMeta?.email || uid;
              const initials = getUserInitials(userEmail);
              const color = getAvatarColor(userEmail);
              const isCurrentUserAvatar = uid === currentUser.uid;

              return (
                <div
                  key={uid}
                  className={`user-avatar-check ${isChecked ? 'checked' : 'unchecked'}`}
                  style={{
                    backgroundColor: isChecked ? color : 'transparent',
                    borderColor: color,
                    color: isChecked ? 'white' : color
                  }}
                  onClick={isCurrentUserAvatar ? handleToggleCheck : undefined}
                  title={`${userEmail}${isCurrentUserAvatar ? ' (點擊切換)' : ''}`}
                  role={isCurrentUserAvatar ? 'button' : undefined}
                >
                  {initials}
                </div>
              );
            })}
          </div>

          {/* Three-dot menu */}
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

          {/* Save/Cancel buttons when editing */}
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

        {/* Options button row */}
        {hasOptions && (
          <div className="item-options-row">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="btn-options"
              title="查看比較方案"
            >
              比較方案 ({optionsArray.length})
            </button>
          </div>
        )}

        {/* Options list - shown when expanded */}
        {showOptions && hasOptions && (
          <div className="options-list-container">
            <p className="options-hint">點擊選擇您決定的方案：</p>
            {optionsArray.map(opt => (
              <div
                key={opt.id}
                className={`option-item ${selectedOption === opt.id ? 'selected' : ''}`}
                onClick={() => onSelectOption && onSelectOption(item.id, opt.id)}
              >
                <div className="option-main">
                  <input
                    type="radio"
                    checked={selectedOption === opt.id}
                    onChange={() => {}}
                    className="option-radio"
                  />
                  <div className="option-info">
                    <strong>{opt.name}</strong>
                    <span className="option-price">¥{opt.price}</span>
                  </div>
                </div>
                {opt.details && <div className="option-details">{opt.details}</div>}
                {opt.notes && <div className="option-notes">備註：{opt.notes}</div>}
                {opt.link && (
                  <a
                    href={opt.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="option-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    查看連結 →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreTripItemCard;
