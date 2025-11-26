import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return 'Today';
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE');
  }

  if (isThisYear(dateObj)) {
    return format(dateObj, 'MMM dd');
  }

  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy hh:mm a');
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'hh:mm a');
};

export const getRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHour = Math.floor(diffInMin / 60);
  const diffInDay = Math.floor(diffInHour / 24);

  if (diffInSec < 60) {
    return 'Just now';
  }

  if (diffInMin < 60) {
    return `${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
  }

  if (diffInHour < 24) {
    return `${diffInHour} hour${diffInHour > 1 ? 's' : ''} ago`;
  }

  if (diffInDay < 7) {
    return `${diffInDay} day${diffInDay > 1 ? 's' : ''} ago`;
  }

  return formatDate(dateObj);
};

export const getDaysUntil = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

export const isOverdue = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
};
