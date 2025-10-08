export const getUserInitials = (user) => {
  if (!user) return "?";

  // Handle string UID directly
  if (typeof user === "string") {
    return user.charAt(0).toUpperCase();
  }

  // Handle user object
  if (user.displayName) {
    return user.displayName.charAt(0).toUpperCase();
  }
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return "?";
};

export const getAvatarColor = (user) => {
  if (!user) return "#AA85CD";

  // Handle string UID directly
  const str = typeof user === "string" ? user : (user.email || user.uid || "default");

  const colors = ["#AA85CD", "#D493B9", "#F3AAD5", "#D2A7FD", "#DA896F", "#FF9F81"];
  const hash = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
