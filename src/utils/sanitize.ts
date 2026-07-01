/* src/utils/sanitize.ts */

/**
 * Normalizes title string by trimming whitespace and capitalizing each word.
 * Also handles fully uppercase strings.
 */
export function sanitizeTitle(title: string | null | undefined): string {
  if (!title) return '';
  const trimmed = title.trim();
  
  // If it's all uppercase, convert it to standard title case
  if (trimmed === trimmed.toUpperCase()) {
    return trimmed
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return trimmed;
}

/**
 * Cleans the raw price and returns a float number, or null if invalid/missing.
 */
export function sanitizePrice(price: number | string | null | undefined): number | null {
  if (price === null || price === undefined) return null;
  
  if (typeof price === 'number') {
    return price;
  }
  
  if (typeof price === 'string') {
    // Remove currency signs, commas, and other formatting characters
    const cleaned = price.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }
  
  return null;
}

/**
 * Formats a number as a currency string.
 */
export function formatCurrency(value: number | string | null | undefined): string {
  const parsed = sanitizePrice(value);
  if (parsed === null) return 'Inquire for Price';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parsed);
}
