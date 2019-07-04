export function isSameDate(d1: Date | null, d2: Date | null): boolean {
  if (!d1) {
    return !d2
  }
  if (!d2) {
    return false
  }

  return d1.getTime() === d2.getTime()
}
