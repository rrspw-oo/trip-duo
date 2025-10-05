export const generateSecureInviteCode = () => {
  const array = new Uint8Array(4);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(36).toUpperCase())
    .join('')
    .substring(0, 6);
};
