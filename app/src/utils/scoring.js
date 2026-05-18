// Sistema de puntaje: rápido (+100), normal (+70), incorrecto (-30), sin respuesta (-50)
export function calculatePoints(correct, timedOut, timeUsed, maxTime) {
  if (timedOut) return -50;
  if (!correct) return -30;
  // "Rápida" se define como menos del 75% del tiempo asignado
  if (timeUsed < maxTime * 0.75) return 100;
  return 70;
}
