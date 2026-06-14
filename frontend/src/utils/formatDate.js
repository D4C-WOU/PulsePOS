export const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};

export default formatDate;
