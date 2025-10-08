import React from "react";

const ConfirmedFlightTicket = ({ flight }) => {
  // Calculate flight duration
  const calculateDuration = (departure, arrival) => {
    if (!departure || !arrival) return "---";
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Format date and time
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

  const outboundDep = formatDateTime(flight.outboundDeparture);
  const outboundArr = formatDateTime(flight.outboundArrival);
  const returnDep = formatDateTime(flight.returnDeparture);
  const returnArr = formatDateTime(flight.returnArrival);

  const outboundDuration = calculateDuration(flight.outboundDeparture, flight.outboundArrival);
  const returnDuration = calculateDuration(flight.returnDeparture, flight.returnArrival);

  return (
    <div className="confirmed-ticket-container">
      <div className="airline-name-header">{flight.airline || '航空公司'}</div>

      {/* Combined Ticket Card */}
      <div className="ticket-card combined-ticket">
        {/* Outbound */}
        <div className="ticket-section outbound-section">
          <div className="ticket-label-top">去程</div>
          <div className="ticket-route-compact">
            <div className="ticket-location-compact">
              <div className="ticket-time-compact">{outboundDep.time}</div>
              <div className="ticket-airport-compact">TPE</div>
              <div className="ticket-date-compact">{outboundDep.date}</div>
              {flight.outboundDepartureTerminal && (
                <div className="ticket-terminal-compact">Terminal {flight.outboundDepartureTerminal}</div>
              )}
            </div>

            <div className="ticket-middle-compact">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <div className="ticket-duration-compact">{outboundDuration}</div>
            </div>

            <div className="ticket-location-compact">
              <div className="ticket-time-compact">{outboundArr.time}</div>
              <div className="ticket-airport-compact">NRT</div>
              <div className="ticket-date-compact">{outboundArr.date}</div>
              {flight.outboundArrivalTerminal && (
                <div className="ticket-terminal-compact">Terminal {flight.outboundArrivalTerminal}</div>
              )}
            </div>
          </div>
        </div>

        <div className="ticket-divider">
          {flight.bookingCode && (
            <div className="booking-code-badge">{flight.bookingCode}</div>
          )}
        </div>

        {/* Return */}
        <div className="ticket-section return-section">
          <div className="ticket-label-top">回程</div>
          <div className="ticket-route-compact">
            <div className="ticket-location-compact">
              <div className="ticket-time-compact">{returnDep.time}</div>
              <div className="ticket-airport-compact">NRT</div>
              <div className="ticket-date-compact">{returnDep.date}</div>
              {flight.returnDepartureTerminal && (
                <div className="ticket-terminal-compact">Terminal {flight.returnDepartureTerminal}</div>
              )}
            </div>

            <div className="ticket-middle-compact">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <div className="ticket-duration-compact">{returnDuration}</div>
            </div>

            <div className="ticket-location-compact">
              <div className="ticket-time-compact">{returnArr.time}</div>
              <div className="ticket-airport-compact">TPE</div>
              <div className="ticket-date-compact">{returnArr.date}</div>
              {flight.returnArrivalTerminal && (
                <div className="ticket-terminal-compact">Terminal {flight.returnArrivalTerminal}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmedFlightTicket;
