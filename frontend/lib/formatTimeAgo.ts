export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // Calculate difference in seconds
  const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Handle future dates or immediate actions
  if (secondsDiff < 1) return 'just now';

  // Define intervals with their short labels
  const intervals: { label: string; seconds: number }[] = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 },
  ];

  for (const interval of intervals) {
    const value = Math.floor(secondsDiff / interval.seconds);
    if (value >= 1) {
      return `${value}${interval.label} ago`;
    }
  }

  return 'just now';
}