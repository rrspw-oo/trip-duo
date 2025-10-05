import React, { useState } from "react";
import DOMPurify from "dompurify";
import { AIRLINE_COLORS } from "../../constants/options";

const FlightCard = ({
  flight,
  isEditing,
  editedFlight,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onUpdateField,
  onVote,
  onAddComment,
  onDeleteComment,
  currentUser,
}) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const voteCount = flight.votes ? Object.keys(flight.votes).length : 0;
  const hasVoted = flight.votes && currentUser ? flight.votes[currentUser.uid] : false;
  const comments = flight.comments || [];

  // Get airline-specific colors
  const airlineColors = AIRLINE_COLORS[flight.airline] || {
    primary: "#666",
    light: "#f5f5f5",
    border: "#999"
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  // Format datetime to show date and time separately
  const formatDateTime = (datetime) => {
    if (!datetime) return { date: '', time: '' };
    const [date, time] = datetime.split('T');
    return {
      date: date || '',
      time: time || ''
    };
  };
  if (isEditing) {
    return (
      <div className="flight-card">
        <div className="flight-card-header">
          <input
            value={editedFlight.airline}
            onChange={(e) => onUpdateField("airline", e.target.value)}
            className="airline-input"
          />
        </div>
        <div className="flight-card-body">
          <div className="flight-section outbound-section">
            <span className="flight-type-tag outbound">去程</span>
            <div className="flight-times">
              <div className="time-group">
                <label>起飛</label>
                <input
                  type="datetime-local"
                  value={editedFlight.outboundDeparture}
                  onChange={(e) => onUpdateField("outboundDeparture", e.target.value)}
                />
              </div>
              <div className="time-group">
                <label>抵達</label>
                <input
                  type="datetime-local"
                  value={editedFlight.outboundArrival}
                  onChange={(e) => onUpdateField("outboundArrival", e.target.value)}
                />
              </div>
            </div>
            <div className="flight-comment-input edit-mode">
              <label>去程備註</label>
              <textarea
                placeholder="例如：預計提前2小時到機場、搭乘捷運前往..."
                value={editedFlight.outboundComment || ""}
                onChange={(e) => onUpdateField("outboundComment", e.target.value)}
                maxLength="500"
                rows="2"
              />
            </div>
          </div>
          <div className="flight-section return-section">
            <span className="flight-type-tag return">回程</span>
            <div className="flight-times">
              <div className="time-group">
                <label>起飛</label>
                <input
                  type="datetime-local"
                  value={editedFlight.returnDeparture}
                  onChange={(e) => onUpdateField("returnDeparture", e.target.value)}
                />
              </div>
              <div className="time-group">
                <label>抵達</label>
                <input
                  type="datetime-local"
                  value={editedFlight.returnArrival}
                  onChange={(e) => onUpdateField("returnArrival", e.target.value)}
                />
              </div>
            </div>
            <div className="flight-comment-input edit-mode">
              <label>回程備註</label>
              <textarea
                placeholder="例如：預計提前3小時到機場、注意退稅時間..."
                value={editedFlight.returnComment || ""}
                onChange={(e) => onUpdateField("returnComment", e.target.value)}
                maxLength="500"
                rows="2"
              />
            </div>
          </div>
          <div className="flight-price-edit">
            <label>票價</label>
            <input
              placeholder="票價"
              value={editedFlight.price}
              onChange={(e) => onUpdateField("price", e.target.value)}
              maxLength="20"
            />
          </div>
        </div>
        <div className="flight-card-actions">
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

  // Format price with $ prefix
  const formatPrice = (price) => {
    if (!price) return '$0';
    const priceStr = String(price).trim();
    return priceStr.startsWith('$') ? priceStr : `$${priceStr}`;
  };

  return (
    <div className="flight-option-card">
      <div className="flight-option-header">
        <span className="flight-price-badge">{formatPrice(flight.price)}</span>
      </div>

      <div className="flight-option-times">
        <div className="flight-time-column">
          <div className="flight-time-label">去程</div>
          <div className="time-row">
            <span className="time-label-compact">起飛</span>
            <span className="time-value-compact">{formatDateTime(flight.outboundDeparture).time || '--:--'}</span>
          </div>
          <div className="time-row">
            <span className="time-label-compact">抵達</span>
            <span className="time-value-compact">{formatDateTime(flight.outboundArrival).time || '--:--'}</span>
          </div>
        </div>
        <div className="flight-time-column">
          <div className="flight-time-label">回程</div>
          <div className="time-row">
            <span className="time-label-compact">起飛</span>
            <span className="time-value-compact">{formatDateTime(flight.returnDeparture).time || '--:--'}</span>
          </div>
          <div className="time-row">
            <span className="time-label-compact">抵達</span>
            <span className="time-value-compact">{formatDateTime(flight.returnArrival).time || '--:--'}</span>
          </div>
        </div>
      </div>

      <div className="flight-interactions">
        <div className="flight-interactions-left">
          <button
            onClick={onVote}
            className={`vote-button ${hasVoted ? 'voted' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
            </svg>
            {voteCount > 0 && <span className="vote-count">{voteCount}</span>}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="comment-toggle-button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
            </svg>
            留言 {comments.length > 0 && <span className="comment-count">({comments.length})</span>}
          </button>
        </div>
        <div className="flight-interactions-right">
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
      </div>

      {showComments && (
        <div className="comments-section">
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

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  {comment.userPhoto && (
                    <img
                      src={comment.userPhoto}
                      alt={comment.userName}
                      className="comment-avatar"
                    />
                  )}
                  <span className="comment-author">{comment.userName}</span>
                  <span className="comment-time">
                    {new Date(comment.timestamp).toLocaleString('zh-TW', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {currentUser && comment.userId === currentUser.uid && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="delete-comment-btn"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div
                  className="comment-text"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(comment.text),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCard;
