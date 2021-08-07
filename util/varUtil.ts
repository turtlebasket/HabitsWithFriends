export function isDefined(variable: any): boolean {
  return !(typeof variable === 'undefined' || variable === null);
}