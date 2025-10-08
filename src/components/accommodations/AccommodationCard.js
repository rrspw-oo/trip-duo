import React, { useState } from "react";
import DOMPurify from "dompurify";
import TagSelector from "../common/TagSelector";
import { AMENITIES_OPTIONS } from "../../constants/options";

const AccommodationCard = ({
  accommodation,
  isEditing,
  editedAccommodation,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onUpdateField,
  onVote,
  onAddComment,
  onDeleteComment,
  currentUser,
  isSelected = false,
  isDisabled = false,
  showCheckbox = false,
  onCheckboxChange = () => {},
  isChecked = false,
  isReadOnly = false,
}) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const voteCount = accommodation.votes ? Object.keys(accommodation.votes).length : 0;
  const hasVoted = accommodation.votes && currentUser ? accommodation.votes[currentUser.uid] : false;
  const comments = accommodation.comments || [];

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  const handleAddressClick = () => {
    if (accommodation.address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(accommodation.address)}`;
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Format datetime to show date and time separately
  const formatDateTime = (datetime) => {
    if (!datetime) return { date: '', time: '' };
    const dt = new Date(datetime);
    const date = dt.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric'
    });
    const time = dt.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return { date, time };
  };

  // Format price with $ prefix
  const formatPrice = (price) => {
    if (!price) return '$0';
    const priceStr = String(price).trim();
    return priceStr.startsWith('$') ? priceStr : `$${priceStr}`;
  };

  if (isEditing) {
    return (
      <div className="accommodation-card editing">
        <div className="accommodation-card-header">
          <input
            value={editedAccommodation.name}
            onChange={(e) => onUpdateField("name", e.target.value)}
            className="accommodation-name-input"
            placeholder="住宿名稱"
            maxLength="100"
          />
        </div>
        <div className="accommodation-card-body">
          <div className="datetime-row">
            <div className="datetime-group">
              <label>Check-in</label>
              <input
                type="datetime-local"
                value={editedAccommodation.checkIn}
                onChange={(e) => onUpdateField("checkIn", e.target.value)}
              />
            </div>
            <div className="datetime-group">
              <label>Check-out</label>
              <input
                type="datetime-local"
                value={editedAccommodation.checkOut}
                onChange={(e) => onUpdateField("checkOut", e.target.value)}
              />
            </div>
          </div>
          <input
            value={editedAccommodation.address}
            onChange={(e) => onUpdateField("address", e.target.value)}
            placeholder="住宿地址"
            className="accommodation-input"
            maxLength="200"
          />
          <div className="form-row-two">
            <input
              value={editedAccommodation.nearbyStation}
              onChange={(e) => onUpdateField("nearbyStation", e.target.value)}
              placeholder="附近車站"
              className="accommodation-input"
              maxLength="100"
            />
            <input
              value={editedAccommodation.price}
              onChange={(e) => onUpdateField("price", e.target.value)}
              placeholder="住宿價格"
              className="accommodation-input"
              maxLength="20"
            />
          </div>
          <TagSelector
            value={editedAccommodation.amenities || []}
            onChange={(value) => onUpdateField("amenities", value)}
            options={AMENITIES_OPTIONS}
            placeholder="請選擇備品"
            label="住宿提供"
            multiple={true}
          />
          <textarea
            value={editedAccommodation.notes || ""}
            onChange={(e) => onUpdateField("notes", e.target.value)}
            placeholder="備註"
            className="accommodation-textarea"
            maxLength="500"
            rows="2"
          />
        </div>
        <div className="accommodation-card-actions">
          <button onClick={onSaveEdit} className="btn">
            儲存
          </button>
          <button onClick={onCancelEdit} className="btn-remove">
            取消
          </button>
        </div>
      </div>
    );
  }

  const checkInFormatted = formatDateTime(accommodation.checkIn);
  const checkOutFormatted = formatDateTime(accommodation.checkOut);

  return (
    <div className={`accommodation-option-card ${isChecked ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}>
      <div className="accommodation-option-header">
        <h4 className="accommodation-name" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(accommodation.name) }} />
        <div className="accommodation-price-section">
          <span className="accommodation-price-badge">{formatPrice(accommodation.price)}</span>
          {showCheckbox && (
            <input
              type="checkbox"
              className="accommodation-confirm-checkbox"
              checked={isChecked}
              onChange={(e) => onCheckboxChange(e.target.checked)}
              title="確認此住宿"
            />
          )}
        </div>
      </div>

      <div className="accommodation-option-times">
        <div className="time-column">
          <div className="time-label">Check-in</div>
          <div className="time-value">{checkInFormatted.date} {checkInFormatted.time}</div>
        </div>
        <div className="time-column">
          <div className="time-label">Check-out</div>
          <div className="time-value">{checkOutFormatted.date} {checkOutFormatted.time}</div>
        </div>
      </div>

      {(accommodation.address || accommodation.nearbyStation) && (
        <div className="accommodation-location-row">
          {accommodation.address && (
            <div className="accommodation-address" onClick={handleAddressClick}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="location-icon">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              <span className="address-text">{accommodation.address}</span>
            </div>
          )}

          {accommodation.nearbyStation && (
            <div className="accommodation-station">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="station-icon">
                <path d="M12 2C8 2 6 3 6 6v8c0 2.21 1.79 4 4 4h4c2.21 0 4-1.79 4-4V6c0-3-2-4-6-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 11H7V7h10v4zM7 19l-1 1.5v.5h12v-.5L17 19H7z"/>
              </svg>
              <span>{accommodation.nearbyStation}</span>
            </div>
          )}
        </div>
      )}

      {accommodation.amenities && accommodation.amenities.length > 0 && (
        <div className="amenities-section">
          <div className="section-label">住宿提供</div>
          <div className="amenities-tags">
            {accommodation.amenities.map((amenity, index) => (
              <span key={index} className="tag tag-amenity">{amenity}</span>
            ))}
          </div>
        </div>
      )}

      {accommodation.notes && (
        <div className="accommodation-notes">
          <div className="section-label">備註</div>
          <small dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(accommodation.notes) }} />
        </div>
      )}

      <div className="accommodation-interactions">
        <div className="accommodation-interactions-left">
          {!isReadOnly && (
            <button
              onClick={onVote}
              className={`vote-button ${hasVoted ? 'voted' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
              </svg>
              {voteCount > 0 && <span className="vote-count">{voteCount}</span>}
            </button>
          )}
          <button
            onClick={() => setShowComments(!showComments)}
            className="comment-toggle-button"
            title="留言"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
            </svg>
            {comments.length > 0 && <span className="comment-count">{comments.length}</span>}
          </button>
        </div>
        {!isReadOnly && (
          <div className="accommodation-interactions-right">
            <button onClick={onStartEdit} className="icon-btn-compact" title="編輯">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
            <button onClick={onDelete} className="icon-btn-compact danger" title="刪除">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {showComments && (
        <div className="comments-section">
          {!isReadOnly && (
            <div className="comment-input-container">
              <input
                type="text"
                placeholder="新增留言..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                maxLength="200"
              />
              <button onClick={handleAddComment} className="btn-comment">
                發送
              </button>
            </div>
          )}
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.author.email}</span>
                  <span className="comment-time">
                    {new Date(comment.timestamp).toLocaleDateString('zh-TW')}
                  </span>
                  {!isReadOnly && currentUser && comment.author.uid === currentUser.uid && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="btn-delete-comment"
                      title="刪除留言"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="comment-text" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.text) }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationCard;
