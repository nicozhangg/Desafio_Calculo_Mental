export const DIFFICULTY_CONFIGS = {
  easy: {
    label: 'Fácil',
    maxNumber: 10,
    operators: ['+', '-'],
    timePerQuestion: 15000,
    totalTimeAttack: 60000,
  },
  medium: {
    label: 'Medio',
    maxNumber: 50,
    operators: ['+', '-', '*'],
    timePerQuestion: 10000,
    totalTimeAttack: 90000,
  },
  hard: {
    label: 'Difícil',
    maxNumber: 100,
    operators: ['+', '-', '*', '/'],
    timePerQuestion: 7000,
    totalTimeAttack: 120000,
  },
};
