import React, { useState, useEffect, useRef, useMemo } from "react";
import { differenceInDays } from "date-fns";
import DOMPurify from "dompurify";
import debounce from "lodash.debounce";
import "../styles/App.css";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../config/firebase";
import Login from "./Login";
import PlanSelection from "./PlanSelection";
import {
  ref,
  onValue,
  set,
  push,
  update,
  remove,
  get,
} from "firebase/database";

// Import constants
import { TABS } from "../constants/options";

// Import utilities
import { calculateDaysFromDates, generateDailyPlansStructure } from "../utils/dateHelpers";
import { generateSecureInviteCode } from "../utils/inviteCodeGenerator";
import { getUserInitials, getAvatarColor } from "../utils/firebaseHelpers";

// Import components
import CustomDropdown from "./common/CustomDropdown";

// Import Tab components
import TravelTimeTab from "./tabs/TravelTimeTab";
import FlightTab from "./tabs/FlightTab";
import DailyPlanTab from "./tabs/DailyPlanTab";

function App() {
  const { user, logout, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [planId, setPlanId] = useState(null);

  // Tab 2: Flight tickets
  const [flights, setFlights] = useState([
    {
      airline: "China Airlines",
      outboundDeparture: "2025-10-01 08:00",
      outboundArrival: "2025-10-01 12:00",
      outboundComment: "",
      returnDeparture: "2025-10-10 14:00",
      returnArrival: "2025-10-10 18:00",
      returnComment: "",
      price: "$500",
    },
    {
      airline: "EVA Air",
      outboundDeparture: "2025-10-01 10:00",
      outboundArrival: "2025-10-01 14:00",
      outboundComment: "",
      returnDeparture: "2025-10-10 16:00",
      returnArrival: "2025-10-10 20:00",
      returnComment: "",
      price: "$450",
    },
  ]);
  const [newFlight, setNewFlight] = useState({
    airline: "",
    outboundDeparture: "",
    outboundArrival: "",
    outboundComment: "",
    returnDeparture: "",
    returnArrival: "",
    returnComment: "",
    price: "",
    comments: [],
    votes: {},
  });

  const [editingId, setEditingId] = useState(null);
  const [editedFlight, setEditedFlight] = useState({});

  // Check if user has a plan when they log in
  useEffect(() => {
    if (!user) {
      setPlanId(null);
      return;
    }

    let isMounted = true;
    const checkUserPlan = async () => {
      const userRef = ref(database, `users/${user.uid}`);
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists() && isMounted) {
          const userData = snapshot.val();
          if (userData.planId) {
            setPlanId(userData.planId);
          }
        }
      } catch (error) {
        console.error("Error checking user plan:", error);
      }
    };

    checkUserPlan();
    return () => { isMounted = false; };
  }, [user]);

  // Listen to user plan changes (after joining a plan)
  useEffect(() => {
    if (!user || !planId) return;

    const userRef = ref(database, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.planId && userData.planId !== planId) {
          setPlanId(userData.planId);
        }
      }
    });

    return unsubscribe;
  }, [user, planId]);

  const isUpdatingFromFirebase = useRef(false);

  // Debounced Firebase update function
  const debouncedUpdateFirebase = useMemo(
    () =>
      debounce((planId, data) => {
        update(ref(database, `travelPlans/${planId}`), data);
      }, 1000),
    []
  );

  useEffect(() => {
    if (!planId || loading) return;

    const planRef = ref(database, `travelPlans/${planId}`);

    const unsubscribe = onValue(planRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        isUpdatingFromFirebase.current = true;
        setStartDate(data.startDate || "");
        setEndDate(data.endDate || "");

        // Handle totalDays and dailyPlans synchronization
        const storedTotalDays = data.totalDays || 0;
        const storedDailyPlans = data.dailyPlans || {};
        const dailyPlansCount = Object.keys(storedDailyPlans).length;

        // If totalDays exists but dailyPlans is empty, regenerate dailyPlans
        if (storedTotalDays > 0 && dailyPlansCount === 0) {
          const newPlans = generateDailyPlansStructure(storedTotalDays, {});
          setTotalDays(storedTotalDays);
          setDailyPlans(newPlans);
          // Update Firebase with generated plans
          if (planId) {
            update(ref(database, `travelPlans/${planId}/dailyPlans`), newPlans);
          }
        } else {
          // Normal case: use stored values or calculate from dailyPlans
          const calculatedTotalDays = storedTotalDays || dailyPlansCount;
          setTotalDays(calculatedTotalDays);
          setDailyPlans(storedDailyPlans);
        }

        setSkippedDays(data.skippedDays || {});
        setFlights(
          Object.entries(data.flights || {}).map(([id, flight]) => ({
            ...flight,
            id,
          }))
        );
        setTimeout(() => { isUpdatingFromFirebase.current = false; }, 0);
      }
    });

    return unsubscribe;
  }, [planId, loading, user]);

  useEffect(() => {
    if (planId && !isUpdatingFromFirebase.current) {
      debouncedUpdateFirebase(planId, { startDate });
    }
  }, [startDate, planId, debouncedUpdateFirebase]);

  useEffect(() => {
    if (planId && !isUpdatingFromFirebase.current) {
      debouncedUpdateFirebase(planId, { endDate });
    }
  }, [endDate, planId, debouncedUpdateFirebase]);

  // Auto-fill flight dates when travel dates change
  useEffect(() => {
    if (startDate && endDate) {
      setNewFlight(prev => ({
        ...prev,
        outboundDeparture: startDate + 'T' + (prev.outboundDeparture?.split('T')[1] || ''),
        outboundArrival: startDate + 'T' + (prev.outboundArrival?.split('T')[1] || ''),
        returnDeparture: endDate + 'T' + (prev.returnDeparture?.split('T')[1] || ''),
        returnArrival: endDate + 'T' + (prev.returnArrival?.split('T')[1] || '')
      }));
    }
  }, [startDate, endDate]);

  const addFlight = () => {
    if (
      !newFlight.airline ||
      !newFlight.outboundDeparture ||
      !newFlight.outboundArrival ||
      !newFlight.returnDeparture ||
      !newFlight.returnArrival ||
      !newFlight.price
    )
      return;

    if (!planId) return;

    const flightRef = ref(database, `travelPlans/${planId}/flights`);
    const newFlightKey = push(flightRef).key;
    const newFlightData = { ...newFlight, id: newFlightKey };
    set(
      ref(database, `travelPlans/${planId}/flights/${newFlightKey}`),
      newFlightData
    );
    setNewFlight({
      airline: "",
      outboundDeparture: "",
      outboundArrival: "",
      outboundComment: "",
      returnDeparture: "",
      returnArrival: "",
      returnComment: "",
      price: "",
      comments: [],
      votes: {},
    });
  };

  const deleteFlight = (id) => {
    if (!planId) return;
    remove(ref(database, `travelPlans/${planId}/flights/${id}`));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const startEdit = (id) => {
    setEditingId(id);
    const flight = flights.find((f) => f.id === id);
    setEditedFlight({ ...flight });
  };

  const saveEdit = (id) => {
    if (!planId) return;
    update(ref(database, `travelPlans/${planId}/flights/${id}`), editedFlight);
    setEditingId(null);
    setEditedFlight({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedFlight({});
  };

  const updateEditedFlight = (field, value) => {
    setEditedFlight({ ...editedFlight, [field]: value });
  };

  // Flight voting and comments
  const handleVote = (flightId) => {
    if (!planId || !user) return;

    const flight = flights.find((f) => f.id === flightId);
    const votes = flight?.votes || {};
    const hasVoted = votes[user.uid];

    const updatedVotes = { ...votes };
    if (hasVoted) {
      delete updatedVotes[user.uid];
    } else {
      updatedVotes[user.uid] = true;
    }

    update(ref(database, `travelPlans/${planId}/flights/${flightId}`), {
      votes: updatedVotes,
    });
  };

  const addComment = (flightId, commentText) => {
    if (!planId || !user || !commentText.trim()) return;

    const flight = flights.find((f) => f.id === flightId);
    const comments = flight?.comments || [];

    const newComment = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userPhoto: user.photoURL,
      text: commentText,
      timestamp: Date.now(),
    };

    update(ref(database, `travelPlans/${planId}/flights/${flightId}`), {
      comments: [...comments, newComment],
    });
  };

  const deleteComment = (flightId, commentId) => {
    if (!planId || !user) return;

    const flight = flights.find((f) => f.id === flightId);
    const comments = flight?.comments || [];

    const updatedComments = comments.filter((c) => !(c.id === commentId && c.userId === user.uid));

    update(ref(database, `travelPlans/${planId}/flights/${flightId}`), {
      comments: updatedComments,
    });
  };

  // Tab 3: Daily plans with locations
  const [dailyPlans, setDailyPlans] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const [skippedDays, setSkippedDays] = useState({});

  const updateDayPlan = (day, plan) => {
    // Remove placeholder when updating a day plan
    const updatedPlan = { ...plan };
    delete updatedPlan._placeholder;

    setDailyPlans({ ...dailyPlans, [day]: updatedPlan });
    if (planId) {
      update(ref(database, `travelPlans/${planId}/dailyPlans`), {
        [day]: updatedPlan,
      });
    }
  };

  const toggleDayExpanded = (day) => {
    setExpandedDays({ ...expandedDays, [day]: !expandedDays[day] });
  };

  const toggleDayCompleted = (day) => {
    const newSkippedDays = { ...skippedDays, [day]: !skippedDays[day] };
    setSkippedDays(newSkippedDays);
    if (planId) {
      update(ref(database, `travelPlans/${planId}`), {
        skippedDays: newSkippedDays
      });
    }
  };

  const addLocationToDay = (day, location) => {
    const currentPlan = dailyPlans[day] || { locations: {} };
    // Convert locations to array if it's an object
    const locationsArray = Array.isArray(currentPlan.locations)
      ? currentPlan.locations
      : Object.values(currentPlan.locations || {});
    const newLocations = [...locationsArray, location];
    updateDayPlan(day, { ...currentPlan, locations: newLocations });
  };

  const removeLocationFromDay = (day, locationIndex) => {
    const currentPlan = dailyPlans[day];
    if (!currentPlan || !currentPlan.locations) return;
    // Convert locations to array if it's an object
    const locationsArray = Array.isArray(currentPlan.locations)
      ? currentPlan.locations
      : Object.values(currentPlan.locations || {});
    const newLocations = locationsArray.filter((_, idx) => idx !== locationIndex);
    updateDayPlan(day, { ...currentPlan, locations: newLocations });
  };


  const calculateDays = async () => {
    const days = calculateDaysFromDates(startDate, endDate);

    if (days > 0) {
      // Check if totalDays already exists (user is recalculating)
      if (totalDays > 0) {
        const confirmed = window.confirm(
          "確定要重新計算天數嗎？\n\n天數變更後，原有的每日規劃將會保留，但「已完成」狀態會被重置。"
        );
        if (!confirmed) {
          return;
        }
      }

      // Generate daily plans structure using utility function
      const newPlans = generateDailyPlansStructure(days, dailyPlans);

      // Update local state immediately
      setTotalDays(days);
      setDailyPlans(newPlans);
      setSkippedDays({});

      // Auto-fill flight dates from travel dates
      setNewFlight(prev => ({
        ...prev,
        outboundDeparture: startDate ? startDate + 'T' : '',
        outboundArrival: startDate ? startDate + 'T' : '',
        returnDeparture: endDate ? endDate + 'T' : '',
        returnArrival: endDate ? endDate + 'T' : ''
      }));

      // Update Firebase with proper data structure
      if (planId) {
        await update(ref(database, `travelPlans/${planId}`), {
          totalDays: days,
          dailyPlans: newPlans,
          skippedDays: {},
        });
      }
    } else {
      alert("結束日期必須晚於開始日期");
      setTotalDays(0);
      setDailyPlans({});
      if (planId) {
        await update(ref(database, `travelPlans/${planId}`), {
          totalDays: 0,
          dailyPlans: {},
        });
      }
    }
  };

  const handleCreatePlan = async () => {
    if (!user) return;

    const newPlanId = user.uid;
    const planRef = ref(database, `travelPlans/${newPlanId}`);
    const userRef = ref(database, `users/${user.uid}`);

    // Create new plan
    const initialData = {
      ownerUid: user.uid,
      users: { [user.uid]: true },
      startDate: "",
      endDate: "",
      totalDays: 0,
      dailyPlans: {},
      flights: {},
      createdAt: Date.now(),
    };

    await set(planRef, initialData);
    await set(userRef, { planId: newPlanId, joinedAt: Date.now() });

    setPlanId(newPlanId);
  };

  const handleJoinPlanFromSelection = async (code) => {
    console.log("=== handleJoinPlanFromSelection CALLED ===");
    console.log("User:", user);
    console.log("Code:", code);

    if (!user || !code) {
      console.error("Missing user or code", { user, code });
      return;
    }

    console.log("=== JOIN PLAN FROM SELECTION ===");
    console.log("User UID:", user.uid);
    console.log("User email:", user.email);
    console.log("Invite Code:", code);

    try {
      console.log("Step 1: Reading invite code...");
      console.log("Database URL:", database.app.options.databaseURL);
      const inviteRef = ref(database, `invites/${code}`);
      console.log("Invite ref created:", inviteRef.toString());
      const snapshot = await get(inviteRef);
      console.log("Invite snapshot exists:", snapshot.exists());

      if (!snapshot.exists()) {
        alert("Invalid invite code.");
        return;
      }

      const invite = snapshot.val();
      console.log("Invite data:", invite);

      if (invite.status !== "pending") {
        alert("This invite code has already been used.");
        return;
      }

      // Step 2: Grant temporary read access
      console.log("Step 2: Granting temporary access...");
      console.log("inviteAuth path:", `inviteAuth/${invite.planId}/${user.uid}`);
      const inviteAuthRef = ref(database, `inviteAuth/${invite.planId}/${user.uid}`);
      await set(inviteAuthRef, { grantedAt: Date.now() });
      console.log("Access granted successfully");

      // Step 3: Now can read the plan
      console.log("Step 3: Reading plan data...");
      console.log("Plan path:", `travelPlans/${invite.planId}`);
      const planRef = ref(database, `travelPlans/${invite.planId}`);
      const planSnapshot = await get(planRef);
      console.log("Plan read successful, exists:", planSnapshot.exists());

      if (!planSnapshot.exists()) {
        await remove(inviteAuthRef); // Clean up
        alert("Plan not found.");
        return;
      }

      const plan = planSnapshot.val();
      console.log("Plan data:", plan);
      const currentUsers = plan.users || { [plan.ownerUid]: true };
      console.log("Current users:", currentUsers);

      if (Object.keys(currentUsers).length >= 2) {
        await remove(inviteAuthRef); // Clean up
        alert("This plan already has 2 users.");
        return;
      }

      // Step 4: Join the plan
      console.log("Step 4: Joining plan...");
      const updatedUsers = { ...currentUsers, [user.uid]: true };
      console.log("Updated users:", updatedUsers);
      await update(planRef, { users: updatedUsers });
      console.log("Plan users updated");

      await set(ref(database, `users/${user.uid}`), {
        planId: invite.planId,
        joinedAt: Date.now()
      });
      console.log("User data updated");

      // Step 5: Clean up
      console.log("Step 5: Cleaning up...");
      await remove(inviteRef);
      await remove(inviteAuthRef);
      console.log("Cleanup complete");

      console.log("Setting planId to:", invite.planId);
      setPlanId(invite.planId);

      // Give React time to update before showing alert
      setTimeout(() => {
        alert("Successfully joined the plan!");
      }, 100);

    } catch (error) {
      console.error("=== ERROR JOINING PLAN ===");
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Full error:", error);
      alert("Failed to join plan: " + error.message);
    }
  };

  const generateInvite = () => {
    if (!planId) return;
    const code = generateSecureInviteCode();
    const inviteRef = ref(database, `invites/${code}`);
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    set(inviteRef, {
      planId,
      status: "pending",
      timestamp: Date.now(),
      expiresAt
    });
    setGeneratedInviteCode(code);
    setShowInviteModal(true);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(generatedInviteCode);
    alert("Invite code copied to clipboard!");
  };

  const joinPlan = async () => {
    if (!user || !inviteCode) return;

    try {
      console.log("Step 1: Reading invite code...");
      const inviteRef = ref(database, `invites/${inviteCode}`);
      const snapshot = await get(inviteRef);

      if (!snapshot.exists()) {
        alert("Invalid invite code.");
        return;
      }

      const invite = snapshot.val();
      console.log("Invite data:", invite);

      if (invite.status !== "pending") {
        alert("This invite code has already been used.");
        return;
      }

      // Check if invite has expired (24 hours)
      const EXPIRATION_TIME = 24 * 60 * 60 * 1000;
      if (invite.expiresAt && Date.now() > invite.expiresAt) {
        await remove(inviteRef);
        alert("This invite code has expired.");
        return;
      }

      // Step 2: Grant temporary read access
      console.log("Step 2: Granting temporary access...");
      const inviteAuthRef = ref(database, `inviteAuth/${invite.planId}/${user.uid}`);
      await set(inviteAuthRef, { grantedAt: Date.now() });
      console.log("Access granted successfully");

      // Step 3: Now can read the plan
      console.log("Step 3: Reading plan data...");
      const planRef = ref(database, `travelPlans/${invite.planId}`);
      const planSnapshot = await get(planRef);
      console.log("Plan read successful");

      if (!planSnapshot.exists()) {
        await remove(inviteAuthRef); // Clean up
        alert("Plan not found.");
        return;
      }

      const plan = planSnapshot.val();
      console.log("Plan data:", plan);
      const currentUsers = plan.users || { [plan.ownerUid]: true };

      if (Object.keys(currentUsers).length >= 2) {
        await remove(inviteAuthRef); // Clean up
        alert("The plan already has 2 users.");
        return;
      }

      // Step 4: Join the plan
      console.log("Step 4: Joining plan...");
      const updatedUsers = { ...currentUsers, [user.uid]: true };
      await update(planRef, { users: updatedUsers });
      console.log("Plan users updated");

      await set(ref(database, `users/${user.uid}`), {
        planId: invite.planId,
        joinedAt: Date.now()
      });
      console.log("User data updated");

      // Step 5: Clean up
      console.log("Step 5: Cleaning up...");
      await remove(inviteRef);
      await remove(inviteAuthRef);

      setPlanId(invite.planId);
      setShowJoinModal(false);
      setInviteCode("");
      alert("Joined the shared plan successfully!");

    } catch (error) {
      console.error("Error joining plan:", error);
      console.error("Error code:", error.code);
      console.error("Error stack:", error.stack);
      alert("Failed to join plan: " + error.message);
    }
  };

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
  };

  // Helper function to get user initials

  const Tab1 = () => {
    // Check if dates have changed from current calculated days
    const hasDateChanged = useMemo(() => {
      if (!startDate || !endDate || totalDays === 0) return true;
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) return true;
      const calculatedDays = differenceInDays(end, start) + 1;
      return calculatedDays !== totalDays;
    }, [startDate, endDate, totalDays]);

    return (
      <div className="tab-content">
        <h2>旅行時間</h2>
        <div className="form-group">
          <label>開始日期:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>結束日期:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={calculateDays}
          className="btn"
          disabled={!hasDateChanged}
          style={{
            opacity: hasDateChanged ? 1 : 0.5,
            cursor: hasDateChanged ? 'pointer' : 'not-allowed'
          }}
        >
          計算天數
        </button>
        {totalDays > 0 && <p className="result">總共 {totalDays} 天</p>}
      </div>
    );
  };

  const Tab2 = () => {
    const airlineOptions = [
      "長榮航空",
      "中華航空",
      "星宇航空",
      "全日航"
    ];

    return (
      <div className="tab-content">
        <h2>機票確認</h2>
        <div className="flight-form">
          <div className="flight-form-section">
            <div className="flight-form-header">
              <span className="flight-type-tag outbound">去程</span>
            </div>
            <div className="flight-time-inputs">
              <div className="time-input-group">
                <label>起飛時間</label>
                <input
                  type="datetime-local"
                  value={newFlight.outboundDeparture}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, outboundDeparture: e.target.value })
                  }
                />
              </div>
              <div className="time-input-group">
                <label>抵達時間</label>
                <input
                  type="datetime-local"
                  value={newFlight.outboundArrival}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, outboundArrival: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flight-comment-input">
              <label>去程備註</label>
              <textarea
                placeholder="例如：預計提前2小時到機場、搭乘捷運前往..."
                value={newFlight.outboundComment}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, outboundComment: e.target.value })
                }
                maxLength="500"
                rows="2"
              />
            </div>
          </div>

          <div className="flight-form-section">
            <div className="flight-form-header">
              <span className="flight-type-tag return">回程</span>
            </div>
            <div className="flight-time-inputs">
              <div className="time-input-group">
                <label>起飛時間</label>
                <input
                  type="datetime-local"
                  value={newFlight.returnDeparture}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, returnDeparture: e.target.value })
                  }
                />
              </div>
              <div className="time-input-group">
                <label>抵達時間</label>
                <input
                  type="datetime-local"
                  value={newFlight.returnArrival}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, returnArrival: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flight-comment-input">
              <label>回程備註</label>
              <textarea
                placeholder="例如：預計提前3小時到機場、注意退稅時間..."
                value={newFlight.returnComment}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, returnComment: e.target.value })
                }
                maxLength="500"
                rows="2"
              />
            </div>
          </div>

          <div className="flight-form-footer">
            <CustomDropdown
              value={newFlight.airline}
              onChange={(value) => setNewFlight({ ...newFlight, airline: value })}
              options={airlineOptions}
              placeholder="航空公司"
            />
            <input
              placeholder="票價"
              value={newFlight.price}
              onChange={(e) =>
                setNewFlight({ ...newFlight, price: e.target.value })
              }
              maxLength="20"
            />
            <button onClick={addFlight} className="btn">
              新增航班
            </button>
          </div>
        </div>

        <div className="flights-list">
          {flights.map((flight) => (
            <div key={flight.id} className="flight-card">
              {editingId === flight.id ? (
                <>
                  <div className="flight-card-header">
                    <input
                      value={editedFlight.airline}
                      onChange={(e) =>
                        updateEditedFlight("airline", e.target.value)
                      }
                      className="airline-input"
                    />
                  </div>
                  <div className="flight-card-body">
                    <div className="flight-section">
                      <span className="flight-type-tag outbound">去程</span>
                      <div className="flight-times">
                        <div className="time-group">
                          <label>起飛</label>
                          <input
                            type="datetime-local"
                            value={editedFlight.outboundDeparture}
                            onChange={(e) =>
                              updateEditedFlight("outboundDeparture", e.target.value)
                            }
                          />
                        </div>
                        <div className="time-group">
                          <label>抵達</label>
                          <input
                            type="datetime-local"
                            value={editedFlight.outboundArrival}
                            onChange={(e) =>
                              updateEditedFlight("outboundArrival", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="flight-comment-input edit-mode">
                        <label>去程備註</label>
                        <textarea
                          placeholder="例如：預計提前2小時到機場、搭乘捷運前往..."
                          value={editedFlight.outboundComment || ""}
                          onChange={(e) =>
                            updateEditedFlight("outboundComment", e.target.value)
                          }
                          maxLength="500"
                          rows="2"
                        />
                      </div>
                    </div>
                    <div className="flight-section">
                      <span className="flight-type-tag return">回程</span>
                      <div className="flight-times">
                        <div className="time-group">
                          <label>起飛</label>
                          <input
                            type="datetime-local"
                            value={editedFlight.returnDeparture}
                            onChange={(e) =>
                              updateEditedFlight("returnDeparture", e.target.value)
                            }
                          />
                        </div>
                        <div className="time-group">
                          <label>抵達</label>
                          <input
                            type="datetime-local"
                            value={editedFlight.returnArrival}
                            onChange={(e) =>
                              updateEditedFlight("returnArrival", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="flight-comment-input edit-mode">
                        <label>回程備註</label>
                        <textarea
                          placeholder="例如：預計提前3小時到機場、注意退稅時間..."
                          value={editedFlight.returnComment || ""}
                          onChange={(e) =>
                            updateEditedFlight("returnComment", e.target.value)
                          }
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
                        onChange={(e) =>
                          updateEditedFlight("price", e.target.value)
                        }
                        maxLength="20"
                      />
                    </div>
                  </div>
                  <div className="flight-card-actions">
                    <button onClick={() => saveEdit(flight.id)} className="btn">
                      儲存
                    </button>
                    <button onClick={cancelEdit} className="btn-remove">
                      取消
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flight-card-header">
                    <h3>{flight.airline}</h3>
                    <span className="flight-price">{flight.price}</span>
                  </div>
                  <div className="flight-card-body">
                    <div className="flight-section">
                      <span className="flight-type-tag outbound">去程</span>
                      <div className="flight-times">
                        <div className="time-display">
                          <span className="time-label">起飛</span>
                          <span className="time-value">{flight.outboundDeparture}</span>
                        </div>
                        <span className="arrow">→</span>
                        <div className="time-display">
                          <span className="time-label">抵達</span>
                          <span className="time-value">{flight.outboundArrival}</span>
                        </div>
                      </div>
                      {flight.outboundComment && (
                        <div className="flight-comment outbound" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(flight.outboundComment) }} />
                      )}
                    </div>
                    <div className="flight-section">
                      <span className="flight-type-tag return">回程</span>
                      <div className="flight-times">
                        <div className="time-display">
                          <span className="time-label">起飛</span>
                          <span className="time-value">{flight.returnDeparture}</span>
                        </div>
                        <span className="arrow">→</span>
                        <div className="time-display">
                          <span className="time-label">抵達</span>
                          <span className="time-value">{flight.returnArrival}</span>
                        </div>
                      </div>
                      {flight.returnComment && (
                        <div className="flight-comment return" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(flight.returnComment) }} />
                      )}
                    </div>
                  </div>
                  <div className="flight-card-actions">
                    <button
                      onClick={() => startEdit(flight.id)}
                      className="btn"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => deleteFlight(flight.id)}
                      className="btn-remove"
                    >
                      刪除
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {flights.length === 0 && (
            <p className="empty-state">無航班資料</p>
          )}
        </div>
      </div>
    );
  };

  const Tab3 = () => {
    const transportationOptions = ["山手線", "中央線", "京濱東北線", "JR線", "地鐵", "步行", "巴士"];
    const timePeriodOptions = ["早上", "中午", "下午", "晚上"];
    const categoryOptions = ["必去景點", "必吃美食", "購物", "住宿", "其他"];

    const LocationForm = ({ day }) => {
      const [locationName, setLocationName] = useState("");
      const [transportation, setTransportation] = useState("");
      const [timePeriod, setTimePeriod] = useState("");
      const [category, setCategory] = useState("");
      const [notes, setNotes] = useState("");

      const handleAddLocation = () => {
        if (!locationName || !transportation || !timePeriod || !category) {
          alert("請填寫所有必填欄位");
          return;
        }

        const newLocation = {
          name: locationName,
          transportation,
          timePeriod,
          category,
          notes,
        };

        addLocationToDay(day, newLocation);

        // Reset form
        setLocationName("");
        setTransportation("");
        setTimePeriod("");
        setCategory("");
        setNotes("");
      };

      return (
        <div className="location-form">
          <div className="form-row">
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="地點名稱"
              className="location-input"
              maxLength="100"
            />
          </div>
          <div className="form-row form-row-three">
            <CustomDropdown
              value={transportation}
              onChange={setTransportation}
              options={transportationOptions}
              placeholder="交通路線"
            />
            <CustomDropdown
              value={timePeriod}
              onChange={setTimePeriod}
              options={timePeriodOptions}
              placeholder="時段"
            />
            <CustomDropdown
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              placeholder="分類"
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="備註 (選填)"
              className="location-input"
            />
          </div>
          <button onClick={handleAddLocation} className="btn btn-add-location">
            新增地點
          </button>
        </div>
      );
    };

    const LocationCard = ({ location, day, index }) => {
      return (
        <div className="location-card">
          <div className="location-card-header">
            <h4 className="location-name" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(location.name) }} />
            <button
              onClick={() => removeLocationFromDay(day, index)}
              className="btn-delete-location"
            >
              ✕
            </button>
          </div>
          <div className="location-tags">
            <span className="tag tag-transportation">{location.transportation}</span>
            <span className="tag tag-time">{location.timePeriod}</span>
            <span className="tag tag-category">{location.category}</span>
          </div>
          {location.notes && (
            <div className="location-notes">
              <small>{location.notes}</small>
            </div>
          )}
        </div>
      );
    };

    // Sort days: incomplete first, then completed (both in numerical order)
    const sortedDays = Object.keys(dailyPlans).sort((a, b) => {
      const numA = parseInt(a.replace("Day ", ""));
      const numB = parseInt(b.replace("Day ", ""));

      const isCompletedA = skippedDays[a];
      const isCompletedB = skippedDays[b];

      // If completion status is different, incomplete comes first
      if (isCompletedA !== isCompletedB) {
        return isCompletedA ? 1 : -1;
      }

      // If same completion status, sort by day number
      return numA - numB;
    });

    const visibleDays = sortedDays;

    return (
      <div className="tab-content">
        <h2>每日規劃</h2>
        {totalDays > 0 ? (
          visibleDays.map((day) => {
            const isExpanded = expandedDays[day];
            const dayPlan = dailyPlans[day] || { locations: {} };
            // Convert locations to array if it's an object
            const locations = Array.isArray(dayPlan.locations)
              ? dayPlan.locations
              : Object.values(dayPlan.locations || {});
            const isCompleted = skippedDays[day];

            return (
              <div key={day} className={`day-accordion ${isCompleted ? 'completed' : ''}`}>
                <div className="day-accordion-header">
                  <div
                    className="day-accordion-header-left"
                    onClick={() => toggleDayExpanded(day)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-md)', cursor: 'pointer' }}
                  >
                    <h3>{day}</h3>
                    <span className="day-location-count">
                      {locations.length} 個地點
                    </span>
                    <span className="accordion-arrow">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                  <div className="day-complete-checkbox-container" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isCompleted || false}
                      onChange={() => toggleDayCompleted(day)}
                      className="day-complete-checkbox"
                      title="標記為已完成"
                    />
                  </div>
                </div>
                {isExpanded && (
                  <div className="day-accordion-content">
                    <LocationForm day={day} />
                    <div className="locations-list">
                      {locations.map((location, index) => (
                        <LocationCard
                          key={index}
                          location={location}
                          day={day}
                          index={index}
                        />
                      ))}
                      {locations.length === 0 && (
                        <p className="empty-state">尚未新增地點</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>請先設定旅行時間以生成每日規劃</p>
        )}
      </div>
    );
  };


  const renderTabContent = () => {
    switch (currentTab) {
      case 1:
        return (
          <TravelTimeTab
            startDate={startDate}
            endDate={endDate}
            totalDays={totalDays}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onCalculateDays={calculateDays}
          />
        );
      case 2:
        return (
          <FlightTab
            flights={flights}
            newFlight={newFlight}
            setNewFlight={setNewFlight}
            editingId={editingId}
            editedFlight={editedFlight}
            onAddFlight={addFlight}
            onStartEdit={startEdit}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onDeleteFlight={deleteFlight}
            onUpdateEditedField={updateEditedFlight}
            onVote={handleVote}
            onAddComment={addComment}
            onDeleteComment={deleteComment}
            currentUser={user}
            startDate={startDate}
            endDate={endDate}
          />
        );
      case 3:
        return (
          <DailyPlanTab
            totalDays={totalDays}
            dailyPlans={dailyPlans}
            skippedDays={skippedDays}
            expandedDays={expandedDays}
            onToggleDayExpanded={toggleDayExpanded}
            onToggleDayCompleted={toggleDayCompleted}
            onAddLocation={addLocationToDay}
            onRemoveLocation={removeLocationFromDay}
          />
        );
      default:
        return (
          <TravelTimeTab
            startDate={startDate}
            endDate={endDate}
            totalDays={totalDays}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onCalculateDays={calculateDays}
          />
        );
    }
  };

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  // Always show PlanSelection if no planId
  if (!planId) {
    return (
      <PlanSelection
        onCreatePlan={handleCreatePlan}
        onJoinPlan={handleJoinPlanFromSelection}
      />
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-top">
          <div className="user-profile-section">
            <div className="user-avatar-container">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="user-avatar-img"
                />
              ) : (
                <div
                  className="user-avatar-circle"
                  style={{ backgroundColor: getAvatarColor(user) }}
                >
                  {getUserInitials(user)}
                </div>
              )}
            </div>
          </div>
          <div className="auth-section">
            <div>
              <button onClick={generateInvite} className="btn">
                分享計畫
              </button>
              <button onClick={() => setShowJoinModal(true)} className="btn">
                加入計畫
              </button>
              <button onClick={logout} className="btn">
                登出
              </button>
            </div>
          </div>
        </div>
        <nav className="tabs-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${currentTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <main className="main-content">{renderTabContent()}</main>
      </header>

      {/* Invite Code Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal invite-modal">
            <h3>分享您的計畫</h3>
            <p>將此邀請碼分享給您的旅伴：</p>
            <div className="invite-code-display">
              {generatedInviteCode}
            </div>
            <div className="modal-buttons">
              <button onClick={copyInviteCode} className="btn">
                複製代碼
              </button>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setGeneratedInviteCode("");
                }}
                className="btn-remove"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Plan Modal */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>加入共享計畫</h3>
            <p>輸入邀請碼以加入旅伴的旅行計畫。</p>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="輸入邀請碼"
              className="comment-textarea"
              style={{ width: "100%", marginBottom: "1rem" }}
            />
            <div className="modal-buttons">
              <button onClick={joinPlan} className="btn">
                加入
              </button>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setInviteCode("");
                }}
                className="btn-remove"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
