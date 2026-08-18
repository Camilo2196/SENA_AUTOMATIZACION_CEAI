/* ==========================================================================
   SERVO-SYSTEMS & INDUSTRIAL AUTOMATION - PROCESS SIMULATORS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. ESTACIÓN DE LLENADO (FILLING STATION)
    // ==========================================
    const sliderBeltSpeed = document.getElementById('slider-belt-speed');
    const lblBeltSpeed = document.getElementById('lbl-belt-speed');
    const btnManualValve = document.getElementById('btn-manual-valve');
    const toggleLlenadoAuto = document.getElementById('toggle-llenado-auto');
    
    const activeBottle = document.getElementById('active-bottle');
    const bottleFluid = document.getElementById('bottle-fluid');
    const llenadoStream = document.getElementById('llenado-stream');
    const sensorOptical = document.getElementById('sensor-optical');
    const llenadoHeaderFill = document.getElementById('llenado-header-fill');

    // PLC LEDs
    const ledInLlen0 = document.getElementById('io-in-llen-0');
    const ledOutLlen0 = document.getElementById('io-out-llen-0');
    const ledOutLlen1 = document.getElementById('io-out-llen-1');
    const textInLlenAna = document.getElementById('io-in-llen-ana');

    let bottleX = -30; // initial x position
    let beltSpeed = parseInt(sliderBeltSpeed.value);
    let isAuto = toggleLlenadoAuto.checked;
    let isFilling = false;
    let bottleFillLevel = 0; // 0 to 100%
    let tankLevel = 70; // main tank level
    let animationId = null;

    sliderBeltSpeed.addEventListener('input', (e) => {
        beltSpeed = parseInt(e.target.value);
        lblBeltSpeed.textContent = beltSpeed;
        if (ledOutLlen0.classList.contains('active')) {
            textInLlenAna.textContent = `${tankLevel}%`;
        }
    });

    toggleLlenadoAuto.addEventListener('change', (e) => {
        isAuto = e.target.checked;
        if (!isAuto) {
            // Manual Mode: stop auto animation loop
            cancelAnimationFrame(animationId);
            animationId = null;
            // Stop belt motor
            ledOutLlen0.classList.remove('active');
            activeBottle.style.left = '100px'; // center under nozzle for manual testing
            bottleX = 100;
        } else {
            // Re-start auto loop
            bottleX = -30;
            bottleFillLevel = 0;
            bottleFluid.style.height = '0%';
            isFilling = false;
            llenadoStream.classList.remove('flowing');
            ledOutLlen1.classList.remove('active');
            startLlenadoLoop();
        }
    });

    // Manual filling button
    btnManualValve.addEventListener('mousedown', () => {
        if (isAuto) return;
        isFilling = true;
        llenadoStream.classList.add('flowing');
        ledOutLlen1.classList.add('active');
        fillManualBottle();
    });

    btnManualValve.addEventListener('mouseup', () => {
        isFilling = false;
        llenadoStream.classList.remove('flowing');
        ledOutLlen1.classList.remove('active');
    });

    btnManualValve.addEventListener('mouseleave', () => {
        isFilling = false;
        llenadoStream.classList.remove('flowing');
        ledOutLlen1.classList.remove('active');
    });

    function fillManualBottle() {
        if (!isFilling || isAuto) return;
        if (bottleFillLevel < 100 && tankLevel > 0) {
            bottleFillLevel += 2;
            tankLevel -= 0.5;
            bottleFluid.style.height = `${bottleFillLevel}%`;
            llenadoHeaderFill.style.height = `${tankLevel}%`;
            textInLlenAna.textContent = `${Math.round(tankLevel)}%`;
            setTimeout(fillManualBottle, 50);
        } else {
            isFilling = false;
            llenadoStream.classList.remove('flowing');
            ledOutLlen1.classList.remove('active');
        }
    }

    // Auto Simulation Loop
    function startLlenadoLoop() {
        if (!isAuto) return;

        // Move conveyor belt
        if (!isFilling) {
            ledOutLlen0.classList.add('active');
            bottleX += (beltSpeed / 25);
            activeBottle.style.left = `${bottleX}px`;
            
            // Bottle optical sensor position is around x = 100px (centered under nozzle)
            if (bottleX >= 98 && bottleX <= 104) {
                // Stop belt
                isFilling = true;
                ledOutLlen0.classList.remove('active');
                ledInLlen0.classList.add('active');
                
                // Trigger Valve
                ledOutLlen1.classList.add('active');
                llenadoStream.classList.add('flowing');
                
                autoFillBottle();
            } else {
                ledInLlen0.classList.remove('active');
            }

            // Recycle bottle if it goes off screen (canvas width is approx 350px)
            if (bottleX > 320) {
                bottleX = -30;
                bottleFillLevel = 0;
                bottleFluid.style.height = '0%';
                // Refill main tank if too empty
                if (tankLevel < 15) {
                    tankLevel = 80;
                    llenadoHeaderFill.style.height = `${tankLevel}%`;
                }
            }
        }

        animationId = requestAnimationFrame(startLlenadoLoop);
    }

    function autoFillBottle() {
        if (!isAuto) return;
        if (bottleFillLevel < 95) {
            bottleFillLevel += 3;
            tankLevel -= 0.5;
            bottleFluid.style.height = `${bottleFillLevel}%`;
            llenadoHeaderFill.style.height = `${Math.max(0, tankLevel)}%`;
            textInLlenAna.textContent = `${Math.round(Math.max(0, tankLevel))}%`;
            setTimeout(autoFillBottle, 80);
        } else {
            // Done filling
            bottleFillLevel = 100;
            bottleFluid.style.height = '100%';
            isFilling = false;
            llenadoStream.classList.remove('flowing');
            ledOutLlen1.classList.remove('active');
            ledInLlen0.classList.remove('active');
            // Re-enable belt motor
            ledOutLlen0.classList.add('active');
            bottleX += 6; // push out of sensor zone
        }
    }

    // Initialize Auto Llenado
    startLlenadoLoop();


    // ==========================================
    // 2. ESTACIÓN DE FILTRACIÓN (FILTRATION)
    // ==========================================
    const sliderPumpSpeed = document.getElementById('slider-pump-speed');
    const lblPumpSpeed = document.getElementById('lbl-pump-speed');
    const sliderClogging = document.getElementById('slider-clogging');
    const lblClogging = document.getElementById('lbl-clogging');
    const btnDrainValve = document.getElementById('btn-drain-valve');

    const feedPump = document.getElementById('feed-pump');
    const inflowFluid = document.getElementById('inflow-fluid');
    const outflowFluid = document.getElementById('outflow-fluid');
    const filterTankFill = document.getElementById('filter-tank-fill');
    const gaugePressure = document.getElementById('gauge-pressure');

    // PLC LEDs
    const ledOutFilt2 = document.getElementById('io-out-filt-2');
    const textInFiltPress = document.getElementById('io-in-filt-press');
    const textInFiltLevel = document.getElementById('io-in-filt-level');
    const textOutFiltPump = document.getElementById('io-out-filt-pump');

    let pumpSpeed = parseInt(sliderPumpSpeed.value);
    let clogging = parseInt(sliderClogging.value);
    let filterLevel = 40; // initial height %
    let pressure = 1.2;
    let isDraining = false;
    let isSystemTripped = false;

    sliderPumpSpeed.addEventListener('input', (e) => {
        if (isSystemTripped) {
            e.target.value = 0;
            return;
        }
        pumpSpeed = parseInt(e.target.value);
        lblPumpSpeed.textContent = pumpSpeed;
        textOutFiltPump.textContent = `${pumpSpeed}Hz`;
        
        if (pumpSpeed > 0) {
            feedPump.classList.add('active');
            feedPump.querySelector('.pump-impeller').style.animationDuration = `${1.5 - (pumpSpeed/60)}s`;
            inflowFluid.classList.add('flowing');
        } else {
            feedPump.classList.remove('active');
            inflowFluid.classList.remove('flowing');
        }
    });

    sliderClogging.addEventListener('input', (e) => {
        clogging = parseInt(e.target.value);
        lblClogging.textContent = clogging;
    });

    btnDrainValve.addEventListener('mousedown', () => {
        isDraining = true;
        ledOutFilt2.classList.add('active');
    });

    btnDrainValve.addEventListener('mouseup', () => {
        isDraining = false;
        ledOutFilt2.classList.remove('active');
    });

    btnDrainValve.addEventListener('mouseleave', () => {
        isDraining = false;
        ledOutFilt2.classList.remove('active');
    });

    // Filtration Process Loop
    function runFiltracionLoop() {
        // Calculate outputs based on physics simulation
        if (pumpSpeed > 0 && !isSystemTripped) {
            // Level rises based on pump speed
            filterLevel += (pumpSpeed / 200);
            
            // Pressure drop across membrane depends on speed & clogging
            const flowResistance = 1.0 + (clogging / 20);
            pressure = (pumpSpeed / 30) * flowResistance;
        } else {
            // Natural level drop through gravity flow
            filterLevel -= (filterLevel / 100);
            pressure = Math.max(0, pressure - 0.1);
        }

        // Outflow dependent on filter level and membrane permeability
        const permeability = 1.0 - (clogging / 100);
        if (filterLevel > 50 && permeability > 0.05) {
            filterLevel -= (filterLevel / 150) * permeability;
            outflowFluid.classList.add('flowing');
        } else {
            outflowFluid.classList.remove('flowing');
        }

        // Apply drainage valve
        if (isDraining) {
            filterLevel = Math.max(0, filterLevel - 3);
        }

        // Clamp level
        filterLevel = Math.min(100, Math.max(0, filterLevel));

        // Update view
        filterTankFill.style.height = `${filterLevel}%`;
        gaugePressure.textContent = `${pressure.toFixed(1)} bar`;
        textInFiltPress.textContent = `${pressure.toFixed(1)} bar`;
        textInFiltLevel.textContent = `${Math.round(filterLevel)}%`;

        // Safety Interlock Check (High Pressure Shutdown)
        if (pressure >= 3.0) {
            isSystemTripped = true;
            gaugePressure.classList.add('warning-gauge');
            
            // Trip the hardware: turn off pump, reset sliders
            pumpSpeed = 0;
            sliderPumpSpeed.value = 0;
            lblPumpSpeed.textContent = 0;
            textOutFiltPump.textContent = '0Hz';
            feedPump.classList.remove('active');
            inflowFluid.classList.remove('flowing');
            
            // Show warnings on detail panel or simple log
            console.warn("SAFETY TRIP: High Pressure detected!");
        } else if (isSystemTripped && pressure < 1.0) {
            // Safe auto-reset threshold
            isSystemTripped = false;
            gaugePressure.classList.remove('warning-gauge');
        }

        setTimeout(runFiltracionLoop, 200);
    }

    runFiltracionLoop();


    // ==========================================
    // 3. ESTACIÓN REACTOR TÉRMICO (REACTOR)
    // ==========================================
    const sliderSP = document.getElementById('slider-sp');
    const lblSP = document.getElementById('lbl-sp');
    const sliderHeatPower = document.getElementById('slider-heat-power');
    const lblHeatPower = document.getElementById('lbl-heat-power');
    const togglePIDMode = document.getElementById('toggle-pid-mode');

    const heaterCoil = document.getElementById('heater-coil');
    const heatGlowPanel = document.getElementById('heat-glow-panel');
    const reactorFluid = document.getElementById('reactor-fluid');
    const lblTempDisplay = document.getElementById('lbl-temp-display');

    // PLC LEDs
    const textInReactTemp = document.getElementById('io-in-react-temp');
    const textOutReactHeat = document.getElementById('io-out-react-heat');
    const ledOutReact3 = document.getElementById('io-out-react-3');
    const ledInReact3 = document.getElementById('io-in-react-3');

    let setpoint = parseInt(sliderSP.value);
    let heatPower = parseInt(sliderHeatPower.value); // 0 to 100
    let currentTemp = 24.5; // ambient temperature °C
    let isPID = togglePIDMode.checked;
    
    // PID state variables
    let integralSum = 0;
    const Kp = 3.2; // Proportional gain
    const Ki = 0.08; // Integral gain

    sliderSP.addEventListener('input', (e) => {
        setpoint = parseInt(e.target.value);
        lblSP.textContent = setpoint;
    });

    sliderHeatPower.addEventListener('input', (e) => {
        if (isPID) {
            // Prevent manual adjustment in PID mode
            e.target.value = heatPower;
            return;
        }
        heatPower = parseInt(e.target.value);
        lblHeatPower.textContent = heatPower;
    });

    togglePIDMode.addEventListener('change', (e) => {
        isPID = e.target.checked;
        if (isPID) {
            sliderHeatPower.classList.add('disabled-input');
            integralSum = 0; // reset integral accumulation
        } else {
            sliderHeatPower.classList.remove('disabled-input');
        }
    });

    // Thermal Simulation Loop
    function runReactorLoop() {
        const dt = 0.2; // time step (s)

        // Safety Overtemperature Interlock
        if (currentTemp > 90.0) {
            ledInReact3.classList.add('active'); // security contact tripped
            ledOutReact3.classList.add('active'); // cooling valve opens
            heatPower = 0; // cut heating element
            sliderHeatPower.value = 0;
            lblHeatPower.textContent = 0;
            integralSum = 0;
        } else {
            ledInReact3.classList.remove('active');
            ledOutReact3.classList.remove('active');
        }

        // PID Loop Calculation (runs inside OB30 cycle simulation)
        if (isPID && currentTemp <= 90.0) {
            const error = setpoint - currentTemp;
            
            // Anti-windup integration clamp
            if (Math.abs(error) < 15.0) {
                integralSum += error * dt;
            }
            
            // Calculate Control variable (MV)
            let manipulatedVariable = (Kp * error) + (Ki * integralSum);
            
            // Clamp Manipulated Variable to hardware boundaries [0 - 100%]
            manipulatedVariable = Math.min(100, Math.max(0, manipulatedVariable));
            
            heatPower = Math.round(manipulatedVariable);
            sliderHeatPower.value = heatPower;
            lblHeatPower.textContent = heatPower;
        }

        // Thermal Physics
        // Temperature rises proportional to heater power
        const heatInput = heatPower * 0.05;
        // Dissipation to ambient
        const ambientTemp = 20.0;
        const heatLoss = (currentTemp - ambientTemp) * 0.015;
        
        // Cooling loss if cooling valve is active
        const coolingLoss = ledOutReact3.classList.contains('active') ? (currentTemp - ambientTemp) * 0.15 : 0;

        currentTemp += (heatInput - heatLoss - coolingLoss) * dt;
        
        // Render View
        lblTempDisplay.textContent = `${currentTemp.toFixed(1)}°C`;
        textInReactTemp.textContent = `${currentTemp.toFixed(1)}°C`;
        textOutReactHeat.textContent = `${heatPower}%`;

        // Update heating element visual glow
        if (heatPower > 0) {
            heaterCoil.classList.add('heating');
            heaterCoil.style.borderColor = `rgba(249, 115, 22, ${0.4 + (heatPower/150)})`;
            heatGlowPanel.style.opacity = `${heatPower / 120}`;
        } else {
            heaterCoil.classList.remove('heating');
            heatGlowPanel.style.opacity = 0;
        }

        // Shift fluid color from blue (cool) to red/orange (hot)
        // Interpolate HSL values: 217 (Blue) at 20°C down to 10 (Red) at 90°C
        const tempRatio = Math.min(1, Math.max(0, (currentTemp - 20) / 70));
        const hue = 217 - (tempRatio * 207); // shifts blue to orange/red
        reactorFluid.style.backgroundColor = `hsla(${hue}, 85%, 55%, 0.65)`;

        setTimeout(runReactorLoop, 200);
    }

    runReactorLoop();


    // ==========================================
    // 4. ESTACIÓN DE MEZCLA (MIXING STATION)
    // ==========================================
    const btnDoseA = document.getElementById('btn-dose-a');
    const btnDoseB = document.getElementById('btn-dose-b');
    const sliderStirSpeed = document.getElementById('slider-stir-speed');
    const lblStirSpeed = document.getElementById('lbl-stir-speed');
    const btnDoseOut = document.getElementById('btn-dose-out');

    const gateA = document.getElementById('gate-a');
    const gateB = document.getElementById('gate-b');
    const fillJarabeA = document.getElementById('fill-jarabe-a');
    const fillJarabeB = document.getElementById('fill-jarabe-b');
    const stirrerBlade = document.getElementById('stirrer-blade');
    const dischargeVal = document.getElementById('discharge-val');

    // PLC LEDs
    const ledOutMez0 = document.getElementById('io-out-mez-0');
    const ledOutMez1 = document.getElementById('io-out-mez-1');
    const ledOutMez3 = document.getElementById('io-out-mez-3');
    const textOutMezRPM = document.getElementById('io-out-mez-rpm');

    let levelA = 0; // %
    let levelB = 0; // %
    let stirSpeed = 0; // RPM
    let isStirring = false;
    let isFillingA = false;
    let isFillingB = false;
    let isVenting = false;
    let mixtureBlend = 0; // 0: layers, 100: fully blended green

    sliderStirSpeed.addEventListener('input', (e) => {
        stirSpeed = parseInt(e.target.value);
        lblStirSpeed.textContent = stirSpeed;
        textOutMezRPM.textContent = `${stirSpeed} RPM`;
        
        if (stirSpeed > 0) {
            stirrerBlade.classList.add('spinning');
            // speed up animation proportional to RPM
            const duration = Math.max(0.1, 1.5 - (stirSpeed / 1000));
            stirrerBlade.style.animationDuration = `${duration}s`;
        } else {
            stirrerBlade.classList.remove('spinning');
        }
    });

    btnDoseA.addEventListener('mousedown', () => {
        isFillingA = true;
        gateA.classList.add('open');
        ledOutMez0.classList.add('active');
    });

    btnDoseA.addEventListener('mouseup', () => {
        isFillingA = false;
        gateA.classList.remove('open');
        ledOutMez0.classList.remove('active');
    });

    btnDoseA.addEventListener('mouseleave', () => {
        isFillingA = false;
        gateA.classList.remove('open');
        ledOutMez0.classList.remove('active');
    });

    btnDoseB.addEventListener('mousedown', () => {
        isFillingB = true;
        gateB.classList.add('open');
        ledOutMez1.classList.add('active');
    });

    btnDoseB.addEventListener('mouseup', () => {
        isFillingB = false;
        gateB.classList.remove('open');
        ledOutMez1.classList.remove('active');
    });

    btnDoseB.addEventListener('mouseleave', () => {
        isFillingB = false;
        gateB.classList.remove('open');
        ledOutMez1.classList.remove('active');
    });

    btnDoseOut.addEventListener('mousedown', () => {
        isVenting = true;
        dischargeVal.classList.add('open');
        ledOutMez3.classList.add('active');
    });

    btnDoseOut.addEventListener('mouseup', () => {
        isVenting = false;
        dischargeVal.classList.remove('open');
        ledOutMez3.classList.remove('active');
    });

    btnDoseOut.addEventListener('mouseleave', () => {
        isVenting = false;
        dischargeVal.classList.remove('open');
        ledOutMez3.classList.remove('active');
    });

    // Mezcla Process Loop
    function runMezclaLoop() {
        const totalVolume = levelA + levelB;

        // Inflows
        if (isFillingA && totalVolume < 80) {
            levelA += 1.5;
        }
        if (isFillingB && totalVolume < 80) {
            levelB += 1.5;
        }

        // Outflows
        if (isVenting) {
            const ratio = levelA / (totalVolume || 1);
            levelA = Math.max(0, levelA - 2.5 * ratio);
            levelB = Math.max(0, levelB - 2.5 * (1 - ratio));
            
            if (levelA + levelB === 0) {
                mixtureBlend = 0; // reset blend factor
            }
        }

        // Blending chemical color simulation
        // Stirring blends yellow (A) and blue (B) into green
        if (stirSpeed > 0 && totalVolume > 10) {
            mixtureBlend = Math.min(100, mixtureBlend + (stirSpeed / 1000));
        }

        // Apply visual render heights
        fillJarabeA.style.height = `${levelA}%`;
        fillJarabeB.style.height = `${levelB}%`;

        // Blend color dynamically
        // Yellow: hsla(43, 90%, 55%, 0.6)
        // Blue: hsla(217, 85%, 55%, 0.6)
        // Blended Green: hsla(142, 70%, 45%, 0.6)
        if (mixtureBlend > 0) {
            const blendRatio = mixtureBlend / 100;
            
            // Interpolate colors to green
            const colorA_hue = 43;
            const colorB_hue = 217;
            const blend_hue = 142;

            const finalHueA = colorA_hue + (blend_hue - colorA_hue) * blendRatio;
            const finalHueB = colorB_hue + (blend_hue - colorB_hue) * blendRatio;

            fillJarabeA.style.backgroundColor = `hsla(${finalHueA}, 80%, 45%, 0.65)`;
            fillJarabeB.style.backgroundColor = `hsla(${finalHueB}, 80%, 45%, 0.65)`;
        } else {
            // Restore default colors
            fillJarabeA.style.backgroundColor = `rgba(245, 158, 11, 0.65)`;
            fillJarabeB.style.backgroundColor = `rgba(59, 130, 246, 0.65)`;
        }

        setTimeout(runMezclaLoop, 100);
    }

    runMezclaLoop();
});
