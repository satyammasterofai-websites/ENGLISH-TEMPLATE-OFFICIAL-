// Helper to format date into Google Calendar friendly string YYYYMMDDTHHMMSS
export function formatCalendarDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      // Fallback
      return "20260912T153000";
    }
    const pad = (num: number) => String(num).padStart(2, "0");
    const year = d.getUTCFullYear();
    const month = pad(d.getUTCMonth() + 1);
    const day = pad(d.getUTCDate());
    const hours = pad(d.getUTCHours());
    const minutes = pad(d.getUTCMinutes());
    const seconds = pad(d.getUTCSeconds());
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  } catch (e) {
    return "20260912T153000";
  }
}

// Generates Google Calendar link
export function getGoogleCalendarLink(event: {
  title: string;
  date: string; // ISO string e.g. "2026-09-12T15:30:00"
  venue: string;
  details: string;
}): string {
  const formattedDate = formatCalendarDate(event.date);
  // End date is usually start date + 2 hours for standard events
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const formattedEnd = formatCalendarDate(end.toISOString());

  const baseUrl = "https://calendar.google.com/calendar/render";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formattedDate}/${formattedEnd}`,
    details: event.details,
    location: event.venue,
  });

  return `${baseUrl}?${params.toString()}`;
}

// Standard debounce utility for high-performance responsive calculations
export function debounce<A extends any[], R>(
  fn: (...args: A) => R,
  ms: number
): (...args: A) => void {
  let timer: NodeJS.Timeout | null = null;
  return (...args: A) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}
