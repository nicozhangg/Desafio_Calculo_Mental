import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cálculo{'\n'}Mental</Text>
          <Text style={styles.subtitle}>Pon a prueba tu mente</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => navigation.navigate('Config')}
          >
            <Text style={styles.btnText}>Jugar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={[styles.btnText, styles.btnTextSecondary]}>Historial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#2c3e50' },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  header: { alignItems: 'center', marginTop: 20 },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 62,
  },
  subtitle: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 12,
    letterSpacing: 1,
  },
  buttons: { gap: 16 },
  btn: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: '#3498db' },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  btnText: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  btnTextSecondary: { color: '#3498db' },
});
