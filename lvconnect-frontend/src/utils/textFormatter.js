// utils/formatText.js
export const formatTitle = (text, wordLimit = 3) => {
  if (!text) return "";
  const words = text.trim().split(" ");
  const shortened = words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  return shortened
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


export const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
