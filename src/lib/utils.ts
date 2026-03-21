/**
 * Safely parses a date string for cross-browser compatibility, 
 * especially for iOS Safari which is picky about formats.
 */
export function safeDate(dateStr: string | null | undefined): Date {
  if (!dateStr) return new Date();
  
  // Replace space with T to make it ISO 8601 compliant if it's in YYYY-MM-DD HH:mm:ss format
  const formattedStr = dateStr.includes(' ') && !dateStr.includes('T') 
    ? dateStr.replace(' ', 'T') 
    : dateStr;
    
  const date = new Date(formattedStr);
  
  // If parsing fails, return current date as fallback
  if (isNaN(date.getTime())) {
    console.error(`Invalid date string: ${dateStr}`);
    return new Date();
  }
  
  return date;
}

/**
 * Formats a date string safely for the UI with options.
 */
export function formatDate(
  dateStr: string | null | undefined, 
  options: Intl.DateTimeFormatOptions = {}
): string {
  return safeDate(dateStr).toLocaleDateString(undefined, options);
}
