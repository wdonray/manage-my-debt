export function SearchEnum(context: object, value: string) {
  return Object.keys(context)[Object.values(context).indexOf(value)];
}