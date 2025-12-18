
const OriginalDate = global.Date;
let fakeTime: number | null = null;

export const setMockDate = (date: Date | null) => {
  if (date === null) {
    fakeTime = null;
    global.Date = OriginalDate;
  } 
  else {
    // Parse the ISO date to get the timestamp
    fakeTime = new OriginalDate(date).getTime();

    // Define the MockDate class extending the logic user provided
    class MockDate extends OriginalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
            // @ts-ignore
            super(fakeTime!);
        } 
        else {
            // @ts-ignore
            super(...args);
        }
      }

      static now() {
        return fakeTime !== null ? fakeTime : OriginalDate.now();
      }
    }

    // Assign to global
    // @ts-ignore
    global.Date = MockDate;
  }
};
