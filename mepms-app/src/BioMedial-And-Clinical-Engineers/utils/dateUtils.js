import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// Normalize MongoDB extended JSON date format to string
export function normalizeDate(date) {
  if (!date) return null;
  if (typeof date === "string") return date;
  if (date.$date) return date.$date;
  return date;
}

// Format to local timezone human string
export function formatLocalDate(dateStr) {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("DD-MM-YYYY HH:mm");
}

// Format as UTC string
export function formatUTCDate(dateStr) {
  if (!dateStr) return "-";
  return dayjs.utc(dateStr).format("DD-MM-YYYY HH:mm") + " UTC";
}
