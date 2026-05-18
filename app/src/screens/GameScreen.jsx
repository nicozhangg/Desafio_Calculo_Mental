import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
import { DIFFICULTY_CONFIGS } from '../types';
import { generateOperation } from '../utils/gameLogic';
import { calculatePoints } from '../utils/scoring';
import TimerBar from '../components/TimerBar';

export default function GameScreen({ navigation, route }) {
  const { difficulty, mode, iterations } = route.params;
  const config = DIFFICULTY_CONFIGS[difficulty];
  const maxTime = config.timePerQuestion;

  const [operation, setOperation] = useState(() =>
    generateOperation(difficulty, mode)
  );
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [input, setInput] = useState('');
  const [timerKey, setTimerKey] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [totalTimeLeft, setTotalTimeLeft] = useState(config.totalTimeAttack);

  // Refs que espejean el estado para que los callbacks de setInterval
  // accedan siempre al valor más reciente sin capturarlo en el closure inicial
  const answersRef = useRef([]);
  const scoreRef = useRef(0);
  const questionStartTime = useRef(Date.now());
  // handledRef evita procesar dos respuestas para la misma pregunta (ej: tecla + timer simultáneos)
  const handledRef = useRef(false);
  const totalTimerRef = useRef(null);
  // navigatedRef impide llamar navigation.replace más de una vez
  const navigatedRef = useRef(false);

  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const goToResults = useCallback((finalAnswers, finalScore) => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    navigation.replace('Results', {
      answers: finalAnswers,
      totalScore: finalScore,
      config: { difficulty, mode, iterations },
    });
  }, [navigation, difficulty, mode, iterations]);

  useEffect(() => {
    if (mode !== 'timeAttack') return;
    totalTimerRef.current = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(totalTimerRef.current);
          goToResults(answersRef.current, scoreRef.current);
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    return () => { if (totalTimerRef.current) clearInterval(totalTimerRef.current); };
  }, [mode, goToResults]);

  const handleAnswer = useCallback(
    (userAnswerCorrect, timedOut = false) => {
      if (handledRef.current || navigatedRef.current) return;
      handledRef.current = true;

      setTimerRunning(false);
      Keyboard.dismiss();

      const timeUsed = Date.now() - questionStartTime.current;
      const points = calculatePoints(userAnswerCorrect, timedOut, timeUsed, maxTime);
      const newAnswer = {
        operation: mode === 'trueFalse'
          ? `${operation.question} = ${operation.displayAnswer}`
          : operation.question,
        correct: userAnswerCorrect,
        timeUsed,
        maxTime,
        pointsEarned: points,
      };

      const newAnswers = [...answersRef.current, newAnswer];
      const newScore = scoreRef.current + points;

      setAnswers(newAnswers);
      setScore(newScore);
      setFeedback(userAnswerCorrect ? 'correct' : 'wrong');

      // En modo contra reloj termina al primer error; en los demás al agotar las preguntas
      const shouldEnd =
        (mode === 'timeAttack' && !userAnswerCorrect) ||
        (mode !== 'timeAttack' && questionIndex + 1 >= iterations);

      // Retardo para que el usuario vea el feedback antes de pasar a la siguiente pregunta
      setTimeout(() => {
        if (shouldEnd) {
          goToResults(newAnswers, newScore);
          return;
        }
        setOperation(generateOperation(difficulty, mode));
        setInput('');
        setFeedback(null);
        setTimerKey((k) => k + 1);
        setTimerRunning(true);
        setQuestionIndex((q) => q + 1);
        questionStartTime.current = Date.now();
        handledRef.current = false;
      }, 700);
    },
    [questionIndex, operation, mode, difficulty, iterations, maxTime, goToResults]
  );

  const handleTimeout = useCallback(() => handleAnswer(false, true), [handleAnswer]);

  const handleClassicSubmit = () => {
    const num = parseInt(input.trim(), 10);
    if (isNaN(num)) return;
    handleAnswer(num === operation.correctAnswer);
  };

  const feedbackColor = feedback === 'correct' ? '#2ecc71' : feedback === 'wrong' ? '#e74c3c' : undefined;
  const progressLabel = mode !== 'timeAttack'
    ? `${questionIndex + 1} / ${iterations}`
    : `${Math.ceil(totalTimeLeft / 1000)}s`;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.topBar}>
            <Text style={styles.progressText}>{progressLabel}</Text>
            <Text style={styles.scoreText}>Puntaje: {score}</Text>
          </View>

          <TimerBar
            duration={maxTime}
            running={timerRunning}
            onExpire={handleTimeout}
            resetKey={timerKey}
          />

          <View style={[styles.questionCard, feedback ? { borderColor: feedbackColor, borderWidth: 3 } : null]}>
            {mode === 'trueFalse' ? (
              <>
                <Text style={styles.questionText}>{operation.question}</Text>
                <Text style={styles.equalsText}>=</Text>
                <Text style={styles.questionText}>{operation.displayAnswer}</Text>
              </>
            ) : (
              <Text style={styles.questionText}>{operation.question} = ?</Text>
            )}
            {feedback && (
              <Text style={[styles.feedbackText, { color: feedbackColor }]}>
                {feedback === 'correct'
                  ? '✓ Correcto'
                  : `✗ Incorrecto (${operation.correctAnswer})`}
              </Text>
            )}
          </View>

          {mode === 'classic' && (
            <View style={styles.inputSection}>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={input}
                onChangeText={setInput}
                placeholder="Tu respuesta"
                placeholderTextColor="#95a5a6"
                editable={!feedback}
                onSubmitEditing={handleClassicSubmit}
                returnKeyType="done"
                autoFocus
              />
              <TouchableOpacity
                style={[styles.submitBtn, (!input.trim() || !!feedback) && styles.submitBtnDisabled]}
                onPress={handleClassicSubmit}
                disabled={!input.trim() || !!feedback}
              >
                <Text style={styles.submitText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'trueFalse' && (
            <View style={styles.tfRow}>
              <TouchableOpacity
                style={[styles.tfBtn, styles.tfTrue]}
                onPress={() => handleAnswer(operation.isCorrect === true)}
                disabled={!!feedback}
              >
                <Text style={styles.tfText}>Verdadero</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tfBtn, styles.tfFalse]}
                onPress={() => handleAnswer(operation.isCorrect === false)}
                disabled={!!feedback}
              >
                <Text style={styles.tfText}>Falso</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'multipleChoice' && operation.options && (
            <View style={styles.optionsGrid}>
              {operation.options.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.optionBtn}
                  onPress={() => handleAnswer(opt === operation.correctAnswer)}
                  disabled={!!feedback}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {mode === 'timeAttack' && (
            <View style={styles.totalTimerTrack}>
              <View
                style={[
                  styles.totalTimerFill,
                  { width: `${(totalTimeLeft / config.totalTimeAttack) * 100}%` },
                ]}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  flex: { flex: 1 },
  container: { flex: 1, padding: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressText: { fontSize: 14, color: '#7f8c8d', fontWeight: '600' },
  scoreText: { fontSize: 14, color: '#3498db', fontWeight: '700' },
  questionCard: {
    backgroundColor: '#ffffff', borderRadius: 20, padding: 32,
    alignItems: 'center', marginVertical: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    borderWidth: 2, borderColor: 'transparent',
  },
  questionText: { fontSize: 44, fontWeight: '800', color: '#2c3e50' },
  equalsText: { fontSize: 32, color: '#7f8c8d', marginVertical: 4 },
  feedbackText: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  inputSection: { gap: 12 },
  input: {
    backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 2,
    borderColor: '#dfe6e9', paddingHorizontal: 20, paddingVertical: 14,
    fontSize: 24, textAlign: 'center', color: '#2c3e50', fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#3498db', borderRadius: 12, paddingVertical: 16, alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#bdc3c7' },
  submitText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  tfRow: { flexDirection: 'row', gap: 16 },
  tfBtn: {
    flex: 1, borderRadius: 16, paddingVertical: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  tfTrue: { backgroundColor: '#2ecc71' },
  tfFalse: { backgroundColor: '#e74c3c' },
  tfText: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  optionBtn: {
    width: '47%', backgroundColor: '#ffffff', borderRadius: 16,
    paddingVertical: 22, alignItems: 'center',
    borderWidth: 2, borderColor: '#dfe6e9',
  },
  optionText: { fontSize: 28, fontWeight: '800', color: '#2c3e50' },
  totalTimerTrack: {
    height: 8, backgroundColor: '#dfe6e9', borderRadius: 4,
    overflow: 'hidden', marginTop: 20,
  },
  totalTimerFill: { height: '100%', backgroundColor: '#e67e22', borderRadius: 4 },
});
