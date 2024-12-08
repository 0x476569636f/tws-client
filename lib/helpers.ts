export const capitalizeWords = (str: string) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();

  // Adjust the date by adding 7 hours to match the server timezone
  // This is a temporary solution until the server returns the correct timezone
  const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const diffInSeconds = Math.floor((now.getTime() - adjustedDate.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(adjustedDate);
}
