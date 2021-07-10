const { HDate, HebrewCalendar} = require('@hebcal/core');

function isSecondHoliday(date) {
  const hebDate = new HDate(new Date(date));
  const event = getEvent(hebDate);
  if (hebDate.getDay() !== 6 && event[0] && event[0].mask === 13) {
    return true
  }
  return false;
}

function getEvent(date) {
  const options = {
    start: date,
    end: date,
    isHebrewYear: true,
    candlelighting: false,
    noModern: true,
    noMinorFast: true,
    noRoshChodesh: true,
    noSpecialShabbat: true,
  };
  return HebrewCalendar.calendar(options);
}

module.exports = isSecondHoliday;