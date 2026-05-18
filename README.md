# Desafío Cálculo Mental

Ejercicio práctico para la materia **Desarrollo de Aplicaciones I** — Aplicación móvil de cálculo mental desarrollada en React Native con Expo. El objetivo es evaluar la capacidad del usuario para resolver operaciones matemáticas bajo presión de tiempo, registrando desempeño, precisión y velocidad de respuesta.

---

## Tecnologías utilizadas

- React Native 0.81 + Expo 54
- React Navigation (Stack + Bottom Tabs)
- AsyncStorage para persistencia local
- JavaScript / TypeScript

---

## Funcionalidades implementadas

### Modos de juego

| Modo | Descripción |
|---|---|
| **Clásico** | El usuario escribe el resultado de la operación |
| **Verdadero / Falso** | Se muestra una operación con un resultado (correcto o no) y el usuario indica si es verdadero o falso |
| **Múltiple Choice** | Se presentan 4 opciones y el usuario selecciona la correcta |
| **Contra Reloj** | El usuario responde operaciones de forma continua hasta agotar el tiempo total o fallar |

### Niveles de dificultad

| Nivel | Números hasta | Operaciones | Tiempo por pregunta | Tiempo total (contra reloj) |
|---|---|---|---|---|
| Fácil | 10 | + − | 15 s | 60 s |
| Medio | 50 | + − × | 10 s | 90 s |
| Difícil | 100 | + − × ÷ | 7 s | 120 s |

### Configuración de partida

- Selección de dificultad (fácil / medio / difícil)
- Selección de modo de juego
- Cantidad de preguntas por ronda: 5, 10, 15 o 20 (no aplica en modo contra reloj)

### Sistema de puntaje

| Situación | Puntos |
|---|---|
| Respuesta correcta rápida (< 75 % del tiempo) | +100 |
| Respuesta correcta en tiempo | +70 |
| Respuesta incorrecta | −30 |
| Sin respuesta (tiempo agotado) | −50 |

### Generación de operaciones

Las operaciones se generan aleatoriamente respetando las restricciones de cada dificultad:
- La resta nunca produce resultados negativos.
- La división siempre produce cocientes enteros.
- Las opciones incorrectas en múltiple choice se generan con deltas cercanos al resultado correcto.

### Estadísticas al finalizar la ronda

- Puntaje total (con color verde/rojo según resultado)
- Cantidad de respuestas correctas e incorrectas
- Precisión porcentual
- Tiempo de respuesta promedio
- Detalle operación por operación con tiempo y puntos obtenidos

### Historial y mejores puntajes

- Persistencia local mediante AsyncStorage
- Se almacenan hasta 100 partidas
- Pantalla de historial con dos pestañas: mejores puntajes (top 10) e historial completo

### Otras funcionalidades

- Reinicio de partida desde la pantalla de resultados
- Timer visual por pregunta (barra de progreso)
- Bloqueo de navegación durante la partida para evitar abandonos accidentales
- Limpieza de historial desde la pantalla de historial

---

## Estructura del proyecto

```
app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── ConfigScreen.jsx
│   │   ├── GameScreen.jsx
│   │   ├── ResultsScreen.jsx
│   │   └── HistoryScreen.jsx
│   ├── components/
│   │   └── TimerBar.jsx
│   ├── utils/
│   │   ├── gameLogic.js   # generación de operaciones
│   │   ├── scoring.js     # cálculo de puntaje
│   │   └── storage.js     # persistencia AsyncStorage
│   └── types/
│       └── index.js       # configuración de dificultades
└── App.jsx                # navegación principal
```

---

## Cómo ejecutar

```bash
cd app
npm install
npm start
```

Luego escanear el QR con la app **Expo Go** en el dispositivo móvil, o presionar `a` para abrir en emulador Android / `i` para iOS.
