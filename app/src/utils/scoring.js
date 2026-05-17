export function calculatePoints(correct, timedOut, timeUsed, maxTime) {
  if (timedOut) return -50;
  if (!correct) return -30;
  if (timeUsed < maxTime * 0.75) return 100;
  return 70;
}
