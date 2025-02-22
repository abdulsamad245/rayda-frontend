export const formatStatus = (status: string): string => {
  return status.replace(/\s+/g, "_").toLowerCase();
};

export const formatDateForInput = (isoString: string): string => {
  if (!isoString) return "";

  const date = new Date(isoString);
  return date.toISOString().slice(0, 16);
};


export const formatReadableDate = (isoString: string): string => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };