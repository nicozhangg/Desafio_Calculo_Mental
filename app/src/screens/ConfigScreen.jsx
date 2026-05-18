import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import { DIFFICULTY_CONFIGS } from '../types';

const MODES = [
  { key: 'classic', label: 'Clásico', desc: 'Ingresa el resultado' },
  { key: 'trueFalse', label: 'Verdadero / Falso', desc: 'Indica si es correcto' },
  { key: 'multipleChoice', label: 'Múltiple Choice', desc: '4 opciones posibles' },
  { key: 'timeAttack', label: 'Contra Reloj', desc: 'Responde sin parar' },
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const ITERATION_OPTIONS = [5, 10, 15, 20];

export default function ConfigScreen({ navigation }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [mode, setMode] = useState('classic');
  const [iterations, setIterations] = useState(10);

  const config = DIFFICULTY_CONFIGS[difficulty];
  const timeLabel = (ms) => `${ms / 1000}s`;

  const handleStart = () => {
    navigation.navigate('Game', { difficulty, mode, iterations });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Configurar partida</Text>

        <Section title="Dificultad">
          <View style={styles.row}>
            {DIFFICULTIES.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, difficulty === d && styles.chipActive]}
                onPress={() => setDifficulty(d)}
              >
                <Text style={[styles.chipText, difficulty === d && styles.chipTextActive]}>
                  {DIFFICULTY_CONFIGS[d].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>
            Tiempo por pregunta: {timeLabel(config.timePerQuestion)}
            {'\n'}Números hasta: {config.maxNumber}
            {'\n'}Operaciones: {config.operators.join('  ')}
          </Text>
        </Section>

        <Section title="Modo de juego">
          {MODES.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[styles.modeCard, mode === m.key && styles.modeCardActive]}
              onPress={() => setMode(m.key)}
            >
              <View style={styles.modeLeft}>
                <View style={[styles.radio, mode === m.key && styles.radioActive]} />
                <View>
                  <Text style={[styles.modeLabel, mode === m.key && styles.modeLabelActive]}>
                    {m.label}
                  </Text>
                  <Text style={styles.modeDesc}>{m.desc}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Section>

        {/* En contra reloj no se define cantidad de preguntas, sino tiempo total */}
        {mode !== 'timeAttack' && (
          <Section title="Cantidad de preguntas">
            <View style={styles.row}>
              {ITERATION_OPTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.chip, iterations === n && styles.chipActive]}
                  onPress={() => setIterations(n)}
                >
                  <Text style={[styles.chipText, iterations === n && styles.chipTextActive]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>
        )}

        {mode === 'timeAttack' && (
          <Section title="Tiempo total">
            <Text style={styles.hint}>
              {timeLabel(config.totalTimeAttack)} — responde hasta agotar el tiempo o fallar
            </Text>
          </Section>
        )}

        <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
          <Text style={styles.startText}>Comenzar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  container: { padding: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#2c3e50', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#7f8c8d', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10 },
  chip: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#dfe6e9',
  },
  chipActive: { borderColor: '#3498db', backgroundColor: '#ebf5fb' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#7f8c8d' },
  chipTextActive: { color: '#3498db' },
  hint: { fontSize: 13, color: '#95a5a6', lineHeight: 20, marginTop: 8 },
  modeCard: {
    backgroundColor: '#ffffff', borderRadius: 12, padding: 16,
    marginBottom: 8, borderWidth: 2, borderColor: '#dfe6e9',
  },
  modeCardActive: { borderColor: '#3498db', backgroundColor: '#ebf5fb' },
  modeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: '#bdc3c7',
  },
  radioActive: { borderColor: '#3498db', backgroundColor: '#3498db' },
  modeLabel: { fontSize: 15, fontWeight: '600', color: '#2c3e50' },
  modeLabelActive: { color: '#3498db' },
  modeDesc: { fontSize: 12, color: '#95a5a6', marginTop: 2 },
  startBtn: {
    backgroundColor: '#2ecc71', borderRadius: 16, paddingVertical: 18,
    alignItems: 'center', marginTop: 8,
  },
  startText: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
});
