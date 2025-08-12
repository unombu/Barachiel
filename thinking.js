document.addEventListener("DOMContentLoaded", async () => {
    const outputElement = document.getElementById("output");
    const inputElement = document.getElementById("terminal-input");
    const optionsContainer = document.getElementById("options-container");

    let data;
    const typingSpeed = 25;
    let isTyping = false;

    // --- Carga de datos y inicio ---
    try {
        const response = await fetch("/mind_v4.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
        console.log("Datos cargados:", data);
        await initializeChat();
    } catch (error) {
        console.error("No se pudieron cargar los datos de la misión:", error);
        errorMessage("Error de conexión con la unidad central. No se pueden cargar los datos.");
    }

    async function initializeChat() {
        await sleep(1000);
        await systemMessage("Cargando Asistente de Misión . . . Hecho.");
        await sleep(1500);
        await systemMessage("Iniciando interfaz de lenguaje natural . . . Hecho.");
        await sleep(1500);
        await systemMessage("Sesión de soporte abierta.");
        await sleep(500);
        await systemMessage("Bienvenido a mi humilde morada, alien v99.90.0062b.");
        processResponse(1);
    }

    // --- Lógica principal ---
    async function processResponse(id) {
        const responseData = data.responses[id];
        if (!responseData) {
            errorMessage(`Error: No se encontró la respuesta con ID ${id}.`);
            return;
        }

        if (responseData.contenido) {
            await systemMessage(responseData.contenido);
        }

        // Manejar acciones especiales
        handleAction(responseData.action, responseData);

        // Mostrar las siguientes opciones si existen
        if (responseData.next && responseData.next.length > 0) {
            const options = responseData.next.map(opID => {
                // Añadimos el ID original para futuras referencias
                return { ...data.opciones[opID], id: opID };
            });
            showOptions(options);
        }
    }
    
    function handleAction(action, data) {
        if (!action) return;

        // El 'action' puede ser un array o un string
        const actions = Array.isArray(action) ? action : [action];

        actions.forEach(act => {
            switch (act) {
                case "AUDIO":
                    console.log(`Reproduciendo audio: ${data.AUDIO}`);
                    // Aquí iría la lógica para reproducir audio.
                    // Ejemplo: playAudio(data.AUDIO);
                    break;
                case "VERIFY":
                    console.log("Se requiere verificación.");
                    // Implementar lógica de verificación
                    break;
                case "KILLSWITCH":
                    errorMessage("CONEXIÓN TERMINADA.");
                    optionsContainer.innerHTML = ""; // Desactivar opciones
                    break;
                // Añadir otros casos de 'action' aquí
            }
        });
    }


    // --- Manejo de Opciones ---
    function showOptions(options) {
        optionsContainer.innerHTML = "";
        options.forEach(optionData => {
            const optionBox = document.createElement("div");
            optionBox.classList.add("option-box");
            optionBox.textContent = optionData.contenido;
            optionBox.title = optionData.contenido; // Tooltip con el texto completo

            optionBox.addEventListener("click", () => handleOptionSelect(optionData));
            optionsContainer.appendChild(optionBox);
        });
    }

    async function handleOptionSelect(optionData) {
        await userMessage(optionData.contenido);
        optionsContainer.innerHTML = ""; // Limpiar opciones

        if (optionData.next && optionData.next.length > 0) {
            // La opción seleccionada nos lleva a una nueva respuesta
            const nextResponseId = optionData.next[0];
            processResponse(nextResponseId);
        } else {
            // Si una opción no tiene 'next', podría ser el final de esa rama
            console.log(`Fin de la rama de conversación en la opción ${optionData.id}.`);
        }
    }


    // --- Utilidades ---
    function typeText(text, className = "") {
        return new Promise((resolve) => {
            isTyping = true;
            const element = document.createElement("div");
            if (className) element.classList.add(className);
            outputElement.appendChild(element);

            let index = 0;
            const typeNextChar = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    outputElement.scrollTop = outputElement.scrollHeight;
                    setTimeout(typeNextChar, typingSpeed);
                } else {
                    isTyping = false;
                    resolve();
                }
            };
            typeNextChar();
        });
    }
    
    async function systemMessage(text) { await typeText(text, "system-message"); }
    async function errorMessage(text) { await typeText(text, "error-message"); }
    async function userMessage(text) { await typeText(`> ${text}`, "user-message"); }
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    // Event listener para entrada de texto (si decides usarla en el futuro)
    inputElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !isTyping) {
            const input = inputElement.value.trim();
            if (input) {
                // Aquí podrías manejar la entrada de texto para acciones como 'VERIFY'
                console.log("Entrada de usuario:", input);
                inputElement.value = "";
            }
        }
    });
});