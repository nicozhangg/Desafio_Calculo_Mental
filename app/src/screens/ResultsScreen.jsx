import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { DIFFICULTY_CONFIGS } from '../types';
import { saveRoundResult } from '../utils/storage';

export default function ResultsScreen({ navigation, route }) {
  const { answers, totalScore, config } = route.params;

  const correct = answers.filter((a) => a.correct).length;
  const incorrect = answers.filter((a) => !a.correct).length;
  const avgTime = answers.length
    ? Math.round(answers.reduce((s, a) => s + a.timeUsed, 0) / answers.length / 100) / 10
    : 0;
  const accuracy = answers.length ? Math.round((correct / answers.length) * 100) : 0;

  // Se guarda una sola vez al montar la pantalla; el array vacío evita guardados duplicados
  useEffect(() => {
    const result = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      config,
      answers,
      totalScore,
      correctCount: correct,
      incorrectCount: incorrect,
      avgResponseTime: avgTime,
    };
    saveRoundResult(result);
  }, []);

  const modeLabels = {
    classic: 'Clásico',
    trueFalse: 'Verdadero/Falso',
    multipleChoice: 'Múltiple Choice',
    timeAttack: 'Contra Reloj',
  };

  const diffLabel = DIFFICULTY_CONFIGS[config.difficulty].label;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Resultados</Text>
        <Text style={styles.subtitle}>
          {diffLabel} · {modeLabels[config.mode]}
        </Text>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Puntaje final</Text>
          <Text style={[styles.scoreValue, { color: totalScore >= 0 ? '#2ecc71' : '#e74c3c' }]}>
            {totalScore > 0 ? '+' : ''}{totalScore}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatBox label="Correctas" value={correct.toString()} color="#2ecc71" />
          <StatBox label="Incorrectas" value={incorrect.toString()} color="#e74c3c" />
          <StatBox label="Precisión" value={`${accuracy}%`} color="#3498db" />
          <StatBox label="Tiempo prom." value={`${avgTime}s`} color="#9b59b6" />
        </View>

        <Text style={styles.detailTitle}>Detalle de respuestas</Text>
        {answers.map((a, i) => (
          <AnswerRow key={i} index={i + 1} answer={a} />
        ))}

        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => navigation.replace('Config')}
          >
            <Text style={styles.btnText}>Jugar de nuevo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[styles.btnText, styles.btnTextSecondary]}>Inicio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, color }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function AnswerRow({ index, answer }) {
  return (
    <View style={[styles.answerRow, answer.correct ? styles.answerCorrect : styles.answerWrong]}>
      <Text style={styles.answerIndex}>{index}.</Text>
      <View style={styles.answerMid}>
        <Text style={styles.answerOp}>{answer.operation}</Text>
        <Text style={styles.answerTime}>{(answer.timeUsed / 1000).toFixed(1)}s</Text>
      </View>
      <Text style={[styles.answerPoints, { color: answer.pointsEarned >= 0 ? '#2ecc71' : '#e74c3c' }]}>
        {answer.pointsEarned > 0 ? '+' : ''}{answer.pointsEarned}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 30, fontWeight: '900', color: '#2c3e50', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#7f8c8d', marginBottom: 20 },
  scoreCard: {
    backgroundColor: '#2c3e50', borderRadius: 20, padding: 28,
    alignItems: 'center', marginBottom: 16,
  },
  scoreLabel: { fontSize: 14, color: '#95a5a6', fontWeight: '600', marginBottom: 4 },
  scoreValue: { fontSize: 56, fontWeight: '900' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statBox: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 12,
    padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#95a5a6', marginTop: 2, textAlign: 'center' },
  detailTitle: {
    fontSize: 13, fontWeight: '700', color: '#7f8c8d',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10,
  },
  answerRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff',
    borderRadius: 10, padding: 12, marginBottom: 6, borderLeftWidth: 4,
  },
  answerCorrect: { borderLeftColor: '#2ecc71' },
  answerWrong: { borderLeftColor: '#e74c3c' },
  answerIndex: { fontSize: 13, color: '#7f8c8d', width: 24 },
  answerMid: { flex: 1 },
  answerOp: { fontSize: 15, fontWeight: '600', color: '#2c3e50' },
  answerTime: { fontSize: 12, color: '#95a5a6' },
  answerPoints: { fontSize: 16, fontWeight: '700', width: 44, textAlign: 'right' },
  btnGroup: { gap: 12, marginTop: 24 },
  btn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#3498db' },
  btnSecondary: {
    backgroundColor: 'transparent', borderWidth: 2, borderColor: '#3498db',
  },
  btnText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  btnTextSecondary: { color: '#3498db' },
});
