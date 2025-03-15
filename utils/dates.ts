/**
 * Calculates the date for a specific day of the week, either upcoming or most recent
 * @param dayOfWeekIndex - Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @param useUpcoming - If true, get the upcoming date for the day, otherwise get the most recent
 * @returns Date object for the specified day of week
 */

export const getDateForDayOfWeek = (
  dayOfWeekIndex: number,
  useUpcoming: boolean = true,
): Date => {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  let daysToAdd = 0;
  if (useUpcoming) {
    // If we want the upcoming day (including today if it's the same day)
    if (dayOfWeekIndex === currentDayOfWeek) {
      // If the selected day is today, return today's date
      return today;
    } else if (dayOfWeekIndex > currentDayOfWeek) {
      // If selected day is later this week
      daysToAdd = dayOfWeekIndex - currentDayOfWeek;
    } else {
      // If selected day is earlier in the week, get next week's date
      daysToAdd = 7 - (currentDayOfWeek - dayOfWeekIndex) + 1;
    }
  } else {
    // If we want the most recent day (including today if it's the same day)
    if (dayOfWeekIndex === currentDayOfWeek) {
      // If the selected day is today, return today's date
      return today;
    } else if (dayOfWeekIndex < currentDayOfWeek) {
      // If selected day was earlier this week
      daysToAdd = -(currentDayOfWeek - dayOfWeekIndex);
    } else {
      // If selected day was later in the week, get last week's date
      daysToAdd = -(7 - (dayOfWeekIndex - currentDayOfWeek));
    }
  }
  const resultDate = new Date(today);
  resultDate.setDate(today.getDate() + daysToAdd);
  // Reset time to beginning of the day
  resultDate.setHours(0, 0, 0, 0);
  return resultDate;
};
