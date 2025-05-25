
export const formatDate = (isoDate, options = {}) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  const defaultOptions = { year: "numeric", month: "long", day: "numeric" };

  return date.toLocaleDateString("en-US", { ...defaultOptions, ...options });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const formatLabel = (value) =>
  value
    .replace(/_/g, ' ')                      // Replace underscores with spaces
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
