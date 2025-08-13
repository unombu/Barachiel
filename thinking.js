const outputElement = document.getElementById("output");
const inputElement = document.getElementById("terminal-input");
const optionsContainer = document.getElementById("options-container");

let data;
const typingSpeed = 25;
let isTyping = false;
let currentOptions = [];

document.addEventListener("DOMContentLoaded", async () => {
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
    errorMessage(
      "Error de conexión con la unidad central. No se pueden cargar los datos."
    );
  }

  async function initializeChat() {
    await sleep(1000);
    await systemMessage("Loading Mission Assistant . . . Done.");
    await sleep(1500);
    await systemMessage("Initiating plain laguage interface . . . Done");
    await sleep(1500);
    await systemMessage("Support session opened.");
    await sleep(500);
    await systemMessage("Welcome to my humble abode alien v99.90.0062b,");
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

    if ((responseData.next && responseData.next.length > 0 ) || !responseData.action) {
      const options = responseData.next.map((opID) => {
        // Añadimos el ID original para futuras referencias
        return { ...data.opciones[opID], id: opID };
      });
      currentOptions = options;
      showOptions(options);
    }
  }

  function handleAction(action, data) {
    if (!action) return;

    // El 'action' puede ser un array o un string
    const actions = Array.isArray(action) ? action : [action];

    actions.forEach((act) => {
      switch (act) {
        case "AUDIO":
          reproducirAudio(data.AUDIO);
          break;
        case "VERIFY":
          console.log("Se requiere verificación.");
          while (data.CONSUELO.length > 0) {
            if (!verificar(data.KEYWORD)){
              let output = data.CONSUELO.pop()
              systemMessage(output);
            } else {
              processResponse(data.next);
              break;
            }
          }
          errorMessage("Number of attempts exceeded")
          errorMessage("Rebooting...")
          initializeChat();
          break;
        case "KILLSWITCH":
          errorMessage("CONEXIÓN TERMINADA.");
          optionsContainer.innerHTML = ""; // Desactivar opciones
          killswitch();
          break;
        case "GO_TO_0":
          initializeChat();
          break;
        case "SCREAMER":

          break;
        case "STARS":

          break;
        case "ERROR":

          break;
        case "ENDING":

          break;
          case "CHAOS":

          break;
      }
    });
  }

  // --- Manejo de Opciones ---
  function showOptions(options) {
    optionsContainer.innerHTML = "";
    options.forEach((optionData) => {
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
      if (data.responses[nextResponseId].action == "REMOVE_OPTION"){
        currentOptions = currentOptions.filter(option => option.id !== optionData.id);
        showOptions(currentOptions);
      }
    } else {
      // Si una opción no tiene 'next', podría ser el final de esa rama
      console.log(
        `Fin de la rama de conversación en la opción ${optionData.id}.`
      );
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

  function reproducirAudio(ruta_audio) {
    const audio = new Audio();
    audio.src = `${ruta_audio}.mp3`;

    audio
      .play()
      .then(() => {
        console.log("Audio en reproducción.");
      })
      .catch((error) => {
        console.error("Error al intentar reproducir el audio:", error);
        alert(
          "El navegador ha bloqueado la reproducción automática. Por favor, asegúrate de haber interactuado con la página."
        );
      });
  }

  async function systemMessage(text) {
    await typeText(text, "system-message");
  }
  async function errorMessage(text) {
    await typeText(text, "error-message");
  }
  async function userMessage(text) {
    await typeText(`> ${text}`, "user-message");
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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


  function verificar(keywords) {
    let palabraActual = "";
    let palabrasClave;

    // Convertimos las keywords a un array si es necesario
    if (typeof keywords === "string") {
      palabrasClave = keywords
        .split(",")
        .map((keyword) => keyword.trim().toLowerCase());
    } else if (Array.isArray(keywords)) {
      palabrasClave = keywords.map((keyword) => keyword.toLowerCase());
    } else {
      console.error("El formato de las keywords no es válido.");
      return;
    }

    // Definimos la función que se ejecutará en cada pulsación de tecla
    const handleKeyDown = (event) => {
      // Si la tecla es una letra o un número
      if (event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
        palabraActual += event.key.toLowerCase();
      } else if (event.key === "Backspace") {
        // Elimina el último caracter si se presiona la tecla de borrar
        palabraActual = palabraActual.slice(0, -1);
      } else if (event.key === "Enter") {
        if (palabrasClave.includes(palabraActual.toLocaleUpperCase())) {
          return true;
        } else {
          return false;
        }
      }


        document.removeEventListener("keydown", handleKeyDown);
        console.log("Listener de teclado desactivado.");
    };

    // Agregamos el event listener al documento
    document.addEventListener("keydown", handleKeyDown);
    console.log("Listener de teclado activado. Escribe una de las keywords.");
  }


});

/**
 * Pone la pantalla en negro, muestra un mensaje de reinicio y refresca la página.
 * @param {number} delay - El tiempo en milisegundos que se mostrará la pantalla de reinicio.
 */
function killswitch(delay = 2000) {
  const overlay = document.getElementById("reboot-overlay");

  if (!overlay) {
    console.error('El div "reboot-overlay" no se encontró. No se puede reiniciar.');
    return;
  }

  // 1. Mostrar la pantalla de reinicio (poniendo la pantalla en negro)
  overlay.style.display = "flex";

  // 2. Esperar el tiempo especificado
  setTimeout(() => {
    // 3. Recargar la página
    window.location.reload();
  }, delay);
}