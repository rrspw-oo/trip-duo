import React, { useState } from "react";
import "../styles/PlanSelection.css";

function PlanSelection({ onCreatePlan, onJoinPlan }) {
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const handleJoinPlan = () => {
    if (inviteCode.trim()) {
      onJoinPlan(inviteCode.trim().toUpperCase());
    }
  };

  return (
    <div className="plan-selection-container">
      <div className="plan-selection-card">
        <div className="plan-selection-header">
          <h1>Welcome to Travel Planner</h1>
          <p>Choose how you want to start planning your journey</p>
        </div>

        <div className="plan-selection-content">
          {!showJoinInput ? (
            <div className="plan-options">
              <button className="plan-option-btn create-btn" onClick={onCreatePlan}>
                <div className="plan-option-icon">✨</div>
                <h3>Create New Plan</h3>
                <p>Start a new travel plan and invite others to collaborate</p>
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <button className="plan-option-btn join-btn" onClick={() => setShowJoinInput(true)}>
                <div className="plan-option-icon">🤝</div>
                <h3>Join Existing Plan</h3>
                <p>Enter an invite code to join a travel plan</p>
              </button>
            </div>
          ) : (
            <div className="join-plan-form">
              <button className="back-btn" onClick={() => setShowJoinInput(false)}>
                ← Back
              </button>
              <h3>Join a Travel Plan</h3>
              <p>Enter the invite code shared by your travel partner</p>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Enter invite code (e.g., ABC123)"
                className="invite-code-input"
                maxLength="6"
              />
              <button
                className="submit-join-btn"
                onClick={handleJoinPlan}
                disabled={inviteCode.length !== 6}
              >
                Join Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanSelection;
