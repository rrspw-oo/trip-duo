import { differenceInDays } from "date-fns";

export const calculateDaysFromDates = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) return 0;

  return differenceInDays(end, start) + 1; // Inclusive
};

export const generateDailyPlansStructure = (days, existingDailyPlans = {}) => {
  const newPlans = {};

  for (let i = 1; i <= days; i++) {
    const dayKey = `Day ${i}`;
    const existingPlan = existingDailyPlans[dayKey];

    if (existingPlan && typeof existingPlan === 'object' && existingPlan.locations) {
      // Keep existing locations
      newPlans[dayKey] = existingPlan;
    } else {
      // Create new structure with placeholder to prevent Firebase from deleting it
      newPlans[dayKey] = {
        locations: {},  // Use empty object instead of empty array
        _placeholder: true  // Marker to indicate this is a new day
      };
    }
  }

  return newPlans;
};
