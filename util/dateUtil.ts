export function getISO8601(dateIn?: Date | string) {
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
