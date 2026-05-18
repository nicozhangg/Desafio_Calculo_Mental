import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  SafeAreaView, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DIFFICULTY_CONFIGS } from '../types';
import { getHistory, getBestScores, clearHistory } from '../utils/storage';

const MODE_LABELS = {
  classic: 'Clásico',
  trueFalse: 'V/F',
  multipleChoice: 'M.Choice',
  timeAttack: 'Reloj',
};

export default function HistoryScreen({ navigation }) {
  const [tab, setTab] = useState('best');
  const [bestScores, setBestScores] = useState([]);
  const [history, setHistory] = useState([]);

  const load = async () => {
    const [best, hist] = await Promise.all([getBestScores(10), getHistory()]);
    setBestScores(best);
    setHistory(hist);
  };

  // useFocusEffect recarga los datos cada vez que el usuario vuelve a esta pantalla,
  // por ejemplo después de terminar una partida nueva
  useFocusEffect(useCallback(() => { load(); }, []));

  const handleClear = () => {
    Alert.alert(
      'Borrar historial',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => { await clearHistory(); load(); },
        },
      ]
    );
  };

  const data = tab === 'best' ? bestScores : history;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Historial</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearBtn}>Borrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'best' && styles.tabActive]}
            onPress={() => setTab('best')}
          >
            <Text style={[styles.tabText, tab === 'best' && styles.tabTextActive]}>
              Mejores puntajes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'history' && styles.tabActive]}
            onPress={() => setTab('history')}
          >
            <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>
              Historial completo
            </Text>
          </TouchableOpacity>
        </View>

        {data.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay partidas registradas</Text>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => navigation.navigate('Config')}
            >
              <Text style={styles.playBtnText}>Jugar ahora</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <ResultCard result={item} rank={tab === 'best' ? index + 1 : undefined} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function ResultCard({ result, rank }) {
  const date = new Date(result.date);
  const dateStr = date.toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });
  const timeStr = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  const diff = DIFFICULTY_CONFIGS[result.config.difficulty].label;
  const mode = MODE_LABELS[result.config.mode];
  const accuracy = result.answers.length
    ? Math.round((result.correctCount / result.answers.length) * 100)
    : 0;

  return (
    <View style={styles.card}>
      {rank && <Text style={styles.rank}>#{rank}</Text>}
      <View style={styles.cardMain}>
        <View style={styles.cardTop}>
          <Text style={[styles.cardScore, { color: result.totalScore >= 0 ? '#2ecc71' : '#e74c3c' }]}>
            {result.totalScore > 0 ? '+' : ''}{result.totalScore} pts
          </Text>
          <Text style={styles.cardDate}>{dateStr} {timeStr}</Text>
        </View>
        <View style={styles.cardBottom}>
          <Tag label={diff} color="#3498db" />
          <Tag label={mode} color="#9b59b6" />
          <Tag label={`${accuracy}%`} color="#27ae60" />
          <Tag label={`${result.correctCount}/${result.answers.length}`} color="#e67e22" />
        </View>
      </View>
    </View>
  );
}

function Tag({ label, color }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#2c3e50' },
  clearBtn: { fontSize: 14, color: '#e74c3c', fontWeight: '600' },
  tabs: {
    flexDirection: 'row', backgroundColor: '#dfe6e9',
    borderRadius: 12, padding: 4, marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#ffffff' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#95a5a6' },
  tabTextActive: { color: '#2c3e50' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { fontSize: 16, color: '#95a5a6' },
  playBtn: {
    backgroundColor: '#3498db', borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  playBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  card: {
    backgroundColor: '#ffffff', borderRadius: 12, padding: 16,
    marginBottom: 8, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  rank: { fontSize: 18, fontWeight: '800', color: '#f39c12', width: 36 },
  cardMain: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardScore: { fontSize: 20, fontWeight: '800' },
  cardDate: { fontSize: 12, color: '#95a5a6' },
  cardBottom: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 12, fontWeight: '600' },
});
