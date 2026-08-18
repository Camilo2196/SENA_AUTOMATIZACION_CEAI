# Plataforma Interactiva de Servosistemas y Automatización de Procesos Unitarios

Esta plataforma web es una herramienta educativa interactiva diseñada para aprendices del programa **Tecnólogo en Automatización de Sistemas Mecatrónicos** del Centro de Electricidad y Automatización Industrial (CEAI) - Ficha 224312.

Desarrollada bajo la guía del instructor **William Gutiérrez Marroquín**.

## 🚀 Características principales
1. **Configuración de Hardware PLC Siemens S7-1500**: Visualización detallada e interactiva de cada módulo en el rack (CPU 1516-3, DI, DQ, AI, AQ) y su direccionamiento de variables físicas reales de taller.
2. **Guía GEMMA Interactiva**: Consulta rápida de los estados de parada (A), funcionamiento (F) y fallo (D) con ejemplos prácticos aplicados a plantas industriales de refrescos.
3. **Simulador Secuencial GRAFCET**: Simulación paso a paso del ciclo secuencial (Reposo -> Llenado -> Mezcla -> Vaciado) controlado por eventos lógicos interactivos.
4. **Laboratorio Virtual (Simuladores de Planta)**:
   - **Estación de Llenado**: Cinta transportadora, sensor óptico y válvula de dosificación.
   - **Estación de Filtración**: Lazo de presión y control de frecuencia de bomba con interbloqueo de seguridad (> 3.0 bar).
   - **Estación de Reactor Químico**: Simulación de lazo cerrado con regulador PID (Ziegler-Nichols) para temperatura y visualización térmica.
   - **Estación de Mezcla**: Dosificación independiente de jarabes (amarillo/azul) y mezcla mecánica (gira a verde).
5. **Evaluación de Saberes**: Cuestionario interactivo de 10 preguntas sobre autómatas, direccionamiento y control de procesos con retroalimentación didáctica.

---

## 🛠️ Cómo alojar en GitHub Pages (Gratis)
Puedes subir este proyecto a GitHub para que tus alumnos accedan desde sus celulares o computadoras desde cualquier lugar:

1. **Crear repositorio en GitHub**:
   - Inicia sesión en [GitHub](https://github.com).
   - Crea un nuevo repositorio público con el nombre `servosistemas-web` (no agregues archivos README, gitignore ni licencia).
2. **Subir los archivos**:
   - En la página de tu repositorio, haz clic en **"uploading an existing file"** (subir un archivo existente).
   - Arrastra y suelta los **5 archivos** de la carpeta `plataforma_web`:
     - `index.html`
     - `styles.css`
     - `app.js`
     - `simulators.js`
     - `quiz.js`
   - Haz clic en **"Commit changes"** al final.
3. **Activar GitHub Pages**:
   - Ve a la pestaña **Settings** (Configuración) de tu repositorio.
   - En el menú izquierdo, haz clic en **Pages**.
   - En la sección **Build and deployment**, bajo *Branch*, selecciona `main` (o `master`) y la carpeta `/ (root)`. Haz clic en **Save** (Guardar).
   - Espera 1 minuto y recarga la página. Verás un banner con el enlace público: `https://<tu-usuario>.github.io/servosistemas-web/`

¡Listo! Comparte ese enlace con tus aprendices.
