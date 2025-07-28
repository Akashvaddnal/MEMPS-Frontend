import dayjs from 'dayjs';

/**
 * Formats a date to readable string
 * @param {Date|string} date 
 * @returns {string} Formatted date (e.g., "Jul 25, 2023, 10:30 AM")
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return dayjs(date).format('MMM D, YYYY, hh:mm A');
};

/**
 * Calculates remaining warranty period
 * @param {Date} warrantyEndDate 
 * @returns {string} Remaining time (e.g., "3 months")
 */
export const getWarrantyRemaining = (warrantyEndDate) => {
  if (!warrantyEndDate) return 'N/A';
  
  const now = dayjs();
  const end = dayjs(warrantyEndDate);
  
  if (end.isBefore(now)) return 'Expired';
  
  const months = end.diff(now, 'month');
  const days = end.diff(now, 'day') % 30;
  
  if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
  return `${days} day${days > 1 ? 's' : ''}`;
};

/**
 * Generates PO number
 * @returns {string} PO number (e.g., "PO-2023-001")
 */
export const generatePONumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PO-${year}-${randomNum}`;
};

/**
 * Calculates total amount from order items
 * @param {Array} items 
 * @returns {number} Total amount
 */
export const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
};