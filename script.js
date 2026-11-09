/* ==========================================
   LÓGICA DEL OBJETO DE APRENDIZAJE (script.js)
   Sprint 3 - Entrega Final | Fabricio Pirez
   ========================================== */

// Estado global de la aplicación y sistema de puntuación
const state = {
  scores: {
    act1: 0,
    act2: 0,
    act3: 0
  },
  correctAnswers: {
    act1: 'B',
    act2: 'A',
    act3: 'B'
  },
  explanations: {
    act1: "¡Correcto! Opción B. El acelerómetro es el sensor de entrada interno que detecta cambios de aceleración, posición, inclinación y giros de la tarjeta.",
    act2: "¡Correcto! Opción A. Para que la condición se evalúe continuamente durante la ejecución, el bloque condicional 'si nivel de luz < 50' debe anidarse dentro del bucle 'para siempre'.",
    act3: "¡Correcto! Opción B. El altavoz es un actuador (dispositivo de salida) que transforma las señales eléctricas recibidas en ondas sonoras físicas sobre el entorno."
  }
};

/**
 * Evalúa la respuesta seleccionada por el estudiante en una actividad específica.
 * Maneja respuestas vacías, actualiza el DOM con feedback instantáneo y modifica el puntaje.
 * 
 * @param {string} activityId - ID de la actividad ('act1', 'act2', 'act3')
 */
function evaluateActivity(activityId) {
  const selectedOption = document.querySelector(`input[name="${activityId}"]:checked`);
  const feedbackEl = document.getElementById(`fb-${activityId}`);
  const fieldsetEl = document.getElementById(`fieldset-${activityId}`);

  // 1. Manejo de respuesta vacía (Aviso de validación)
  if (!selectedOption) {
    feedbackEl.textContent = "⚠️ Atención: Debes seleccionar una opción antes de comprobar la respuesta.";
    feedbackEl.className = "feedback-box warning";
    return;
  }

  const userAnswer = selectedOption.value;
  const isCorrect = userAnswer === state.correctAnswers[activityId];

  // 2. Feedback dinámico en el DOM
  if (isCorrect) {
    feedbackEl.textContent = state.explanations[activityId];
    feedbackEl.className = "feedback-box correct";
    
    // Actualizar estilo del contenedor
    fieldsetEl.classList.remove("is-incorrect");
    fieldsetEl.classList.add("is-correct");

    // Asignar puntos (100 XP por actividad acertada)
    state.scores[activityId] = 100;
  } else {
    feedbackEl.textContent = "❌ Respuesta incorrecta. Revisa los conceptos del Briefing e inténtalo nuevamente.";
    feedbackEl.className = "feedback-box incorrect";

    // Actualizar estilo del contenedor
    fieldsetEl.classList.remove("is-correct");
    fieldsetEl.classList.add("is-incorrect");

    // Restar / Reiniciar puntos de esta actividad si falla
    state.scores[activityId] = 0;
  }

  // 3. Actualizar elementos de gamificación en tiempo real
  updateGamification();
}

/**
 * Calcula el puntaje total, actualiza el DOM de la barra de progreso,
 * la puntuación de XP y ajusta el rango narrativo del estudiante.
 */
function updateGamification() {
  const totalXP = state.scores.act1 + state.scores.act2 + state.scores.act3;
  const maxXP = 300;
  const percentage = Math.round((totalXP / maxXP) * 100);

  // Actualizar contador de XP en el DOM
  const xpScoreEl = document.getElementById('xp-score');
  if (xpScoreEl) {
    xpScoreEl.textContent = totalXP;
  }

  // Actualizar barra de progreso visual
  const progressBarEl = document.getElementById('progress-bar');
  const progressContainerAria = document.getElementById('progress-container-aria');

  if (progressBarEl) {
    progressBarEl.style.width = `${percentage}%`;
  }
  if (progressContainerAria) {
    progressContainerAria.setAttribute('aria-valuenow', percentage);
  }

  // Actualizar Rango Narrativo del usuario según sus puntos
  const rankEl = document.getElementById('user-rank');
  if (rankEl) {
    if (totalXP === 0) {
      rankEl.textContent = "Cadete de Sistemas";
    } else if (totalXP === 100) {
      rankEl.textContent = "Técnico Jr.";
    } else if (totalXP === 200) {
      rankEl.textContent = "Especialista Hardware";
    } else if (totalXP === 300) {
      rankEl.textContent = "Ingeniero micro:bit 🚀";
    }
  }
}

/**
 * Restablece todo el formulario, limpia las selecciones, remueve los mensajes de feedback
 * y reinicia el sistema de gamificación a 0 XP.
 */
function resetMission() {
  // Limpiar campos del formulario
  const form = document.getElementById('mission-form');
  if (form) form.reset();

  // Limpiar mensajes de feedback y clases de estilo
  ['act1', 'act2', 'act3'].forEach(actId => {
    state.scores[actId] = 0;
    
    const feedbackEl = document.getElementById(`fb-${actId}`);
    if (feedbackEl) {
      feedbackEl.textContent = "";
      feedbackEl.className = "feedback-box";
    }

    const fieldsetEl = document.getElementById(`fieldset-${actId}`);
    if (fieldsetEl) {
      fieldsetEl.classList.remove("is-correct", "is-incorrect");
    }
  });

  // Reiniciar panel de gamificación
  updateGamification();
}
