import React, { useState, useEffect } from "react";
import TagSelector from "../common/TagSelector";
import CustomDropdown from "../common/CustomDropdown";
import DeleteIcon from "../common/DeleteIcon";
import { TIME_PERIOD_OPTIONS } from "../../constants/options";

const ROUTE_TRANSPORT_OPTIONS = ["地鐵", "巴士", "步行", "計程車", "其他"];
const MAX_LOCATION_ROUTES = 3;
const MAX_ROUTE_POIS = 5;

const createEmptyRoute = () => ({
  id: `loc-route-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  transportMode: "",
  customTransport: "",
  departAt: "",
  arriveAt: "",
  line: "",
  station: "",
  fare: "",
  requiresTransfer: false,
  transferSegments: [],
  isSaved: false,
  pois: [],
});

const createEmptyPoiDraft = () => ({
  name: "",
  address: "",
  openingHours: {
    start: "",
    end: "",
    days: []
  },
  note: "",
});

const LocationForm = ({
  day,
  onAddLocation,
  onUpdateLocation,
  currentUser,
  onScheduleSaved,
  onCancel,
  initialLocation = null,
  mode = "create",
  editingLocationIndex = null,
}) => {
  const [destination, setDestination] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [routes, setRoutes] = useState([]);
  const [routeTransferInputs, setRouteTransferInputs] = useState({});
  const [routePoiDrafts, setRoutePoiDrafts] = useState({});
  const [routePoiFormVisible, setRoutePoiFormVisible] = useState({});
  const isEditMode = mode === "edit";
  const primaryButtonLabel = isEditMode ? "更新此行程" : "儲存此行程";
  const cancelButtonLabel = isEditMode ? "取消編輯" : "取消新增";
  const destinationInitial =
    destination?.trim()?.charAt(0)?.toUpperCase() ||
    day?.trim()?.charAt(0) ||
    "旅";
  const canAddRoute = !isEditMode && routes.length < MAX_LOCATION_ROUTES;

  const resetFormState = () => {
    setDestination("");
    setTimePeriod("");
    setRoutes([]);
    setRouteTransferInputs({});
    setRoutePoiDrafts({});
    setRoutePoiFormVisible({});
  };

  const addLocationRoute = () => {
    if (routes.length >= MAX_LOCATION_ROUTES) return;
    setRoutes((prev) => [...prev, createEmptyRoute()]);
  };

  const updateLocationRoute = (routeId, field, value) => {
    setRoutes((prev) =>
      prev.map((route) => {
        if (route.id !== routeId) return route;
        const updatedRoute = { ...route, [field]: value };
        if (field === "transportMode" && value !== "其他") {
          updatedRoute.customTransport = "";
        }
        if (field === "requiresTransfer" && !value) {
          updatedRoute.transferSegments = [];
          setRouteTransferInputs((prevInputs) => {
            const copy = { ...prevInputs };
            delete copy[routeId];
            return copy;
          });
        }
        return updatedRoute;
      })
    );
  };

  const removeLocationRoute = (routeId) => {
    setRoutes((prev) => prev.filter((route) => route.id !== routeId));
    setRouteTransferInputs((prev) => {
      const updated = { ...prev };
      delete updated[routeId];
      return updated;
    });
    setRoutePoiDrafts((prev) => {
      const updated = { ...prev };
      delete updated[routeId];
      return updated;
    });
    setRoutePoiFormVisible((prev) => {
      const updated = { ...prev };
      delete updated[routeId];
      return updated;
    });
  };

  const handleRouteTransferInputChange = (routeId, field, value) => {
    setRouteTransferInputs((prev) => ({
      ...prev,
      [routeId]: {
        ...(prev[routeId] || { line: "", station: "" }),
        [field]: value,
      },
    }));
  };

  const addLocationTransferSegment = (routeId) => {
    const pending = routeTransferInputs[routeId] || { line: "", station: "" };
    const cleanedLine = pending.line.trim();
    const cleanedStation = pending.station.trim();
    if (!cleanedLine && !cleanedStation) return;

    setRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId
          ? {
              ...route,
              isSaved: false,
              transferSegments: [
                ...(route.transferSegments || []),
                {
                  id: `transfer-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 7)}`,
                  line: cleanedLine,
                  station: cleanedStation,
                },
              ],
            }
          : route
      )
    );

    setRouteTransferInputs((prev) => ({
      ...prev,
      [routeId]: { line: "", station: "" },
    }));
  };

  const removeLocationTransferSegment = (routeId, segmentIndex) => {
    setRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId
          ? {
              ...route,
              isSaved: false,
              transferSegments: (route.transferSegments || []).filter(
                (_, idx) => idx !== segmentIndex
              ),
            }
          : route
      )
    );
  };

  const sanitizePoi = (poi, fallbackId) => ({
    id:
      poi.id ||
      fallbackId ||
      `poi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: poi.name?.trim() || "",
    address: poi.address?.trim() || "",
    visitTime: poi.visitTime || "",
    note: poi.note?.trim() || "",
  });

  const sanitizeRoute = (route, index) => {
    const transportValue =
      route.transportMode === "其他"
        ? route.customTransport?.trim() || "其他"
        : route.transportMode || "";

    const sanitizedPois = Array.isArray(route.pois)
      ? route.pois
          .map((poi, poiIndex) =>
            sanitizePoi(poi, `route-${route.id}-poi-${poiIndex}`)
          )
          .filter((poi) => poi.name)
      : [];

    return {
      id: route.id || `route-${Date.now()}-${index}`,
      transportMode: transportValue || "",
      departAt: route.departAt || "",
      arriveAt: route.arriveAt || "",
      line: route.line?.trim() || "",
      station: route.station?.trim() || "",
      fare: route.fare?.trim() || "",
      requiresTransfer: Boolean(route.requiresTransfer),
      transferSegments: Array.isArray(route.transferSegments)
        ? route.transferSegments.map((segment, segmentIndex) => ({
            id: segment.id || `transfer-${route.id}-${segmentIndex}`,
            line: segment.line?.trim() || "",
            station: segment.station?.trim() || "",
          }))
        : [],
      pois: sanitizedPois,
    };
  };

  const mapExistingRoutesToState = (routesSource, isEditMode) => {
    const normalizedList = Array.isArray(routesSource)
      ? routesSource
      : Object.values(routesSource || {});

    return normalizedList.map((route, idx) => {
      const baseTransport = route.transportMode || "";
      const isCustomTransport =
        baseTransport && !ROUTE_TRANSPORT_OPTIONS.includes(baseTransport);
      return {
        ...createEmptyRoute(),
        ...route,
        id:
          route.id ||
          `loc-route-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)}-${idx}`,
        transportMode: isCustomTransport ? "其他" : baseTransport || "",
        customTransport: isCustomTransport
          ? baseTransport
          : route.customTransport || "",
        departAt: route.departAt || "",
        arriveAt: route.arriveAt || "",
        line: route.line || "",
        station: route.station || "",
        fare: route.fare || "",
        requiresTransfer: Boolean(route.requiresTransfer),
        transferSegments: Array.isArray(route.transferSegments)
          ? route.transferSegments.map((segment, segmentIndex) => ({
              id:
                segment.id ||
                `transfer-${route.id || "existing"}-${segmentIndex}`,
              line: segment.line || "",
              station: segment.station || "",
            }))
          : [],
        pois: Array.isArray(route.pois)
          ? route.pois.map((poi, poiIndex) =>
              sanitizePoi(
                poi,
                `route-${route.id || "existing"}-poi-${poiIndex}`
              )
            )
          : [],
        isSaved: true,
      };
    });
  };

  useEffect(() => {
    if (isEditMode && initialLocation) {
      setDestination(initialLocation.destination || initialLocation.name || "");
      setTimePeriod(initialLocation.timePeriod || "");
      const preparedRoutes = mapExistingRoutesToState(
        initialLocation.routes,
        isEditMode
      );
      setRoutes(preparedRoutes);
      setRouteTransferInputs({});
      setRoutePoiDrafts({});
      setRoutePoiFormVisible({});
    }
  }, [isEditMode, initialLocation]);

  const handleSaveRoute = (routeId) => {
    let validationFailed = false;
    setRoutes((prev) => {
      const updated = prev.map((route, index) => {
        if (route.id !== routeId) return route;
        const transportRequired =
          route.transportMode && route.transportMode !== "其他"
            ? route.transportMode
            : route.customTransport?.trim();
        if (!transportRequired) {
          validationFailed = true;
          return route;
        }
        return { ...sanitizeRoute(route, index), isSaved: true };
      });
      return validationFailed ? prev : updated;
    });

    if (validationFailed) {
      alert("請填寫交通工具");
    } else {
      setRouteTransferInputs((prev) => {
        const copy = { ...prev };
        delete copy[routeId];
        return copy;
      });
      setRoutePoiFormVisible((prev) => {
        const copy = { ...prev };
        delete copy[routeId];
        return copy;
      });
    }
  };

  const getRoutePoiDraft = (routeId) =>
    routePoiDrafts[routeId] || createEmptyPoiDraft();

  const updateRoutePoiDraft = (routeId, field, value) => {
    setRoutePoiDrafts((prev) => ({
      ...prev,
      [routeId]: {
        ...(prev[routeId] || createEmptyPoiDraft()),
        [field]: value,
      },
    }));
  };

  const addPoiToRoute = (routeId) => {
    const draft = getRoutePoiDraft(routeId);
    if (!draft.name.trim()) {
      alert("請輸入必訪地點名稱");
      return;
    }

    setRoutes((prev) =>
      prev.map((route) => {
        if (route.id !== routeId) return route;
        const currentPois = route.pois || [];
        if (currentPois.length >= MAX_ROUTE_POIS) {
          alert(`單一路線最多 ${MAX_ROUTE_POIS} 筆必訪地點`);
          return route;
        }
        return {
          ...route,
          pois: [
            ...currentPois,
            sanitizePoi(
              {
                ...draft,
                id: `poi-${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2, 5)}`,
              },
              null
            ),
          ],
        };
      })
    );

    setRoutePoiDrafts((prev) => ({
      ...prev,
      [routeId]: createEmptyPoiDraft(),
    }));
  };

  const updateRoutePoiField = (routeId, poiIndex, field, value) => {
    setRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId
          ? {
              ...route,
              isSaved: false,
              pois: (route.pois || []).map((poi, idx) =>
                idx === poiIndex ? { ...poi, [field]: value } : poi
              ),
            }
          : route
      )
    );
  };

  const removePoiFromRoute = (routeId, poiIndex) => {
    setRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId
          ? {
              ...route,
              pois: (route.pois || []).filter((_, idx) => idx !== poiIndex),
            }
          : route
      )
    );
  };

  const toggleRoutePoiForm = (routeId, visible) => {
    setRoutePoiFormVisible((prev) => ({
      ...prev,
      [routeId]: visible,
    }));
    if (!visible) {
      setRoutePoiDrafts((prev) => ({
        ...prev,
        [routeId]: createEmptyPoiDraft(),
      }));
    }
  };

  const handleAddLocation = () => {
    if (!destination.trim()) {
      alert("請輸入目的地");
      return;
    }

    if (!timePeriod) {
      alert("請選擇時段");
      return;
    }

    if (routes.length === 0) {
      alert("請至少建立一條路線");
      return;
    }

    const preparedRoutes = isEditMode
      ? routes
      : routes.filter((route) => route.isSaved);

    if (!isEditMode && preparedRoutes.length === 0) {
      alert("請先完成路線儲存");
      return;
    }

    const sanitizedRoutes = preparedRoutes.map(sanitizeRoute);
    const flattenedPois = sanitizedRoutes.flatMap((route) => route.pois || []);

    const locationData = {
      id: (isEditMode && initialLocation && initialLocation.id) || Date.now(),
      name: destination.trim(),
      destination: destination.trim(),
      timePeriod,
      routes: sanitizedRoutes,
      pois: flattenedPois,
    };

    if (currentUser) {
      locationData.createdBy = {
        email: currentUser.email,
        uid: currentUser.uid,
      };
    }

    if (
      isEditMode &&
      typeof onUpdateLocation === "function" &&
      editingLocationIndex !== null
    ) {
      onUpdateLocation(day, editingLocationIndex, locationData);
    } else {
      onAddLocation(day, locationData);
    }
    resetFormState();

    if (onScheduleSaved) {
      onScheduleSaved();
    }
  };

  const handleCancelForm = () => {
    resetFormState();
    if (onCancel) {
      onCancel();
    }
  };

  const WEEKDAYS = [
    { key: "Mon", label: "M" },
    { key: "Tue", label: "T" },
    { key: "Wed", label: "W" },
    { key: "Thu", label: "Th" },
    { key: "Fri", label: "F" },
    { key: "Sat", label: "Sa" },
    { key: "Sun", label: "Su" }
  ];

  const renderDaySelector = (selectedDays, onChange) => (
    <div className="day-selector">
      {WEEKDAYS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`day-btn ${selectedDays.includes(key) ? "selected" : ""}`}
          onClick={() => {
            const newDays = selectedDays.includes(key)
              ? selectedDays.filter(d => d !== key)
              : [...selectedDays, key];
            onChange(newDays);
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const renderRoutePoiManager = (route) => {
    const isPoiFormVisible = routePoiFormVisible[route.id];
    const canAddPoi = (route.pois || []).length < MAX_ROUTE_POIS;

    return (
        <div className="planner-poi-card">
        <div className="planner-poi-card-header">
          <div className="planner-poi-title">
            <strong>地點安排</strong>
          </div>
          {!isPoiFormVisible && (
            <button
              type="button"
              className="btn btn-soft planner-poi-add"
              onClick={() => toggleRoutePoiForm(route.id, true)}
              disabled={!canAddPoi}
            >
              + 新增地點
            </button>
          )}
        </div>
        <div className="planner-poi-body">
          {route.pois && route.pois.length > 0 ? (
            <ul className="planner-poi-list">
              {route.pois.map((poi, idx) => (
                <li key={poi.id || idx} className="planner-poi-item">
                  <div className="planner-poi-index">{idx + 1}</div>
                  <div className="planner-poi-content">
                    {isEditMode ? (
                      <>
                        <div className="planner-field">
                          <label>地點名稱 *</label>
                          <input
                            type="text"
                            value={poi.name || ""}
                            onChange={(e) =>
                              updateRoutePoiField(
                                route.id,
                                idx,
                                "name",
                                e.target.value
                              )
                            }
                            className="location-input"
                            placeholder="例如：鎌倉小町通咖啡"
                          />
                        </div>
                        <div className="planner-field">
                          <label>營業時間</label>
                          <div className="planner-two-col">
                            <input
                              type="time"
                              value={
                                poi.openingHours?.start || poi.visitTime || ""
                              }
                              onChange={(e) =>
                                updateRoutePoiField(
                                  route.id,
                                  idx,
                                  "openingHours",
                                  {
                                    ...(poi.openingHours || {
                                      start: "",
                                      end: "",
                                      days: [],
                                    }),
                                    start: e.target.value,
                                  }
                                )
                              }
                              className="location-input"
                              placeholder="開始時間"
                            />
                            <input
                              type="time"
                              value={poi.openingHours?.end || ""}
                              onChange={(e) =>
                                updateRoutePoiField(
                                  route.id,
                                  idx,
                                  "openingHours",
                                  {
                                    ...(poi.openingHours || {
                                      start: "",
                                      end: "",
                                      days: [],
                                    }),
                                    end: e.target.value,
                                  }
                                )
                              }
                              className="location-input"
                              placeholder="結束時間"
                            />
                          </div>
                          {renderDaySelector(
                            poi.openingHours?.days || [],
                            (days) =>
                              updateRoutePoiField(
                                route.id,
                                idx,
                                "openingHours",
                                {
                                  ...(poi.openingHours || {
                                    start: "",
                                    end: "",
                                    days: [],
                                  }),
                                  days,
                                }
                              )
                          )}
                        </div>
                        <div className="planner-field">
                          <label>地址</label>
                          <input
                            type="text"
                            value={poi.address || ""}
                            onChange={(e) =>
                              updateRoutePoiField(
                                route.id,
                                idx,
                                "address",
                                e.target.value
                              )
                            }
                            className="location-input"
                            placeholder="輸入地址或定位"
                          />
                        </div>
                        <div className="planner-field">
                          <label>備註</label>
                          <input
                            type="text"
                            value={poi.note || ""}
                            onChange={(e) =>
                              updateRoutePoiField(
                                route.id,
                                idx,
                                "note",
                                e.target.value
                              )
                            }
                            className="location-input"
                            placeholder="例如：10:00 開門，記得預約"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="planner-poi-summary">
                          <div className="planner-poi-title-line">
                            <span className="planner-point-dot" aria-hidden="true"></span>
                            <span className="planner-summary-value">
                              {poi.name || "--"}
                            </span>
                          </div>
                          {poi.visitTime && (
                            <span className="planner-time-chip">
                              {poi.visitTime}
                            </span>
                          )}
                        </div>
                        <div className="planner-poi-address-block">
                          <span className="planner-summary-label">地址</span>
                          {poi.address ? (
                            <button
                              type="button"
                              className="poi-address-link"
                              onClick={() =>
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    poi.address
                                  )}`,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                            >
                              {poi.address}
                            </button>
                          ) : (
                            <span className="planner-summary-value">--</span>
                          )}
                        </div>
                        {poi.note && (
                          <p className="planner-poi-note">
                            <span className="planner-summary-label">備註</span>
                            <span className="planner-summary-text">
                              {poi.note}
                            </span>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <DeleteIcon
                    className="route-poi-remove"
                    onClick={() => removePoiFromRoute(route.id, idx)}
                  />
                </li>
              ))}
            </ul>
          ) : null}
          {isPoiFormVisible && (
            <div className="planner-poi-form">
              <div className="planner-field">
                <label>地點名稱 *</label>
                <input
                  type="text"
                  value={getRoutePoiDraft(route.id).name}
                  onChange={(e) =>
                    updateRoutePoiDraft(route.id, "name", e.target.value)
                  }
                  className="location-input"
                  placeholder="例如：鎌倉小町通咖啡"
                />
              </div>
              <div className="planner-field">
                <label>地址</label>
                <input
                  type="text"
                  value={getRoutePoiDraft(route.id).address}
                  onChange={(e) =>
                    updateRoutePoiDraft(route.id, "address", e.target.value)
                  }
                  className="location-input"
                  placeholder="輸入地址或定位"
                />
              </div>
              <div className="planner-field">
                <label>營業時間</label>
                <div className="planner-two-col">
                  <input
                    type="time"
                    value={getRoutePoiDraft(route.id).openingHours?.start || ""}
                    onChange={(e) =>
                      updateRoutePoiDraft(route.id, "openingHours", {
                        ...(getRoutePoiDraft(route.id).openingHours || {
                          start: "",
                          end: "",
                          days: [],
                        }),
                        start: e.target.value,
                      })
                    }
                    className="location-input"
                    placeholder="開始時間"
                  />
                  <input
                    type="time"
                    value={getRoutePoiDraft(route.id).openingHours?.end || ""}
                    onChange={(e) =>
                      updateRoutePoiDraft(route.id, "openingHours", {
                        ...(getRoutePoiDraft(route.id).openingHours || {
                          start: "",
                          end: "",
                          days: [],
                        }),
                        end: e.target.value,
                      })
                    }
                    className="location-input"
                    placeholder="結束時間"
                  />
                </div>
                {renderDaySelector(
                  getRoutePoiDraft(route.id).openingHours?.days || [],
                  (days) =>
                    updateRoutePoiDraft(route.id, "openingHours", {
                      ...(getRoutePoiDraft(route.id).openingHours || {
                        start: "",
                        end: "",
                        days: [],
                      }),
                      days,
                    })
                )}
              </div>
              <div className="planner-field">
                <label>備註</label>
                <input
                  type="text"
                  value={getRoutePoiDraft(route.id).note}
                  onChange={(e) =>
                    updateRoutePoiDraft(route.id, "note", e.target.value)
                  }
                  className="location-input"
                  placeholder="例如：10:00 開門，記得預約"
                />
              </div>
              <div className="planner-poi-actions stacked">
                <button
                  type="button"
                  className="btn btn-poi-level"
                  onClick={() => addPoiToRoute(route.id)}
                  disabled={!canAddPoi}
                >
                  儲存地點
                </button>
                <button
                  type="button"
                  className="btn btn-poi-secondary"
                  onClick={() => toggleRoutePoiForm(route.id, false)}
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRouteForm = (route, routeIndex) => (
    <div className="planner-route-body">
      <div className="planner-field">
        <label>交通工具 *</label>
        <CustomDropdown
          value={route.transportMode}
          onChange={(option) =>
            updateLocationRoute(route.id, "transportMode", option)
          }
          options={ROUTE_TRANSPORT_OPTIONS}
          placeholder="選擇交通方式"
        />
      </div>
      {route.transportMode === "其他" && (
        <div className="planner-field">
          <label>自訂交通方式</label>
          <input
            type="text"
            value={route.customTransport || ""}
            onChange={(e) =>
              updateLocationRoute(route.id, "customTransport", e.target.value)
            }
            className="location-input"
            placeholder="請輸入交通工具"
          />
        </div>
      )}
      <div className="planner-field">
        <label>費用</label>
        <input
          type="text"
          value={route.fare}
          onChange={(e) => updateLocationRoute(route.id, "fare", e.target.value)}
          className="location-input"
          placeholder="例如：¥920"
        />
      </div>
      <div className="planner-two-col">
        <div className="planner-field">
          <label>線別</label>
          <input
            type="text"
            value={route.line}
            onChange={(e) => updateLocationRoute(route.id, "line", e.target.value)}
            className="location-input"
            placeholder="例如：JR 橫須賀線"
          />
        </div>
        <div className="planner-field">
          <label>停留點</label>
          <input
            type="text"
            value={route.station}
            onChange={(e) =>
              updateLocationRoute(route.id, "station", e.target.value)
            }
            className="location-input"
            placeholder="例如：新宿"
          />
        </div>
      </div>
      <div className="planner-two-col">
        <div className="planner-field">
          <label>抵達站</label>
          <input
            type="text"
            value={route.arrivalStation || ""}
            onChange={(e) =>
              updateLocationRoute(route.id, "arrivalStation", e.target.value)
            }
            className="location-input"
            placeholder="例如：成田機場"
          />
        </div>
        <div className="planner-field planner-switch-field">
          <label>是否需轉乘</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={route.requiresTransfer || false}
              onChange={(e) =>
                updateLocationRoute(route.id, "requiresTransfer", e.target.checked)
              }
            />
            <span className="slider" />
          </label>
        </div>
      </div>
      <div className="planner-field">
        <label>備註</label>
        <input
          type="text"
          value={route.note || ""}
          onChange={(e) => updateLocationRoute(route.id, "note", e.target.value)}
          className="location-input"
          placeholder="例如：可使用 Suica 卡"
        />
      </div>

      {route.requiresTransfer && (
        <div className="planner-transfer-card">
          <label>轉乘線別與站名</label>
          <div className="planner-transfer-row">
            <input
              type="text"
              value={routeTransferInputs[route.id]?.line || ""}
              onChange={(e) =>
                handleRouteTransferInputChange(route.id, "line", e.target.value)
              }
              className="location-input"
              placeholder="轉乘線"
            />
            <input
              type="text"
              value={routeTransferInputs[route.id]?.station || ""}
              onChange={(e) =>
                handleRouteTransferInputChange(route.id, "station", e.target.value)
              }
              className="location-input"
              placeholder="轉乘站"
            />
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => addLocationTransferSegment(route.id)}
            >
              新增
            </button>
          </div>
          {route.transferSegments && route.transferSegments.length > 0 && (
            <div className="transfer-chips">
              {route.transferSegments.map((segment, index) => (
                <span
                  key={`${route.id}-segment-${index}`}
                  className="transfer-chip"
                >
                  <span className="transfer-index">{index + 1}</span>
                  {segment.line && <strong>{segment.line}</strong>} {segment.station}
                  <button
                    type="button"
                    onClick={() => removeLocationTransferSegment(route.id, index)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {renderRoutePoiManager(route)}

      {!isEditMode && (
        <div className="planner-inline-actions">
          <button
            type="button"
            className="btn btn-soft ghost-button planner-route-action"
            onClick={() => removeLocationRoute(route.id)}
          >
            取消新增
          </button>
          <button
            type="button"
            className="btn btn-route-level planner-route-action"
            onClick={() => handleSaveRoute(route.id)}
          >
            儲存路線
          </button>
        </div>
      )}
    </div>
  );

  const renderRouteSummary = (route) => (
    <div className="planner-route-body">
      <div className="planner-summary-grid">
        <div>
          <span className="planner-summary-label">交通工具</span>
          <span className="planner-summary-value">
            {route.transportMode || route.customTransport || "--"}
          </span>
        </div>
        <div>
          <span className="planner-summary-label">線別</span>
          <span className="planner-summary-value">{route.line || "--"}</span>
        </div>
        <div>
          <span className="planner-summary-label">停留點</span>
          <span className="planner-summary-value">{route.station || "--"}</span>
        </div>
        <div>
          <span className="planner-summary-label">抵達站</span>
          <span className="planner-summary-value">
            {route.arrivalStation || "--"}
          </span>
        </div>
        <div>
          <span className="planner-summary-label">費用 (JPY)</span>
          <span className="planner-summary-value">{route.fare || "--"}</span>
        </div>
        <div>
          <span className="planner-summary-label">備註</span>
          <span className="planner-summary-value">{route.note || "--"}</span>
        </div>
      </div>
      {route.requiresTransfer && route.transferSegments?.length > 0 && (
        <div className="planner-transfer-summary">
          <span className="planner-summary-label">轉乘</span>
          <div className="planner-transfer-chips">
            {route.transferSegments.map((segment, index) => (
              <span className="planner-transfer-chip" key={segment.id || index}>
                {segment.line && <strong>{segment.line}</strong>}
                <span>{segment.station}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      {renderRoutePoiManager(route)}
    </div>
  );

  return (
    <div className="journey-planner">
      <div className="planner-hero">
        <button
          type="button"
          className="btn btn-soft hero-add-plan"
          onClick={resetFormState}
        >
          + 新增行程
        </button>
      </div>

      <section className="planner-section">
        <div className="planner-section-heading">
          <span>行程概述</span>
        </div>
        <div className="planner-field">
          <label>目的地 *</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="例如：鎌倉一日遊"
            className="location-input"
            maxLength="80"
          />
        </div>
        <div className="planner-field">
          <TagSelector
            value={timePeriod}
            onChange={setTimePeriod}
            options={TIME_PERIOD_OPTIONS}
            placeholder=""
            label="時段"
          />
        </div>
      </section>

      <section className="planner-section planner-routes-panel">
        <div className="planner-section-heading with-actions">
          <div>
            <p className="planner-eyebrow">路線規劃</p>
            <h4>安排行程交通</h4>
          </div>
        </div>
        {routes.length === 0 ? (
          <div className="planner-empty-route-card">
            {canAddRoute && (
              <button
                type="button"
                className="btn btn-soft"
                onClick={addLocationRoute}
              >
                + 新增路線
              </button>
            )}
          </div>
        ) : (
          <div className="planner-route-stack">
            {routes.map((route, routeIndex) => (
              <div
                key={route.id}
                className={`planner-route-card ${
                  route.isSaved ? "is-saved" : ""
                }`}
              >
                <div className="planner-route-card-header">
                  <div className="route-pill">路線 {routeIndex + 1}</div>
                  <button
                    type="button"
                    className="planner-delete-btn"
                    aria-label="刪除路線"
                    onClick={() => removeLocationRoute(route.id)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6H5H21"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 11V17"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 11V17"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                {route.isSaved && !isEditMode
                  ? renderRouteSummary(route, routeIndex)
                  : renderRouteForm(route, routeIndex)}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="planner-cta-row">
        {onCancel && (
          <button
            type="button"
            className="btn btn-soft ghost-button planner-cta-btn"
            onClick={handleCancelForm}
          >
            {cancelButtonLabel}
          </button>
        )}
        <button
          onClick={handleAddLocation}
          className="btn btn-location-level btn-save-schedule planner-cta-btn"
        >
          確認更新
        </button>
      </div>
    </div>
  );
};

export default LocationForm;
