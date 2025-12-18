export const getLocalYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getPastDaysCoordinates = (days: number, referenceDateStr?: string) => {
  const dates = [];
  const baseDate = referenceDateStr ? new Date(referenceDateStr + 'T12:00:00') : new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    dates.push(getLocalYYYYMMDD(d));
  }
  return dates;
};

export const getPastWeeksCoordinates = (weeks: number, referenceDateStr?: string) => {
  // Returns array of arrays of dates for each week.
  // Current week (ending today) is 0.
  const weeksData: string[][] = [];
  const baseDate = referenceDateStr ? new Date(referenceDateStr) : new Date();
  
  // Align so the last week ends today.
  
  for (let w = weeks - 1; w >= 0; w--) {
    const weekDates = [];
    // End of this week chunk
    const endOfWeek = new Date(baseDate);
    endOfWeek.setDate(baseDate.getDate() - (w * 7));
    
    // 7 days ending at endOfWeek
    for (let d = 6; d >= 0; d--) {
        const date = new Date(endOfWeek);
        date.setDate(endOfWeek.getDate() - d);
        weekDates.push(getLocalYYYYMMDD(date));
    }
    weeksData.push(weekDates);
  }
  return weeksData;
};
