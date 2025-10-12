import React, { useState } from "react";
import { getUserInitials, getAvatarColor } from "../../utils/firebaseHelpers";

const PreTripItemCard = ({
  item,
  allUsers,
  currentUser,
  onToggleCheck,
  onDelete,
  userMetadata,
  onAddOption,
  onSelectOption,
  onDeleteOption
}) => {
  const { itemName, addedBy, isShared, checkedBy = [], timestamp, options = {}, selectedOption } = item;
  const [showOptions, setShowOptions] = useState(false);

  // Calculate completion status
  const isCompleted = isShared
    ? allUsers.every(uid => checkedBy.includes(uid))
    : checkedBy.includes(addedBy);

  // Only show personal items to the owner
  if (!isShared && addedBy !== currentUser.uid) {
    return null;
  }

  const handleToggleCheck = () => {
    onToggleCheck(item.id, currentUser.uid);
  };

  const handleDelete = () => {
    if (window.confirm(`確定要刪除「${itemName}」嗎？`)) {
      onDelete(item.id);
    }
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
            <span className={isCompleted ? 'strikethrough' : ''}>{itemName}</span>
            {selectedOpt && (
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

          {/* Delete button */}
          {addedBy === currentUser.uid && (
            <button
              onClick={handleDelete}
              className="btn-delete-item"
              title="刪除"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
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
