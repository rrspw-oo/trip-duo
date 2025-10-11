// Airline options for flight booking
export const AIRLINE_OPTIONS = [
  "長榮航空",
  "中華航空",
  "星宇航空",
  "全日航"
];

// Transportation options for daily plan locations
export const TRANSPORTATION_OPTIONS = [
  "山手線",
  "中央線",
  "京濱東北線",
  "JR線",
  "地鐵",
  "步行",
  "巴士"
];

// Time period options for daily plan locations
export const TIME_PERIOD_OPTIONS = [
  "早上",
  "中午",
  "下午",
  "晚上"
];

// Category options for daily plan locations
export const CATEGORY_OPTIONS = [
  "必去景點",
  "必吃美食",
  "購物",
  "住宿",
  "其他"
];

// Tab configuration
export const TABS = [
  { id: 1, label: "行前安排" },
  { id: 2, label: "每日規劃" },
];

// Pre-trip sub-tabs
export const PRETRIP_SUB_TABS = [
  { id: 1, label: "旅行時間", mobileLabel: "天數" },
  { id: 2, label: "機票確認", mobileLabel: "機票" },
  { id: 3, label: "住宿確認", mobileLabel: "住宿" },
  { id: 4, label: "行前必備", mobileLabel: "行前" },
];

// Daily plan sub-tabs
export const DAILY_PLAN_SUB_TABS = [
  { id: 1, label: "每日計劃" },
  { id: 2, label: "想買清單" },
];

// Flight sub-tabs
export const FLIGHT_SUB_TABS = [
  { id: 1, label: "新增航班" },
  { id: 2, label: "航班列表" },
  { id: 3, label: "確認航班" },
];

// Accommodation sub-tabs
export const ACCOMMODATION_SUB_TABS = [
  { id: 1, label: "新增住宿" },
  { id: 2, label: "住宿列表" },
  { id: 3, label: "確認住宿" },
];

// Amenities options for accommodations
export const AMENITIES_OPTIONS = [
  "吹風機",
  "毛巾",
  "洗衣機",
  "烘衣機",
  "熱水壺",
  "其他"
];

// Airline color mapping for visual distinction (subtle grays and beiges)
export const AIRLINE_COLORS = {
  "長榮航空": {
    primary: "#5f6368",
    light: "#f5f5f5",
    border: "#dadce0"
  },
  "中華航空": {
    primary: "#5f6368",
    light: "#faf9f7",
    border: "#e8e6e1"
  },
  "星宇航空": {
    primary: "#5f6368",
    light: "#f8f9fa",
    border: "#dee2e6"
  },
  "全日航": {
    primary: "#5f6368",
    light: "#fefcf9",
    border: "#f0ebe5"
  }
};
