import React, { useEffect, useState } from "react";
import ConfirmedAccommodationTicket from "./ConfirmedAccommodationTicket";
import DeleteIcon from "../common/DeleteIcon";

const ROUTE_TRANSPORT_OPTIONS = ["地鐵", "巴士", "計程車", "其他"];
const PAYMENT_OPTIONS = [
  { value: "paid", label: "已付款" },
  { value: "half", label: "已付50%" },
  { value: "unpaid", label: "未付款" },
];

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
  paymentStatus: "unpaid",
  arrivalMethods: [],
  notes: "",
});

const createEmptyArrivalMethod = () => ({
  id: `arrival-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  mode: "subway",
  line: "",
  station: "",
  fare: "",
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
    paymentStatus:
      data.paymentStatus ||
      (data.isPaid ? "paid" : data.isPending ? "half" : "unpaid"),
    arrivalMethods: Array.isArray(data.arrivalMethods)
      ? data.arrivalMethods.map((method) => ({
          ...createEmptyArrivalMethod(),
          ...method,
          id: method.id || `arrival-${Math.random().toString(36).slice(2, 7)}`,
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
  const [isEditingView, setIsEditingView] = useState(true);

  useEffect(() => {
    const normalized = normalizeAccommodation(confirmedAccommodation);
    setFormData(normalized);
    setIsDirty(false);
    setIsEditingView(!confirmedAccommodation);
  }, [confirmedAccommodation]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const addArrivalMethod = () => {
    setFormData((prev) => ({
      ...prev,
      arrivalMethods: [...prev.arrivalMethods, createEmptyArrivalMethod()],
    }));
    setIsDirty(true);
  };

  const updateArrivalMethod = (arrivalId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      arrivalMethods: prev.arrivalMethods.map((method) =>
        method.id === arrivalId ? { ...method, [field]: value } : method
      ),
    }));
    setIsDirty(true);
  };

  const removeArrivalMethod = (arrivalId) => {
    setFormData((prev) => ({
      ...prev,
      arrivalMethods: prev.arrivalMethods.filter((method) => method.id !== arrivalId),
    }));
    setIsDirty(true);
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
      setIsDirty(false);
      setIsEditingView(true);
    }
  };

  const handleStartEdit = () => {
    setFormData(normalizeAccommodation(confirmedAccommodation));
    setIsDirty(false);
    setIsEditingView(true);
  };

  const handleCancelEdit = () => {
    if (confirmedAccommodation) {
      setFormData(normalizeAccommodation(confirmedAccommodation));
      setIsEditingView(false);
    } else {
      setFormData(createEmptyFormState());
      setIsEditingView(true);
    }
    setIsDirty(false);
  };

  const handlePaymentStatusSelect = (status) => {
    setFormData((prev) => ({
      ...prev,
      paymentStatus: status,
    }));
    setIsDirty(true);
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case "paid":
        return "已付款";
      case "half":
        return "已付50%";
      default:
        return "尚未付款";
    }
  };

  const formatDisplayDate = (value, includeTime = false) => {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return includeTime ? value : value.replace(/-/g, "/");
    }
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    if (!includeTime) {
      return `${year}/${month}/${day}`;
    }
    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}`;
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

        <div className="arrival-methods-wrapper">
          <div className="arrival-methods-header">
            <label>抵達方式</label>
          </div>
          {formData.arrivalMethods.length === 0 && (
            <div className="empty-route">
              <p>尚未設定抵達方式</p>
              <p className="empty-route-hint">例如：地鐵 / 青砥站</p>
            </div>
          )}
          <div className="arrival-methods-list">
            {formData.arrivalMethods.map((method) => (
              <div key={method.id} className="arrival-method-card">
                <div className="arrival-method-card-header">
                  <h4>{method.mode === "bus" ? "巴士" : "地鐵"}</h4>
                  <DeleteIcon onClick={() => removeArrivalMethod(method.id)} />
                </div>
                <div className="arrival-method-grid">
                  <div className="input-group">
                    <label>抵達方式</label>
                    <select
                      value={method.mode}
                      onChange={(e) =>
                        updateArrivalMethod(method.id, "mode", e.target.value)
                      }
                    >
                      <option value="subway">地鐵</option>
                      <option value="bus">巴士</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>線別</label>
                    <input
                      type="text"
                      value={method.line}
                      onChange={(e) =>
                        updateArrivalMethod(method.id, "line", e.target.value)
                      }
                      placeholder="例如：京成本線"
                    />
                  </div>
                  <div className="input-group">
                    <label>站別</label>
                    <input
                      type="text"
                      value={method.station}
                      onChange={(e) =>
                        updateArrivalMethod(method.id, "station", e.target.value)
                      }
                      placeholder="例如：青砥站"
                    />
                  </div>
                  <div className="input-group">
                    <label>票價</label>
                    <input
                      type="text"
                      value={method.fare || ""}
                      onChange={(e) =>
                        updateArrivalMethod(method.id, "fare", e.target.value)
                      }
                      placeholder="例如：¥230"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="arrival-actions">
            <button type="button" className="btn btn-outline" onClick={addArrivalMethod}>
              + 新增抵達方式
            </button>
          </div>
        </div>
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
          <div className="input-group input-group-full">
            <label>付款狀態</label>
            <div className="payment-tag-group">
              {PAYMENT_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`payment-tag ${
                    formData.paymentStatus === option.value ? "active" : ""
                  }`}
                  onClick={() => handlePaymentStatusSelect(option.value)}
                  aria-pressed={formData.paymentStatus === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
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
          className="text-link-button"
          onClick={handleCancelEdit}
        >
          取消
        </button>
      </div>
    </div>
  );

  const renderDisplay = () => (
    <div className="confirmation-view-wrapper">
      <ConfirmedAccommodationTicket accommodation={formData} />
      <div className="confirmation-summary">
        <div className="summary-grid">
          <div>
            <span className="summary-label">住宿金額</span>
            <p>{formData.price || "—"}</p>
          </div>
          <div>
            <span className="summary-label">訂房日期</span>
            <p>{formatDisplayDate(formData.bookingDate)}</p>
          </div>
          <div>
            <span className="summary-label">訂位代號</span>
            <p>{formData.bookingCode || "—"}</p>
          </div>
          <div>
            <span className="summary-label">付款狀態</span>
            <p>{getPaymentStatusLabel(formData.paymentStatus)}</p>
          </div>
          <div className="summary-link-block">
            <span className="summary-label">
              {formData.bookingUrl ? (
                <a
                  href={formData.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="summary-link-inline"
                >
                  訂房網址
                </a>
              ) : (
                "訂房網址"
              )}
            </span>
            <p>{formData.bookingUrl ? "開啟連結" : "—"}</p>
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
