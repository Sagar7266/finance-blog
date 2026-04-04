import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd MMM yyyy');
};

export const formatDateRelative = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toString() || '0';
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getCategoryColor = (color) => {
  const map = {
    '#10B981': 'badge-green',
    '#3B82F6': 'badge-blue',
    '#F59E0B': 'badge-gold',
    '#EF4444': 'badge-red',
    '#8B5CF6': 'badge-purple',
    '#EC4899': 'badge-pink',
  };
  return map[color] || 'badge-green';
};

export const truncate = (str, n = 160) =>
  str && str.length > n ? str.substring(0, n) + '...' : str;

export const slugify = (text) =>
  text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
