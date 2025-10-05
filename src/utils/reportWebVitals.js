const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry); // FID is deprecated, use INP instead
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

// Send performance metrics to console in development
const logWebVitals = (metric) => {
  // Disabled console logging for cleaner development experience
  // Uncomment below to enable performance logging:
  // const isDev = process.env.NODE_ENV === 'development';
  // if (isDev) {
  //   console.log(`[Performance] ${metric.name}:`, metric.value, 'ms');
  // }

  // In production, you could send to analytics service
  // Example: analytics && logEvent(analytics, 'web_vitals', { ...metric });
};

export default reportWebVitals;
export { logWebVitals };
