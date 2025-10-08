import React from "react";
import { getUserInitials, getAvatarColor } from "../../utils/firebaseHelpers";

const PreTripItemCard = ({
  item,
  allUsers,
  currentUser,
  onToggleCheck,
  onDelete,
  userMetadata
}) => {
  const { itemName, addedBy, isShared, checkedBy = [], timestamp } = item;

  // Calculate completion status
  const isCompleted = isShared
    ? allUsers.every(uid => checkedBy.includes(uid))
    : checkedBy.includes(addedBy);

  // Check if current user has checked this item
  const isCheckedByCurrentUser = checkedBy.includes(currentUser.uid);

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

  return (
    <div className={`pretrip-item-card ${isCompleted ? 'completed' : ''}`}>
      <div className="item-content">
        <div className="item-header">
          <h3 className={isCompleted ? 'strikethrough' : ''}>{itemName}</h3>
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

        {isShared ? (
          <div className="shared-checklist">
            {allUsers.map(uid => {
              const isChecked = checkedBy.includes(uid);
              const userMeta = userMetadata?.[uid];
              const userEmail = userMeta?.email || uid;
              const initials = getUserInitials(userEmail);
              const color = getAvatarColor(userEmail);
              const isCurrentUserRow = uid === currentUser.uid;

              return (
                <div key={uid} className="user-check-status">
                  <div
                    className="user-avatar-small"
                    style={{ backgroundColor: color }}
                    title={uid}
                  >
                    {initials}
                  </div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={isCurrentUserRow ? handleToggleCheck : undefined}
                      className="round-checkbox"
                      disabled={!isCurrentUserRow}
                    />
                    {isChecked && <span>已備好</span>}
                  </label>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="personal-checklist">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isCheckedByCurrentUser}
                onChange={handleToggleCheck}
                className="round-checkbox"
              />
              {isCheckedByCurrentUser && <span>已備好</span>}
            </label>
          </div>
        )}

        <div className="item-footer">
          <span className="item-creator-info">
            {creatorInitials} {createdTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreTripItemCard;
