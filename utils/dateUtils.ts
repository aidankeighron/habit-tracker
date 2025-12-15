export const getPastDaysCoordinates = (days: number, referenceDateStr?: string) => {
  const dates = [];
  const today = referenceDateStr ? new Date(referenceDateStr) : new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export const getPastWeeksCoordinates = (weeks: number, referenceDateStr?: string) => {
  // Returns array of arrays of dates for each week.
  // Current week (ending today) is 0.
  const weeksData: string[][] = [];
  const today = referenceDateStr ? new Date(referenceDateStr) : new Date();
  
  // Align so the last week ends today.
  
  for (let w = weeks - 1; w >= 0; w--) {
    const weekDates = [];
    // End of this week chunk
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - (w * 7));
    
    // 7 days ending at endOfWeek
    for (let d = 6; d >= 0; d--) {
        const date = new Date(endOfWeek);
        date.setDate(endOfWeek.getDate() - d);
        weekDates.push(date.toISOString().split('T')[0]);
    }
    weeksData.push(weekDates);
  }
  return weeksData;
};
