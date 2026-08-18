/* ==========================================================================
   SERVO-SYSTEMS & INDUSTRIAL AUTOMATION - MAIN APP SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // === 1. NAVIGATION CONTROL (SPA) ===
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    const sectionTitle = document.getElementById('section-title');

    const titles = {
        'dashboard-section': 'Panel de Control Educativo',
        'plc-section': 'Arquitectura de Hardware S7-1500',
        'gemma-section': 'Modelado GEMMA / GRAFCET',
        'simulators-section': 'Laboratorio de Simulación de Procesos',
        'quiz-section': 'Evaluación de Competencias Mecatrónicas'
    };

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // Toggle active classes
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Update title
            sectionTitle.textContent = titles[targetId] || 'Servosistemas CEAI';
        });
    });

    // Subtabs control (GEMMA & GRAFCET tabs, and Simulator tabs)
    const setupSubTabs = (containerSelector) => {
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach(container => {
            const tabs = container.querySelectorAll('.sub-tab-btn');
            const contents = container.parentElement.querySelectorAll('.sub-tab-content');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetSub = tab.getAttribute('data-sub');
                    
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));
                    
                    tab.classList.add('active');
                    const targetContent = document.getElementById(targetSub);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
        });
    };

    setupSubTabs('.sub-tabs');

    // === 2. INTERACTIVE PLC S7-1500 RACK ===
    const plcModules = document.querySelectorAll('.plc-module');
    const plcDetailsContainer = document.getElementById('module-details');

    const plcData = {
        cpu: {
            title: 'Módulo CPU 1516-3 PN/DP',
            reference: '6ES7 516-3AN02-0AB0',
            slot: '1',
            desc: 'Unidad de procesamiento central (CPU) de gama alta para aplicaciones de control exigentes. Equipada con 3 puertos de comunicación (2x PROFINET/Ethernet, 1x PROFIBUS DP) que permiten integrar buses de campo y comunicación con HMI, Factory I/O y PLCSIM.',
            specs: {
                'Memoria de Trabajo': '1 MB (código) / 5 MB (datos)',
                'Tiempo Procesamiento': '10 ns (operaciones binarias)',
                'Interfaces Integradas': 'PROFINET (IP/Ethernet), PROFIBUS DP',
                'Alimentación': '24 VDC'
            },
            mapping: [
                'OB1: Bloque de organización principal',
                'OB30: Bloque cíclico para control PID (100ms)',
                'DB1: Bloque de datos del proceso global',
                'PLCSIM IP: 192.168.0.1 (Conexión Factory I/O)'
            ]
        },
        di: {
            title: 'Módulo Entradas Digitales (DI 32x24VDC HF)',
            reference: '6ES7 521-1BL00-0AB0',
            slot: '2',
            desc: 'Módulo de entradas discretas para capturar el estado de sensores digitales (0 o 24 VDC). Permite filtrar ruido eléctrico y diagnosticar fallas de cortocircuito o rotura de hilo.',
            specs: {
                'Número de Entradas': '32 canales',
                'Voltaje Nominal': '24 VDC (tipo 3)',
                'Aislamiento Galvánico': 'Sí, por optoacoplador',
                'LED de Estado': '32 indicadores verdes'
            },
            mapping: [
                '%I0.0 : Sensor Botella (Estación Llenado)',
                '%I0.1 : Sensor Nivel Alto B101 (Filtración)',
                '%I0.2 : Sensor Nivel Bajo B101 (Filtración)',
                '%I0.3 : Termostato Seguridad (Reactor)'
            ]
        },
        dq: {
            title: 'Módulo Salidas Digitales (DQ 32x24VDC/0.5A HF)',
            reference: '6ES7 522-1BL01-0AB0',
            slot: '3',
            desc: 'Módulo de salidas discretas de estado sólido (transistores) para el accionamiento de actuadores digitales de baja potencia, contactores o electroválvulas mediante señales de 24 VDC y hasta 0.5 Amperios por canal.',
            specs: {
                'Número de Salidas': '32 canales',
                'Tipo de Salida': 'Transistor (PNP)',
                'Corriente por Canal': '0.5 A (protegido contra cortocircuito)',
                'Retraso de Conmutación': 'Max. 100 µs'
            },
            mapping: [
                '%Q0.0 : Motor Banda Transportadora (Llenado)',
                '%Q0.1 : Electroválvula Llenado Y101 (Llenado)',
                '%Q0.2 : Electroválvula Drenaje Y102 (Filtración)',
                '%Q0.3 : Resistencia Térmica OB30 (Reactor)'
            ]
        },
        ai: {
            title: 'Módulo Entradas Analógicas (AI 8xU/I/RTD/TC ST)',
            reference: '6ES7 531-7KF00-0AB0',
            slot: '4',
            desc: 'Módulo de entradas analógicas de resolución de 16 bits para la lectura de variables físicas continuas, como presión, temperatura (RTD PT100), caudal y nivel. Soporta señales en tensión (-10V a 10V) y corriente (4-20mA).',
            specs: {
                'Número de Entradas': '8 canales (4 grupos)',
                'Resolución Digital': '16 bits',
                'Tipos de Sensor': 'Tensión, Corriente, Termopar, RTD',
                'Tiempo de Integración': 'Programable por canal'
            },
            mapping: [
                '%IW96 : Transmisor de Nivel (Llenado) [0-27648]',
                '%IW100 : Transmisor de Presión (Filtración) [0-27648]',
                '%IW102 : Transmisor de Caudal (Filtración) [0-27648]',
                '%IW104 : Termocupla/PT100 Temperatura (Reactor)'
            ]
        },
        aq: {
            title: 'Módulo Salidas Analógicas (AQ 4xU/I ST)',
            reference: '6ES7 532-5HD00-0AB0',
            slot: '5',
            desc: 'Módulo de salidas analógicas de alta precisión para el control proporcional de actuadores continuos, tales como variadores de velocidad de bombas o servoválvulas proporcionales de regulación neumática y de caudal.',
            specs: {
                'Número de Salidas': '4 canales',
                'Resolución de Conversión': '16 bits',
                'Rangos de Señal': '0-10V, 1-5V, 0-20mA, 4-20mA',
                'Resistencia de Carga': 'Max. 1 kΩ (salida de corriente)'
            },
            mapping: [
                '%QW96 : Válvula Neumática Proporcional (0-10V)',
                '%QW98 : Velocidad Banda (0-10V/Variador)',
                '%QW100 : Frecuencia de Bomba Variador (0-10V)',
                '%QW104 : Señal de Control PID Calefactor (4-20mA)'
            ]
        }
    };

    const renderPLCDetails = (key) => {
        const data = plcData[key];
        if (!data) return;

        let specsHTML = '';
        for (const [sKey, sVal] of Object.entries(data.specs)) {
            specsHTML += `<tr><th>${sKey}</th><td>${sVal}</td></tr>`;
        }

        let mappingHTML = '';
        data.mapping.forEach(item => {
            mappingHTML += `<li>${item}</li>`;
        });

        plcDetailsContainer.innerHTML = `
            <div class="plc-detail-grid">
                <div class="detail-specs">
                    <h3>${data.title}</h3>
                    <p class="font-xs" style="color:var(--text-muted); margin-bottom:1rem;">Referencia de Catálogo: <strong>${data.reference}</strong> | Slot: ${data.slot}</p>
                    <p>${data.desc}</p>
                    <table style="margin-top: 1rem;">
                        <tbody>
                            ${specsHTML}
                        </tbody>
                    </table>
                </div>
                <div class="detail-mapping">
                    <h4>Mapa de Direcciones de E/S (CEAI Taller)</h4>
                    <ul class="mapping-list">
                        ${mappingHTML}
                    </ul>
                    <div style="margin-top:1.5rem; background:rgba(0,130,138,0.05); padding:10px; border-radius:8px; border: 1px solid var(--brand-teal-glow);">
                        <span style="font-size:0.75rem; color:var(--brand-teal-light); font-weight:700;">Consejo de Programación</span>
                        <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Usa los bloques <code>SCALE_X</code> y <code>NORM_X</code> en TIA Portal para traducir los valores analógicos enteros [0 - 27648] a variables físicas de ingeniería.</p>
                    </div>
                </div>
            </div>
        `;
    };

    plcModules.forEach(mod => {
        mod.addEventListener('click', () => {
            plcModules.forEach(m => m.classList.remove('active'));
            mod.classList.add('active');
            const key = mod.getAttribute('data-module');
            renderPLCDetails(key);
        });
    });

    // Load initial PLC details
    renderPLCDetails('cpu');

    // === 3. INTERACTIVE GEMMA STATES ===
    const gemmaButtons = document.querySelectorAll('.gemma-state-btn');
    const gemmaDetailsContainer = document.getElementById('gemma-details');

    const gemmaData = {
        A1: {
            title: 'A1: Parada en estado inicial',
            condition: 'El sistema de control está encendido pero el proceso está en reposo, esperando el pulsador de Marcha (%I0.0). Las variables están a cero y todos los actuadores apagados.',
            entry: 'Al encender el PLC (arranque de CPU) o al finalizar con éxito una secuencia automática de ciclo único.',
            example: 'Tanques de filtración, reactor y mezcla vacíos. Cinta transportadora de botellas detenida.'
        },
        A2: {
            title: 'A2: Parada solicitada al final del ciclo',
            condition: 'Fase de transición transitoria donde el operario ha solicitado detener la máquina, pero el PLC continúa ejecutando el proceso hasta completar la secuencia o lote actual para no dejar producto a medias.',
            entry: 'Pulsar botón de "Parada de Fin de Ciclo" mientras el sistema está en F1 (Producción normal).',
            example: 'En la planta de Llenado, la botella que ya se está llenando terminará de cargarse y saldrá de la banda antes de detener la cinta transportadora.'
        },
        A6: {
            title: 'A6: Puesta en marcha de seguridad',
            condition: 'Etapa preparatoria que permite reiniciar el sistema de manera segura tras una parada de emergencia (D1) o una falla, asegurando que las condiciones iniciales sean válidas.',
            entry: 'Tras desenclavar la parada de emergencia y presionar el botón de rearme (RESET).',
            example: 'Encender temporizadores, forzar válvulas de purga a cerrarse y reposicionar pistones a su posición inicial.'
        },
        F1: {
            title: 'F1: Producción normal',
            condition: 'El sistema automático funciona de manera secuencial y cíclica cumpliendo la tarea del proceso sin intervención manual.',
            entry: 'Activar botón de marcha en estado inicial (A1) o tras salir de verificación (F3).',
            example: 'Proceso completo: llenado automático de botellas coordinado por la banda transportadora y sensor óptico.'
        },
        F2: {
            title: 'F2: Marcha de preparación',
            condition: 'Fase donde se preparan las condiciones de las variables continuas (como presión o temperatura) antes de iniciar la producción secuencial normal.',
            entry: 'Activar marcha de precalentamiento o llenado de reservorios auxiliares.',
            example: 'Calentamiento inicial del reactor hasta los 60°C antes de permitir la entrada de jarabe base concentrado.'
        },
        F3: {
            title: 'F3: Marcha de verificación sin orden',
            condition: 'Modo manual que permite a los tecnólogos/aprendices verificar individualmente el cableado y respuesta física de sensores y actuadores desde la interfaz web o el HMI.',
            entry: 'Selección del modo "Manual" en la pantalla de supervisión HMI.',
            example: 'Forzar el encendido de la bomba de filtrado desde el PLC para verificar el sentido de giro del rodete motor.'
        },
        D1: {
            title: 'D1: Parada de emergencia',
            condition: 'Fallo crítico de seguridad. El PLC deshabilita inmediatamente todas las salidas de potencia, cerrando válvulas de paso y desenergizando motores para proteger a los operarios y al equipo.',
            entry: 'Presionar el pulsador de hongo físico "Parada de Emergencia" (normalmente cerrado para seguridad positiva).',
            example: 'Parada instantánea de la banda de llenado, corte de corriente en la resistencia térmica del reactor y parada de la bomba de alimentación.'
        },
        D2: {
            title: 'D2: Diagnóstico y tratamiento de fallas',
            condition: 'El PLC permanece en estado especial permitiendo visualizar códigos de error en la HMI, mientras se inspeccionan sensores defectuosos o bloqueos mecánicos.',
            entry: 'Automáticamente tras activarse el relé de sobrecarga de un motor o alarma de sobrepresión.',
            example: 'Lectura de alarma en HMI: "Sobrepresión en Filtro de Sólidos PT101 (Presión > 3.0 bar)" y espera a limpieza manual.'
        }
    };

    const renderGEMMADetails = (stateKey) => {
        const state = gemmaData[stateKey];
        if (!state) return;

        gemmaDetailsContainer.innerHTML = `
            <h3>${state.title}</h3>
            <div class="gemma-desc-details">
                <p><strong>Descripción Técnica:</strong> ${state.condition}</p>
                <p><strong>Condiciones de Entrada:</strong> ${state.entry}</p>
                <p><strong>Aplicación en Planta Didáctica:</strong> ${state.example}</p>
                <div style="margin-top:1rem; border-left:3px solid var(--brand-teal-light); padding-left:10px; font-style:italic;">
                    <span style="font-size:0.75rem; font-weight:700; color:var(--text-main);">Pregunta del Instructor William:</span>
                    <p style="font-size:0.75rem; color:var(--text-muted);">¿En qué estado de la guía GEMMA debe encontrarse la planta antes de permitir cambiar los parámetros de sintonía del bloque PID?</p>
                </div>
            </div>
        `;
    };

    gemmaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            gemmaButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const stateKey = btn.getAttribute('data-state');
            renderGEMMADetails(stateKey);
        });
    });

    // Load initial GEMMA state details
    renderGEMMADetails('A1');

    // === 4. INTERACTIVE GRAFCET SIMULATOR ===
    const btnStartSeq = document.getElementById('btn-start-seq');
    const btnTriggerHigh = document.getElementById('btn-trigger-high');
    const btnTimerDone = document.getElementById('btn-timer-done');
    const btnTriggerLow = document.getElementById('btn-trigger-low');
    const btnEmergency = document.getElementById('btn-emergency-stop');
    const logOutput = document.getElementById('grafcet-log-output');

    let currentStep = 0;

    const addLogLine = (message, type = 'info') => {
        const line = document.createElement('div');
        line.className = `log-line ${type === 'danger' ? 'text-red' : type === 'success' ? 'text-green' : ''}`;
        
        // Quick color styles for styling logs directly
        if (type === 'danger') line.style.color = 'var(--color-red)';
        if (type === 'success') line.style.color = 'var(--color-green)';
        
        line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logOutput.prepend(line);
    };

    const updateGrafcetSteps = (newStep) => {
        document.querySelectorAll('.grafcet-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(`step-${newStep}`).classList.add('active');
        currentStep = newStep;
    };

    btnStartSeq.addEventListener('click', () => {
        if (currentStep !== 0) return;
        
        addLogLine("Pulsador de marcha accionado. Transición 0->1 validada.", "success");
        addLogLine("Etapa 1 activa: Iniciando llenado. Bomba de alimentación encendida (%Q0.0 = 1).");
        updateGrafcetSteps(1);

        btnStartSeq.disabled = true;
        btnTriggerHigh.disabled = false;
    });

    btnTriggerHigh.addEventListener('click', () => {
        if (currentStep !== 1) return;

        addLogLine("Sensor de nivel alto activado (%I0.1 = 1). Transición 1->2 validada.", "success");
        addLogLine("Etapa 2 activa: Fase de mezcla. Bomba apagada (%Q0.0 = 0), Agitador encendido (%Q0.2 = 1). Iniciando temporizador 5s.");
        updateGrafcetSteps(2);

        btnTriggerHigh.disabled = true;
        
        // Simular retardo automático del temporizador para mayor realismo educativo
        setTimeout(() => {
            if (currentStep === 2) {
                btnTimerDone.disabled = false;
                addLogLine("Temporizador T1 finalizado (5 segundos transcurridos). Transición 2->3 lista.");
            }
        }, 3000);
    });

    btnTimerDone.addEventListener('click', () => {
        if (currentStep !== 2) return;

        addLogLine("Confirmación temporizador validada. Transición 2->3 ejecutada.", "success");
        addLogLine("Etapa 3 activa: Vaciado del tanque. Agitador apagado (%Q0.2 = 0), electroválvula de descarga abierta (%Q0.3 = 1).");
        updateGrafcetSteps(3);

        btnTimerDone.disabled = true;
        btnTriggerLow.disabled = false;
    });

    btnTriggerLow.addEventListener('click', () => {
        if (currentStep !== 3) return;

        addLogLine("Sensor de nivel bajo activado (%I0.0 = 1). Depósito vacío. Transición 3->0 validada.", "success");
        addLogLine("Retorno a Etapa 0 (Reposo). Válvula de descarga cerrada (%Q0.3 = 0). Ciclo finalizado con éxito.");
        updateGrafcetSteps(0);

        btnTriggerLow.disabled = true;
        btnStartSeq.disabled = false;
    });

    btnEmergency.addEventListener('click', () => {
        addLogLine("¡ALERTA! Parada de emergencia activada. Desactivando salidas de fuerza del PLC.", "danger");
        updateGrafcetSteps(0);
        
        // Reset button states
        btnStartSeq.disabled = false;
        btnTriggerHigh.disabled = true;
        btnTimerDone.disabled = true;
        btnTriggerLow.disabled = true;
        
        // Highlight GEMMA D1 state if open
        const d1Btn = document.querySelector('[data-state="D1"]');
        if (d1Btn) {
            d1Btn.click();
        }
    });
});
