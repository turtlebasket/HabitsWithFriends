/**
 * Basically a twitter ripoff.
 *
 * http://jsfiddle.net/qE8Lu/1/
 *
 * https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time/23352499#23352499
 * @param dateRef Date to compare to
 * @returns Time difference string
 */
export function timeSince(dateRef?: string | Date) {
  let date;
  if (typeof dateRef === 'string') date = new Date(dateRef);
  else if (typeof dateRef === 'object') date = dateRef;
  else date = new Date();

  const timeStamp = date.getTime()
  var now = new Date(), secondsPast = (now.getTime() - timeStamp) / 1000 as number;
  if (secondsPast < 60) {
    return Math.round(secondsPast) + 's';
  }
  if (secondsPast < 3600) {
    return Math.round(secondsPast / 60) + 'm';
  }
  if (secondsPast <= 86400) {
    return Math.round(secondsPast / 3600) + 'h';
  }
  if (secondsPast > 86400) {
    const dateTD = new Date(timeStamp);
    let day = dateTD.getDate();
    // @ts-ignore
    let month = (dateTD.toDateString().match(/ [a-zA-Z]*/)[0]).replace(" ", "");
    let year = dateTD.getFullYear() == now.getFullYear() ? "" : " " + dateTD.getFullYear();
    return day + " " + month + year;
  }
}

/**
 * Ripped from https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
 * @param date Date to base on
 * @returns ISO 8601 format date
 */
export function yyyymmdd(date?: Date | string) { // LOCAL, NOT UTC
  let today;
  if (typeof date === 'object') today = date;
  else if (typeof date === 'string') today = new Date(date)
  else today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  const todayStr: string = yyyy + '-' + mm + '-' + dd;
  return todayStr;
}

export function yyyymmddUTC(date?: Date | string) { // LOCAL, NOT UTC
  let today;
  if (typeof date === 'object') today = date;
  else if (typeof date === 'string') today = new Date(date)
  else today = new Date();
  var dd = String(today.getUTCDate()).padStart(2, '0');
  var mm = String(today.getUTCMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getUTCFullYear();

  const todayStr: string = yyyy + '-' + mm + '-' + dd;
  return todayStr;
}

export function getISO8601(dateIn?: Date | string) { // UTC, NOT LOCAL
  let date: string;
  if (typeof dateIn === 'object') date = dateIn.toISOString();
  else if (typeof dateIn === 'string') date = dateIn;
  else date = new Date().toISOString();
  let regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/i;
  // @ts-ignore
  return date.match(regex)[0];
}

export function dateToEpoch(date?: Date | string | undefined) {
  let dateBase: Date; 
  if (typeof date == 'object') dateBase = date;
  else if (typeof date == 'string') dateBase = new Date(date);
  else dateBase = new Date(); 
  var time = dateBase.getTime();
  const epoch = time - (time % 86400000);
  return new Date(epoch).toISOString();
}

export function relativeTimeString(timestamp: string) {
  const refDate = new Date(timestamp);
}