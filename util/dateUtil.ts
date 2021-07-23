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
