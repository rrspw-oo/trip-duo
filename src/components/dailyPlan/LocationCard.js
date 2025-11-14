import React, { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";

const LocationCard = ({ location, day, index, onRemove, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const destinationName =
    location.destination || location.name || `地點 ${index + 1}`;
  const routeList = Array.isArray(location.routes)
    ? location.routes
    : Object.values(location.routes || {});
  const poiList = Array.isArray(location.pois)
    ? location.pois
    : Object.values(location.pois || {});
  const hasRouteLevelPois = routeList.some(
    (route) => Array.isArray(route.pois) && route.pois.length > 0
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openAddressInMaps = (address) => {
    if (!address) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  const renderPoiCard = (
    poi,
    poiIndex,
    variant = "location",
    routeIndex = null
  ) => {
    const address = poi.address || "";
    const cardClass =
      variant === "route" ? "poi-card route-poi-card" : "poi-card";
    return (
      <li key={poi.id || `poi-${poiIndex}`} className={cardClass}>
        <div className="poi-index">{poiIndex + 1}</div>
        <div className="poi-card-body">
          <div className="poi-card-title-row">
            <span className="poi-card-title">
              {poi.name || `地點 ${poiIndex + 1}`}
            </span>
            {poi.visitTime && (
              <span className="poi-card-time">{poi.visitTime}</span>
            )}
          </div>
          {variant === "route" && routeIndex !== null && (
            <span className="poi-route-label">路線 {routeIndex + 1}</span>
          )}
          <div className="poi-meta">
            <div className="poi-meta-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.01 8.01 0 0 1-8 8zm.5-13h-1v5l4.25 2.52.5-.86-3.75-2.21z" />
              </svg>
              <span>{poi.visitTime || "—"}</span>
            </div>
            {address && (
              <button
                type="button"
                className="poi-meta-item poi-address-link"
                onClick={() => openAddressInMaps(address)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z" />
                </svg>
                <span>{address}</span>
              </button>
            )}
          </div>
          {poi.note && <p className="poi-note">{poi.note}</p>}
        </div>
      </li>
    );
  };

  const renderRouteJourney = (route, routeIndex) => {
    const transferSegments = Array.isArray(route.transferSegments)
      ? route.transferSegments
      : Object.values(route.transferSegments || {});
    const routePois = Array.isArray(route.pois)
      ? route.pois
      : Object.values(route.pois || {});

    const hasTransferSegments =
      route.requiresTransfer && transferSegments.length > 0;

    return (
      <div className="journey-block" key={route.id || `route-${routeIndex}`}>
        {hasTransferSegments && (
          <div className="route-transfer-row">
            {transferSegments.map((segment, idx) => (
              <span
                key={segment.id || `transfer-${idx}`}
                className="transfer-chip"
              >
                <span className="transfer-index">{idx + 1}</span>
                <span>
                  {segment.line || "—"} · {segment.station || "—"}
                </span>
              </span>
            ))}
          </div>
        )}
        {routePois.length > 0 && (
          <ol className="poi-card-list compact">
            {routePois.map((poi, idx) =>
              renderPoiCard(poi, idx, "route", routeIndex)
            )}
          </ol>
        )}
      </div>
    );
  };

  const firstRoute = routeList.length > 0 ? routeList[0] : null;
  const routeHighlights = firstRoute
    ? [
        { label: "站別", value: firstRoute.station || "—" },
        { label: "線別", value: firstRoute.line || "—" },
        { label: "JPY", value: firstRoute.fare || "—" },
      ]
    : [];

  const canEdit = typeof onEdit === "function";

  const handleEditClick = () => {
    if (!canEdit) return;
    setShowMenu(false);
    onEdit(day, index, location);
  };

  const handleDelete = () => {
    const destinationName = location.destination || location.name || `地點 ${index + 1}`;
    if (window.confirm(`確定要刪除「${destinationName}」嗎？`)) {
      onRemove(day, index);
    }
    setShowMenu(false);
  };

  return (
    <div className="location-card">
      <div className="location-card-shell">
        <div className="location-card-header">
          <button
            className={`location-card-toggle ${isExpanded ? "expanded" : ""}`}
            onClick={() => setIsExpanded((prev) => !prev)}
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "收合行程" : "展開行程"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className="location-header-content">
            <div className="location-primary-row">
              <div className="location-title-group">
                {location.transportation && (
                  <span className="tag tag-transportation">
                    {location.transportation}
                  </span>
                )}
                <h4
                  className="location-name"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(destinationName),
                  }}
                />
                {location.timePeriod && (
                  <span className="tag tag-time inline-time-tag">
                    {location.timePeriod}
                  </span>
                )}
              </div>
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
                    {canEdit && (
                      <div
                        className="menu-option"
                        onClick={handleEditClick}
                      >
                        編輯
                      </div>
                    )}
                    <div
                      className="menu-option menu-option-danger"
                      onClick={handleDelete}
                    >
                      刪除
                    </div>
                  </div>
                )}
              </div>
            </div>
            {routeHighlights.length > 0 && (
              <div className="location-route-summary">
                {routeHighlights.map((item) => (
                  <div key={item.label} className="route-chip compact">
                    <span className="route-chip-label">{item.label}</span>
                    <span className="route-chip-value">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isExpanded && (
          <>
            {(routeList.length > 0 ||
              (poiList.length > 0 && !hasRouteLevelPois)) && (
              <div className="location-itinerary-block">
                <div className="section-label">行程地點</div>
                <div className="journey-block-stack">
                  {routeList.length > 0 &&
                    routeList.map((route, routeIndex) =>
                      renderRouteJourney(route, routeIndex)
                    )}

                  {poiList.length > 0 && !hasRouteLevelPois && (
                    <div className="journey-block">
                      <ol className="poi-card-list compact">
                        {poiList.map((poi, idx) => renderPoiCard(poi, idx))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            )}

            {location.notes && (
              <div className="location-card-section location-notes">
                <small>{location.notes}</small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LocationCard;
