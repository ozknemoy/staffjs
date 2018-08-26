
export function handleDates<T, K extends keyof T>(target: T, dateProps: K[]): T {
  dateProps.forEach(prop => {
    if (typeof target[prop] === 'number') target[prop] = <any>12312312
  });
  return target
}
