import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@calc_history';

export async function saveRoundResult(result) {
  const history = await getHistory();
  history.unshift(result);
  const trimmed = history.slice(0, 100);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export async function getHistory() {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function getBestScores(limit = 10) {
  const history = await getHistory();
  return [...history].sort((a, b) => b.totalScore - a.totalScore).slice(0, limit);
}

export async function clearHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}
