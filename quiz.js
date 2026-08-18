/* ==========================================================================
   SERVO-SYSTEMS & INDUSTRIAL AUTOMATION - EVALUATION QUIZ MODULE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Questions database
    const questions = [
        {
            question: "¿Cuál es el modelo de CPU de gama alta utilizado para controlar los procesos de las plantas en el laboratorio del CEAI?",
            options: [
                "CPU 1214C AC/DC/Rly",
                "CPU 1516-3 PN/DP",
                "CPU 315-2 DP",
                "CPU 1511-1 PN"
            ],
            correct: 1,
            explanation: "Las plantas didácticas del CEAI utilizan la potente CPU Siemens S7-1516-3 PN/DP, la cual dispone de una memoria de trabajo amplia y tres puertos de comunicación integrados (dos PROFINET y uno PROFIBUS)."
        },
        {
            question: "¿Qué norma internacional estandariza los lenguajes de programación para PLCs (como LADDER, SFC, FBD y ST)?",
            options: [
                "Norma ISO 9001",
                "Norma IEC 61131-3",
                "Norma IEEE 802.3",
                "Norma ISA S5.1"
            ],
            correct: 1,
            explanation: "La norma IEC 61131-3 es el estándar mundial que unifica los lenguajes de programación industriales, permitiendo portar lógicas entre diferentes fabricantes."
        },
        {
            question: "En la configuración del hardware S7-1500 del taller, ¿qué módulo está ubicado físicamente en el SLOT 4?",
            options: [
                "Módulo de Salidas Digitales (DQ 32)",
                "Módulo de Entradas Analógicas (AI 8)",
                "Módulo de Entradas Digitales (DI 32)",
                "Módulo de Salidas Analógicas (AQ 4)"
            ],
            correct: 1,
            explanation: "El slot 4 del rack está reservado para el módulo de entradas analógicas (AI 8xU/I/RTD/TC ST) que captura sensores continuos como PT100 y transmisores de presión."
        },
        {
            question: "¿Cuál es el rango numérico entero que utiliza internamente Siemens S7 para representar una señal analógica normalizada de 0-10V o 4-20mA?",
            options: [
                "0 a 1023",
                "0 a 32767",
                "0 a 27648",
                "-1000 a 1000"
            ],
            correct: 2,
            explanation: "Siemens normaliza sus señales analógicas de entradas y salidas en el rango de enteros de 0 a 27648. Se requiere usar NORM_X y SCALE_X para pasarlo a unidades físicas."
        },
        {
            question: "Según la guía GEMMA, ¿qué significa el estado operacional 'A1'?",
            options: [
                "Parada de emergencia por falla crítica",
                "Parada en estado inicial (reposo, listo para iniciar)",
                "Producción normal secuencial activa",
                "Marcha de verificación manual de sensores"
            ],
            correct: 1,
            explanation: "El estado A1 representa 'Parada en estado inicial'. Es el reposo del automatismo donde el sistema está a la espera de la pulsación de marcha."
        },
        {
            question: "¿Cuál de los siguientes es un bloque de interrupción cíclica del PLC utilizado típicamente para implementar lazos de regulación PID_Compact?",
            options: [
                "OB1",
                "OB100",
                "OB30",
                "FC10"
            ],
            correct: 2,
            explanation: "El OB30 es un bloque de organización de alarma cíclica (Cyclic Interrupt) ejecutado a intervalos fijos de tiempo, ideal para el muestreo estable del lazo PID."
        },
        {
            question: "En la planta de Llenado, ¿qué dirección física de entrada (%I) corresponde al sensor óptico detector de presencia de botella?",
            options: [
                "%I0.0",
                "%I0.3",
                "%IW96",
                "%Q0.1"
            ],
            correct: 0,
            explanation: "La dirección física %I0.0 en el mapa de entradas del PLC corresponde al Sensor de Presencia de Botella. Las salidas usan la letra Q y las variables continuas usan W."
        },
        {
            question: "Si el sensor analógico de presión de la planta de Filtración supera los 3.0 bar, ¿qué acción de seguridad inmediata ejecuta el PLC programado?",
            options: [
                "Aumenta la frecuencia de la bomba para limpiar el filtro",
                "Abre la válvula de entrada y mantiene la bomba encendida",
                "Apaga la bomba de alimentación para proteger las membranas del filtro",
                "Reinicia el PLC virtual en modo STOP"
            ],
            correct: 2,
            explanation: "Por seguridad de las membranas, el PLC detiene inmediatamente la bomba de alimentación (%QW100 = 0) ante presiones elevadas y activa una alerta en la HMI."
        },
        {
            question: "En un diagrama de tuberías e instrumentación P&ID, ¿qué variable física e instrumento representa la sigla 'TT'?",
            options: [
                "Transmisor de Tensión",
                "Transmisor de Temperatura",
                "Controlador de Tiempo",
                "Termostato de Presión"
            ],
            correct: 1,
            explanation: "La nomenclatura ISA designa 'TT' como Temperature Transmitter (Transmisor de Temperatura). Por ejemplo, la termocupla conectada a la entrada del reactor."
        },
        {
            question: "En el modelado mediante GRAFCET, ¿cuándo se valida una transición secuencial?",
            options: [
                "Cuando todas las etapas anteriores están activas y la receptividad asociada es Verdadera",
                "Únicamente al pulsar el botón de parada de emergencia",
                "Cuando el PLC está en modo de arranque inicial",
                "Al forzar las salidas digitales desde la tabla de forzado"
            ],
            correct: 0,
            explanation: "Una transición se franquea si y solo si sus etapas inmediatamente anteriores están activas (tienen ficha) y la condición lógica o receptividad se cumple."
        }
    ];

    // Dom elements
    const introPanel = document.getElementById('quiz-intro-panel');
    const playPanel = document.getElementById('quiz-play-panel');
    const resultsPanel = document.getElementById('quiz-results-panel');
    
    const btnStart = document.getElementById('btn-start-quiz');
    const btnNext = document.getElementById('btn-next-question');
    const btnRetry = document.getElementById('btn-retry-quiz');

    const progressFill = document.getElementById('quiz-progress-fill');
    const lblQuestionNum = document.getElementById('lbl-question-number');
    const lblCurrentScore = document.getElementById('lbl-quiz-current-score');
    const txtQuestion = document.getElementById('quiz-question-text');
    const optionsContainer = document.getElementById('quiz-options-container');
    const explanationBox = document.getElementById('quiz-explanation');
    const fbTitle = document.getElementById('quiz-feedback-title');
    const fbText = document.getElementById('quiz-feedback-text');

    const resultsIcon = document.getElementById('quiz-results-icon');
    const resultsTitle = document.getElementById('quiz-results-title');
    const resultsScoreText = document.getElementById('quiz-results-score');
    const resultsFeedback = document.getElementById('quiz-results-feedback');

    let currentQuestionIndex = 0;
    let score = 0;
    let answered = false;

    // Start
    btnStart.addEventListener('click', () => {
        introPanel.style.display = 'none';
        playPanel.style.display = 'block';
        resetQuizState();
        showQuestion();
    });

    // Retry
    btnRetry.addEventListener('click', () => {
        resultsPanel.style.display = 'none';
        playPanel.style.display = 'block';
        resetQuizState();
        showQuestion();
    });

    // Next
    btnNext.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    });

    function resetQuizState() {
        currentQuestionIndex = 0;
        score = 0;
    }

    function showQuestion() {
        answered = false;
        explanationBox.style.display = 'none';
        
        const q = questions[currentQuestionIndex];
        
        // Update labels
        lblQuestionNum.textContent = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
        lblCurrentScore.textContent = `Puntaje: ${score}`;
        txtQuestion.textContent = q.question;
        
        // Progress bar
        const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressFill.style.width = `${progressPercent}%`;

        // Render options
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectOption(idx, btn));
            optionsContainer.appendChild(btn);
        });
    }

    function selectOption(selectedIdx, selectedBtn) {
        if (answered) return;
        answered = true;

        const q = questions[currentQuestionIndex];
        const optionButtons = optionsContainer.querySelectorAll('.option-btn');

        // Disable hover/click effects on others
        optionButtons.forEach(btn => btn.style.pointerEvents = 'none');

        if (selectedIdx === q.correct) {
            score++;
            selectedBtn.classList.add('correct-choice');
            fbTitle.textContent = "¡Respuesta Correcta! ✓";
            explanationBox.classList.remove('wrong-choice');
            explanationBox.style.borderColor = "var(--color-green)";
            fbTitle.style.color = "var(--color-green)";
        } else {
            selectedBtn.classList.add('incorrect-choice');
            // highlight the correct one
            optionButtons[q.correct].classList.add('correct-choice');
            fbTitle.textContent = "Respuesta Incorrecta ✗";
            explanationBox.classList.add('wrong-choice');
            explanationBox.style.borderColor = "var(--color-red)";
            fbTitle.style.color = "var(--color-red)";
        }

        lblCurrentScore.textContent = `Puntaje: ${score}`;
        fbText.textContent = q.explanation;
        explanationBox.style.display = 'block';
    }

    function showResults() {
        playPanel.style.display = 'none';
        resultsPanel.style.display = 'block';

        const finalPercent = Math.round((score / questions.length) * 100);
        resultsScoreText.textContent = `Tu puntaje fue de: ${finalPercent}% (${score} de ${questions.length} respuestas correctas)`;

        if (finalPercent >= 80) {
            resultsIcon.textContent = "🏆";
            resultsTitle.textContent = "¡Felicitaciones, Aprobaste!";
            resultsFeedback.textContent = "Has demostrado un excelente dominio de las guías de taller y fundamentos de automatización industrial del CEAI. ¡Estás listo para programar el S7-1500 real!";
            resultsTitle.style.color = "var(--color-green)";
        } else {
            resultsIcon.textContent = "⚙️";
            resultsTitle.textContent = "Sigue intentando";
            resultsFeedback.textContent = "No lograste el 80% mínimo para aprobar. Repasa la configuración física del rack del PLC, la guía GEMMA y las simulaciones de las plantas didácticas e inténtalo de nuevo.";
            resultsTitle.style.color = "var(--color-yellow)";
        }
    }
});
