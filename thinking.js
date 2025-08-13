// ----------------------------------------------------
// ## LOGICA PRINCIPAL
// ----------------------------------------------------

const outputElement = document.getElementById("output");
const inputElement = document.getElementById("terminal-input");
const optionsContainer = document.getElementById("options-container");
const startButton = document.getElementById("start-effect-btn");
const tvOverlay = document.getElementById("tv-effect-overlay");
const body = document.body;
let returnTimer;

let data;
const typingSpeed = 25;
let isTyping = false;
let currentOptions = [];
let verificationListener;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/mind_v4.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
    initializeChat();
  } catch (error) {
    console.error("No se pudieron cargar los datos de la misión:", error);
    errorMessage(
      "Error de conexión con la unidad central. No se pueden cargar los datos."
    );
  }
});

inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !isTyping) {
    const input = inputElement.value.trim();
    if (input) {
      console.log("Entrada de usuario:", input);
      inputElement.value = "";
    }
  }
});

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

async function processResponse(id) {
  const responseData = data.responses[id];
  if (!responseData) {
    errorMessage(`Error: No se encontró la respuesta con ID ${id}.`);
    return;
  }
  if (responseData.contenido) {
    await systemMessage(responseData.contenido);
  }
  handleAction(responseData.action, responseData);
  if (
    responseData.next &&
    responseData.next.length > 0 &&
    responseData.action == "NULL"
  ) {
    const options = responseData.next.map((opID) => {
      return { ...data.opciones[opID], id: opID };
    });
    currentOptions = options;
    showOptions(options);
  }
}

async function handleOptionSelect(optionData) {
  await userMessage(optionData.contenido);
  optionsContainer.innerHTML = "";
  if (optionData.next && optionData.next.length > 0) {
    const nextResponseId = optionData.next[0];
    processResponse(nextResponseId);
    if (data.responses[nextResponseId].action == "REMOVE_OPTION") {
      currentOptions = currentOptions.filter(
        (option) => option.id !== optionData.id
      );
      showOptions(currentOptions);
    }
  } else {
    console.log(
      `Fin de la rama de conversación en la opción ${optionData.id}.`
    );
  }
}

// ----------------------------------------------------
// ## ACTIONS
// ----------------------------------------------------

function handleAction(action, data) {
  if (!action) return;
  const actions = Array.isArray(action) ? action : [action];
  actions.forEach(async (act) => {
    switch (act) {
      case "AUDIO":
        reproducirAudio(data.AUDIO);
        break;
      case "VERIFY":
        const esValido = await verificar(data.KEYWORD, data.CONSUELO);
        if (esValido) {
          if (data.next) {
            processResponse(data.next[0]);
          }
        } else {
          errorMessage("Number of attempts exceeded");
          errorMessage("Rebooting...");
          initializeChat();
        }
        break;
      case "KILLSWITCH":
        errorMessage("CONEXIÓN TERMINADA.");
        await sleep(2000);
        optionsContainer.innerHTML = "";
        killswitch();
        break;
      case "GO_TO_0":
        initializeChat();
        break;
      case "SCREAMER":
        if (data.SCREAMER == "LICH") {
          lanzarScreamer("path/to/lich.jpg", "path/to/lich-audio.mp3");
        }
        if (data.SCREAMER == "BENDER") {
          lanzarScreamer("path/to/bender.jpg", "path/to/bender-audio.mp3");
        }
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

function showOptions(options) {
  optionsContainer.innerHTML = "";
  options.forEach((optionData) => {
    const optionBox = document.createElement("div");
    optionBox.classList.add("option-box");
    optionBox.textContent = optionData.contenido;
    optionBox.title = optionData.contenido;
    optionBox.addEventListener("click", () => handleOptionSelect(optionData));
    optionsContainer.appendChild(optionBox);
  });
}

function verificar(keywords, mensajesConsuelo) {
  return new Promise((resolve) => {
    let palabraActual = "";
    let palabrasClave;
    let intentosRestantes = mensajesConsuelo.length + 1;
    if (typeof keywords === "string") {
      palabrasClave = keywords.split(",").map((k) => k.trim().toLowerCase());
    } else if (Array.isArray(keywords)) {
      palabrasClave = keywords.map((k) => k.toLowerCase());
    } else {
      console.error("El formato de las keywords no es válido.");
      resolve(false);
      return;
    }
    const handleKeyDown = (event) => {
      if (event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
        palabraActual += event.key.toLowerCase();
      } else if (event.key === "Backspace") {
        palabraActual = palabraActual.slice(0, -1);
      } else if (event.key === "Enter") {
        intentosRestantes--;
        if (palabrasClave.includes(palabraActual)) {
          document.removeEventListener("keydown", verificationListener);
          resolve(true);
        } else {
          if (intentosRestantes > 0) {
            // Lógica corregida para obtener el mensaje
            const mensaje =
              mensajesConsuelo[mensajesConsuelo.length - intentosRestantes];
            systemMessage(mensaje);
            palabraActual = "";
          } else {
            document.removeEventListener("keydown", verificationListener);
            resolve(false);
          }
        }
      }
    };
    verificationListener = handleKeyDown;
    document.addEventListener("keydown", verificationListener);
    console.log(
      "Verificación iniciada. Tienes " +
        (mensajesConsuelo.length + 1) +
        " intentos."
    );
  });
}

function reproducirAudio(ruta_audio) {
  const audio = new Audio();
  audio.src = `/audios/${ruta_audio}.mp3`;
  audio
    .play()
    .then(() => {
      console.log("Audio en reproducción.");
    })
    .catch((error) => {
      console.error("Error al intentar reproducir el audio:", error);
    });
}

function lanzarScreamer(imagenUrl, audioUrl) {
  const screamerOverlay = document.createElement("div");
  screamerOverlay.style.position = "fixed";
  screamerOverlay.style.top = "0";
  screamerOverlay.style.left = "0";
  screamerOverlay.style.width = "100vw";
  screamerOverlay.style.height = "100vh";
  screamerOverlay.style.backgroundColor = "black";
  screamerOverlay.style.zIndex = "9999";
  screamerOverlay.style.backgroundImage = `url('${imagenUrl}')`;
  screamerOverlay.style.backgroundPosition = "center";
  screamerOverlay.style.backgroundRepeat = "no-repeat";
  screamerOverlay.style.backgroundSize = "contain";
  document.body.appendChild(screamerOverlay);
  if (typeof reproducirAudio === "function") {
    reproducirAudio(audioUrl);
  }
  setTimeout(() => {
    screamerOverlay.remove();
  }, 5000);
  screamerOverlay.addEventListener("click", () => {
    screamerOverlay.remove();
  });
}

function killswitch(delay = 2000) {
  const overlay = document.getElementById("reboot-overlay");
  if (!overlay) {
    console.error(
      'El div "reboot-overlay" no se encontró. No se puede reiniciar.'
    );
    return;
  }
  overlay.style.display = "flex";
  setTimeout(() => {
    window.location.reload();
  }, delay);
}

// ----------------------------------------------------
// ## AUXILIARES
// ----------------------------------------------------

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

/**
 * Muestra un video a pantalla completa.
 * @param {string} videoUrl - La URL del archivo de video (sin extensión).
 * @param {string} audioUrl - La URL del archivo de audio a reproducir.
 */
function lanzarVideo(videoUrl, audioUrl) {
  // 1. Crear el elemento de video
  const videoOverlay = document.createElement("video");
  videoOverlay.src = `${videoUrl}.mp4`; // Asume que el video es .mp4
  videoOverlay.muted = true; // El video debe estar silenciado para la reproducción automática
  videoOverlay.autoplay = true; // Reproducción automática
  videoOverlay.loop = false; // El video no se repite
  videoOverlay.playsInline = true; // Importante para la reproducción en móviles

  // 2. Aplicar estilos para que ocupe toda la pantalla
  videoOverlay.style.position = "fixed";
  videoOverlay.style.top = "0";
  videoOverlay.style.left = "0";
  videoOverlay.style.width = "100vw";
  videoOverlay.style.height = "100vh";
  videoOverlay.style.objectFit = "cover"; // Asegura que el video cubra toda el área sin distorsión
  videoOverlay.style.zIndex = "9999";

  // 3. Añadir el video al cuerpo del documento
  document.body.appendChild(videoOverlay);

  // 4. Reproducir el audio por separado (si lo necesitas)
  if (typeof reproducirAudio === "function" && audioUrl) {
    reproducirAudio(audioUrl);
  }

  // Opcional: Eliminar el video cuando termine de reproducirse
  videoOverlay.addEventListener("ended", () => {
    videoOverlay.remove();
  });

  // Opcional: Eliminarlo con un clic
  videoOverlay.addEventListener("click", () => {
    videoOverlay.remove();
  });
}

function startTVEffect() {
  body.classList.add("tv-off");
  tvOverlay.classList.add("active");

  // Inicia el temporizador de 15 minutos para volver a la normalidad
  returnTimer = setTimeout(resetEffect, 15 * 60 * 1000); // 15 minutos en milisegundos
}

function resetEffect() {
  body.classList.remove("tv-off");
  tvOverlay.classList.remove("active");
  clearTimeout(returnTimer);
}

// ----------------------------------------------------
// ## CEMENTERIO
// ----------------------------------------------------
