export function dateToEpoch(date?: Date | string | undefined) {
  let dateBase: Date = new Date(); // if undefined, just use today's date
  if (typeof date == 'object') dateBase = date;
  else if (typeof date == 'string') dateBase = new Date(date);
  var time = dateBase.getTime();
  const epoch = time - (time % 86400000);
  const dateNew = new Date(epoch);
  return dateNew.toISOString();
}
