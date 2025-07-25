// src/utils.js
import dayjs from 'dayjs';

/**
 * Formats a datetime string (ISO or JS date) to readable format
 * @param {string|Date} dateStr
 * @returns {string} "Jul 24, 2025, 11:50 AM"
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  return dayjs(dateStr).format('MMM D, YYYY, hh:mm A');
}

/**
 * Filters an array of logs by optional start/end date range
 * @param {Array} logs
 * @param {Date|null} startDate
 * @param {Date|null} endDate
 */
export function filterLogsByDateRange(logs = [], startDate, endDate) {
  return logs.filter(log => {
    const created = new Date(log.timestamp);
    if (startDate && created < new Date(startDate)) return false;
    if (endDate && created > new Date(endDate)) return false;
    return true;
  });
}

/**
 * Converts an object to CSV row
 */
export function convertLogsToCSV(logs = []) {
  const headers = ['Log ID', 'User ID', 'Action', 'Timestamp', 'Details'];
  const rows = logs.map(log => [
    log.id,
    log.userId,
    log.action,
    formatDateTime(log.timestamp),
    log.details,
  ]);
  return [headers, ...rows];
}

/**
 * Triggers download of CSV file
 */
export function downloadCSV(filename, data) {
  const csv = data.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
