import { DIFFICULTY_CONFIGS } from '../types';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBasicOperation(difficulty) {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const operator = config.operators[randomInt(0, config.operators.length - 1)];
  let a, b, answer;

  switch (operator) {
    case '+':
      a = randomInt(1, config.maxNumber);
      b = randomInt(1, config.maxNumber);
      answer = a + b;
      break;
    case '-':
      a = randomInt(1, config.maxNumber);
      b = randomInt(1, a); // b <= a para que el resultado nunca sea negativo
      answer = a - b;
      break;
    case '*':
      // Se limita a 12 para evitar productos demasiado grandes en niveles bajos
      a = randomInt(1, Math.min(12, config.maxNumber));
      b = randomInt(1, Math.min(12, config.maxNumber));
      answer = a * b;
      break;
    case '/':
      // Se genera el cociente primero y luego el dividendo para garantizar división exacta
      b = randomInt(1, Math.min(12, config.maxNumber));
      answer = randomInt(1, Math.min(12, config.maxNumber));
      a = b * answer;
      break;
    default:
      a = 1; b = 1; answer = 2;
  }

  const symbols = { '+': '+', '-': '-', '*': '×', '/': '÷' };
  return { question: `${a} ${symbols[operator]} ${b}`, answer };
}

function generateWrongAnswers(correct, count) {
  const wrongs = new Set();
  const deltas = [1, 2, 3, 5, 7, 10, -1, -2, -3, -5];

  while (wrongs.size < count) {
    const delta = deltas[randomInt(0, deltas.length - 1)];
    const wrong = correct + delta;
    if (wrong !== correct && wrong >= 0) {
      wrongs.add(wrong);
    }
  }
  return Array.from(wrongs);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateOperation(difficulty, mode) {
  const { question, answer } = generateBasicOperation(difficulty);

  if (mode === 'trueFalse') {
    // 50% de probabilidad de mostrar un resultado incorrecto (diferencia de 1 a 3)
    const showWrong = Math.random() < 0.5;
    const displayAnswer = showWrong
      ? answer + (Math.random() < 0.5 ? 1 : -1) * randomInt(1, 3)
      : answer;
    return {
      question,
      correctAnswer: answer,
      displayAnswer,
      isCorrect: !showWrong,
    };
  }

  if (mode === 'multipleChoice') {
    const wrongs = generateWrongAnswers(answer, 3);
    const options = shuffle([answer, ...wrongs]);
    return { question, correctAnswer: answer, options };
  }

  return { question, correctAnswer: answer };
}
