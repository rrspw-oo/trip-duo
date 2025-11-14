import React, { useEffect, useState } from "react";
import ConfirmedAccommodationTicket from "./ConfirmedAccommodationTicket";

const ROUTE_TRANSPORT_OPTIONS = ["地鐵", "巴士", "計程車", "其他"];

const createEmptyFormState = () => ({
  name: "",
  address: "",
  mapsUrl: "",
  price: "",
  checkIn: "",
  checkOut: "",
  subwayLine: "",
  subwayStation: "",
  bookingDate: "",
  bookingCode: "",
  bookingUrl: "",
  isPaid: false,
  routes: [],
  notes: "",
});

const createEmptyRoute = () => ({
  id: `route-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  destinationName: "",
  transportMode: "",
  line: "",
  station: "",
  requiresTransfer: false,
  transferSegments: [],
});

const normalizeAccommodation = (data) => {
  if (!data) {
    return createEmptyFormState();
  }

  const fallbackStation = data.subwayStation || data.nearbyStation || "";

  return {
    ...createEmptyFormState(),
    ...data,
    subwayStation: fallbackStation,
    mapsUrl: data.mapsUrl || "",
    routes: Array.isArray(data.routes)
      ? data.routes.map((route) => ({
          ...createEmptyRoute(),
          ...route,
          id: route.id || `route-${Math.random().toString(36).slice(2, 7)}`,
          line: route.line || route.subwayLine || "",
          transferSegments: Array.isArray(route.transferSegments)
            ? route.transferSegments.map((segment) => ({
                id:
                  segment.id ||
                  `transfer-${Math.random().toString(36).slice(2, 7)}`,
                line: segment.line || "",
                station: segment.station || "",
              }))
            : Array.isArray(route.transferStations)
            ? route.transferStations.map((stationValue, index) => ({
                id: `transfer-${Math.random()
                  .toString(36)
                  .slice(2, 7)}-${index}`,
                line: "",
                station: stationValue || "",
              }))
            : [],
        }))
      : [],
  };
};

const AccommodationTab = ({
  confirmedAccommodation,
  onSaveConfirmedAccommodation,
  onClearConfirmedAccommodation,
}) => {
  const [formData, setFormData] = useState(createEmptyFormState());
  const [isDirty, setIsDirty] = useState(false);
  const [transferInputs, setTransferInputs] = useState({});
  const [isEditingView, setIsEditingView] = useState(true);

  useEffect(() => {
    const normalized = normalizeAccommodation(confirmedAccommodation);
    setFormData(normalized);
    setIsDirty(false);
    setTransferInputs({});
    setIsEditingView(!confirmedAccommodation);
  }, [confirmedAccommodation]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const addRoute = () => {
    setFormData((prev) => ({
      ...prev,
      routes: [...prev.routes, createEmptyRoute()],
    }));
    setIsDirty(true);
  };

  const updateRoute = (routeId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      routes: prev.routes.map((route) =>
        route.id === routeId ? { ...route, [field]: value } : route
      ),
    }));
    setIsDirty(true);
  };

  const removeRoute = (routeId) => {
    setFormData((prev) => ({
      ...prev,
      routes: prev.routes.filter((route) => route.id !== routeId),
    }));
    setTransferInputs((prev) => {
      const updated = { ...prev };
      delete updated[routeId];
      return updated;
    });
    setIsDirty(true);
  };

  const handleTransferInputChange = (routeId, field, value) => {
    setTransferInputs((prev) => ({
      ...prev,
      [routeId]: {
        ...(prev[routeId] || { line: "", station: "" }),
        [field]: value,
      },
    }));
  };

  const addTransferSegment = (routeId) => {
    const pending = transferInputs[routeId] || { line: "", station: "" };
    const cleanedLine = pending.line.trim();
    const cleanedStation = pending.station.trim();
    if (!cleanedLine && !cleanedStation) return;

    setFormData((prev) => ({
      ...prev,
      routes: prev.routes.map((route) =>
        route.id === routeId
          ? {
              ...route,
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
      ),
    }));
    setTransferInputs((prev) => ({
      ...prev,
      [routeId]: { line: "", station: "" },
    }));
    setIsDirty(true);
  };

  const removeTransferSegment = (routeId, segmentIndex) => {
    setFormData((prev) => ({
      ...prev,
      routes: prev.routes.map((route) =>
        route.id === routeId
          ? {
              ...route,
              transferSegments: (route.transferSegments || []).filter(
                (_, index) => index !== segmentIndex
              ),
            }
          : route
      ),
    }));
    setIsDirty(true);
  };

  const handleReset = () => {
    setFormData(normalizeAccommodation(confirmedAccommodation));
    setTransferInputs({});
    setIsDirty(false);
  };

  const handleSave = () => {
    if (onSaveConfirmedAccommodation) {
      onSaveConfirmedAccommodation(formData);
      setIsDirty(false);
      setIsEditingView(false);
    }
  };

  const handleClear = () => {
    if (
      onClearConfirmedAccommodation &&
      window.confirm("確定要清除已儲存的住宿資訊嗎？")
    ) {
      onClearConfirmedAccommodation();
      setFormData(createEmptyFormState());
      setTransferInputs({});
      setIsDirty(false);
      setIsEditingView(true);
    }
  };

  const handleStartEdit = () => {
    setFormData(normalizeAccommodation(confirmedAccommodation));
    setTransferInputs({});
    setIsDirty(false);
    setIsEditingView(true);
  };

  const handleCancelEdit = () => {
    setFormData(normalizeAccommodation(confirmedAccommodation));
    setTransferInputs({});
    setIsDirty(false);
    setIsEditingView(false);
  };

  const isFormValid = Boolean(
    formData.name.trim() &&
      formData.address.trim() &&
      formData.price.trim() &&
      formData.checkIn &&
      formData.checkOut
  );

  const renderForm = () => (
    <div className="accommodation-single-pane">
      <section className="accommodation-section">
        <div className="section-heading">
          <h3>住宿資訊</h3>
        </div>
        <div className="form-grid form-grid-two">
          <div className="input-group">
            <label>住宿名稱 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="請輸入住宿名稱"
              required
              maxLength={100}
            />
          </div>
          <div className="input-group">
            <label>住宿金額 *</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleFieldChange("price", e.target.value)}
              placeholder="NT$ / JPY / USD ..."
              required
              maxLength={20}
            />
          </div>
          <div className="input-group input-group-full">
            <label>住宿地址 *</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              placeholder="輸入完整地址，方便查詢"
              rows={2}
              required
              maxLength={300}
            />
          </div>
          <div className="input-group input-group-full">
            <label>Google Map</label>
            <input
              type="url"
              value={formData.mapsUrl}
              onChange={(e) => handleFieldChange("mapsUrl", e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>
          <div className="input-group">
            <label>入住時間 *</label>
            <input
              type="datetime-local"
              value={formData.checkIn}
              onChange={(e) => handleFieldChange("checkIn", e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>退房時間 *</label>
            <input
              type="datetime-local"
              value={formData.checkOut}
              onChange={(e) => handleFieldChange("checkOut", e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>地鐵線別</label>
            <input
              type="text"
              value={formData.subwayLine}
              onChange={(e) => handleFieldChange("subwayLine", e.target.value)}
              placeholder="例如：堺筋線"
              maxLength={60}
            />
          </div>
          <div className="input-group">
            <label>地鐵站別</label>
            <input
              type="text"
              value={formData.subwayStation}
              onChange={(e) =>
                handleFieldChange("subwayStation", e.target.value)
              }
              placeholder="例如：日本橋站"
              maxLength={60}
            />
          </div>
        </div>
      </section>

      <section className="accommodation-section">
        <div className="section-heading">
          <h3>路線規劃</h3>
        </div>
        {formData.routes.length === 0 && (
          <div className="empty-route">
            <p>尚未新增任何目的地</p>
            <p className="empty-route-hint">
              例如：到機場、到某個景點的交通方式
            </p>
          </div>
        )}
        <div className="route-list">
          {formData.routes.map((route) => (
            <div key={route.id} className="route-card">
              <div className="route-card-header">
                <h4>{route.destinationName || "目的地"}</h4>
                <button
                  type="button"
                  className="btn-remove btn-small"
                  onClick={() => removeRoute(route.id)}
                >
                  刪除
                </button>
              </div>
              <div className="form-grid form-grid-two">
                <div className="input-group">
                  <label>目的地 *</label>
                  <input
                    type="text"
                    value={route.destinationName}
                    onChange={(e) =>
                      updateRoute(route.id, "destinationName", e.target.value)
                    }
                    placeholder="例如：關西機場"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>交通工具 *</label>
                  <select
                    value={route.transportMode}
                    onChange={(e) =>
                      updateRoute(route.id, "transportMode", e.target.value)
                    }
                    required
                  >
                    <option value="">選擇交通方式</option>
                    {ROUTE_TRANSPORT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>出發線別</label>
                  <input
                    type="text"
                    value={route.line}
                    onChange={(e) =>
                      updateRoute(route.id, "line", e.target.value)
                    }
                    placeholder="例如：堺筋線"
                  />
                </div>
                <div className="input-group">
                  <label>搭乘站</label>
                  <input
                    type="text"
                    value={route.station}
                    onChange={(e) =>
                      updateRoute(route.id, "station", e.target.value)
                    }
                    placeholder="如：難波站"
                  />
                </div>
                <div className="toggle-inline-row">
                  <span>是否需轉乘</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={route.requiresTransfer || false}
                      onChange={(e) => {
                        updateRoute(
                          route.id,
                          "requiresTransfer",
                          e.target.checked
                        );
                        if (!e.target.checked) {
                          updateRoute(route.id, "transferSegments", []);
                          setTransferInputs((prev) => {
                            const updated = { ...prev };
                            delete updated[route.id];
                            return updated;
                          });
                        }
                      }}
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>
              {route.requiresTransfer && (
                <div className="transfer-section">
                  <label>轉乘線別與站名</label>
                  <div className="transfer-input-row">
                    <input
                      type="text"
                      value={transferInputs[route.id]?.line || ""}
                      onChange={(e) =>
                        handleTransferInputChange(
                          route.id,
                          "line",
                          e.target.value
                        )
                      }
                      placeholder="轉乘線"
                    />
                    <input
                      type="text"
                      value={transferInputs[route.id]?.station || ""}
                      onChange={(e) =>
                        handleTransferInputChange(
                          route.id,
                          "station",
                          e.target.value
                        )
                      }
                      placeholder="轉乘站"
                    />
                    <button
                      type="button"
                      className="btn btn-small"
                      onClick={() => addTransferSegment(route.id)}
                    >
                      新增
                    </button>
                  </div>
                  {route.transferSegments &&
                    route.transferSegments.length > 0 && (
                      <div className="transfer-chips">
                        {route.transferSegments.map((segment, index) => (
                          <span
                            key={`${route.id}-segment-${index}`}
                            className="transfer-chip"
                          >
                            {segment.line && <strong>{segment.line}</strong>}{" "}
                            {segment.station}
                            <button
                              type="button"
                              onClick={() =>
                                removeTransferSegment(route.id, index)
                              }
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline" onClick={addRoute}>
          + 新增目的地
        </button>
      </section>

      <section className="accommodation-section">
        <div className="section-heading">
          <h3>訂房資訊 / 備註</h3>
        </div>
        <div className="form-grid form-grid-two">
          <div className="input-group">
            <label>訂房日期</label>
            <input
              type="date"
              value={formData.bookingDate || ""}
              onChange={(e) => handleFieldChange("bookingDate", e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>訂位代號</label>
            <input
              type="text"
              value={formData.bookingCode || ""}
              onChange={(e) => handleFieldChange("bookingCode", e.target.value)}
              maxLength={30}
            />
          </div>
          <div className="input-group input-group-full">
            <label>訂房網址</label>
            <input
              type="url"
              value={formData.bookingUrl || ""}
              onChange={(e) => handleFieldChange("bookingUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="input-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPaid || false}
                onChange={(e) => handleFieldChange("isPaid", e.target.checked)}
              />
              <span>已轉帳 / 已付款</span>
            </label>
          </div>
          <div className="input-group input-group-full">
            <label>備註</label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              placeholder="行程提醒、入住須知等"
              rows={3}
            />
          </div>
        </div>
      </section>

      <div className="accommodation-actions">
        <button
          type="button"
          className="btn btn-large"
          onClick={handleSave}
          disabled={!isFormValid || !isDirty}
        >
          儲存住宿資訊
        </button>
        <button
          type="button"
          className="btn btn-outline btn-large"
          onClick={handleReset}
          disabled={!isDirty}
        >
          重設
        </button>
        {confirmedAccommodation && (
          <button
            type="button"
            className="text-link-button"
            onClick={handleCancelEdit}
          >
            取消編輯
          </button>
        )}
        {confirmedAccommodation && (
          <button
            type="button"
            className="text-link-button danger-link"
            onClick={handleClear}
          >
            清除已儲存內容
          </button>
        )}
      </div>
    </div>
  );

  const renderDisplay = () => (
    <div className="confirmation-view-wrapper">
      <ConfirmedAccommodationTicket accommodation={formData} />
      <div className="confirmation-summary">
        <div className="summary-grid">
          <div>
            <span className="summary-label">入住時間</span>
            <p>
              {formData.checkIn
                ? new Date(formData.checkIn).toLocaleString()
                : "—"}
            </p>
          </div>
          <div>
            <span className="summary-label">Checkout</span>
            <p>
              {formData.checkOut
                ? new Date(formData.checkOut).toLocaleString()
                : "—"}
            </p>
          </div>
          <div>
            <span className="summary-label">住宿金額</span>
            <p>{formData.price || "—"}</p>
          </div>
          <div>
            <span className="summary-label">訂房日期</span>
            <p>{formData.bookingDate || "—"}</p>
          </div>
          <div>
            <span className="summary-label">訂位代號</span>
            <p>{formData.bookingCode || "—"}</p>
          </div>
          <div>
            <span className="summary-label">付款狀態</span>
            <p>{formData.isPaid ? "已付款" : "尚未付款"}</p>
          </div>
          <div className="summary-full">
            <span className="summary-label">訂房網址</span>
            {formData.bookingUrl ? (
              <a href={formData.bookingUrl} target="_blank" rel="noreferrer">
                {formData.bookingUrl}
              </a>
            ) : (
              <p>—</p>
            )}
          </div>
          <div className="summary-full">
            <span className="summary-label">Google Map</span>
            {formData.mapsUrl ? (
              <a href={formData.mapsUrl} target="_blank" rel="noreferrer">
                開啟連結
              </a>
            ) : (
              <p>—</p>
            )}
          </div>
          {formData.notes && (
            <div className="summary-full">
              <span className="summary-label">備註</span>
              <p>{formData.notes}</p>
            </div>
          )}
        </div>
      </div>
      <div className="confirmation-actions">
        <button className="btn btn-large" onClick={handleStartEdit}>
          編輯住宿資訊
        </button>
        <button className="btn btn-outline btn-large" onClick={handleClear}>
          清除內容
        </button>
      </div>
    </div>
  );

  return (
    <div className="tab-content accommodation-tab-content">
      {isEditingView ? renderForm() : renderDisplay()}
    </div>
  );
};

export default AccommodationTab;
