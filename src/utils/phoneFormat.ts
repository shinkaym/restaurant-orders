/**
 * Formats a phone number to (555) 123-1234 format
 * @param phone - Raw phone number string (can include or exclude formatting)
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phone: string | undefined | null): string => {
  if (!phone) return '';

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format based on number of digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // If not 10 digits, return original phone
  return phone;
};
