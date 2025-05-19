
export const formatDate = (isoDate, options = {}) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  const defaultOptions = { year: "numeric", month: "long", day: "numeric" };

  return date.toLocaleDateString("en-US", { ...defaultOptions, ...options });
};
