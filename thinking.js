// ----------------------------------------------------
// ## LOGICA PRINCIPAL
// ----------------------------------------------------

const outputElement = document.getElementById("output");
const inputElement = document.getElementById("terminal-input");
const optionsContainer = document.getElementById("options-container");
const startButton = document.getElementById("start-effect-btn");
const tvOverlay = document.getElementById("tv-effect-overlay");
const imagenContainer = document.getElementById("imagen-container");
const body = document.body;
let returnTimer;
let checkpoint = 1;

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
  await sleep(1500);
  processResponse("1");
}

async function processResponse(id) {
  const responseData = data.responses[id];
  if (!responseData) {
    errorMessage(`Error: No se encontró la respuesta con ID ${id}.`);
    return;
  }
  if (responseData.contenido) {
    if (responseData.action.includes("ERROR")) {
      await errorMessage(responseData.contenido);
    } else {
      await systemMessage(responseData.contenido);
    }
  }
  handleAction(responseData.action, { ...responseData, id: id });
  if (
    responseData.next &&
    responseData.next.length > 0 &&
    !responseData.action.includes("VERIFY") &&
    !responseData.action.includes("CHAOS")
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
    backtocheckpoint();
  }
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

// ----------------------------------------------------
// ## ACTIONS
// ----------------------------------------------------

function handleAction(action, resData) {
  if (!action) return;
  const actions = Array.isArray(action) ? action : [action];
  actions.forEach(async (act) => {
    switch (act) {
      case "AUDIO":
        if (resData.AUDIO == "RANDOM") {
          let audios = [
            "0.mp3",
            "0-1.mp3",
            "0-2.mp3",
            "0-3.mp3",
            "0-4.mp3",
            "0-5.mp3",
            "B.mp3",
            "I.mp3",
            "I-1.mp3",
            "L.mp3",
            "O.mp3",
            "O-1.mp3",
            "S.mp3",
            "S-2.mp3",
            "T.mp3",
            "U.mp3",
            "V.mp3",
            "Y.mp3",
          ];
          let indiceAleatorio = Math.floor(Math.random() * audios.length);
          reproducirAudio(audios[indiceAleatorio]);
        } else {
          reproducirAudio(`${resData.AUDIO}.mp3`);
        }
        backtocheckpoint();
        break;
      case "VERIFY":
        const esValido = await verificar(resData.KEYWORD, resData.CONSUELO);
        if (esValido) {
          if (resData.next) {
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
        lanzarScreamer(`LICH.jpg`, `LICH.mp3`);
        await sleep(2000);
        optionsContainer.innerHTML = "";
        killswitch();
        break;
      case "IMAGEN":
        abrirImagen();
        break;
      case "SCREAMER":
        lanzarScreamer(`${resData.SCREAMER}.jpg`, `${resData.SCREAMER}.mp3`);
        backtocheckpoint();
        break;
      case "STARS":
        sleep(20 * 1000);
        stars();
        break;
      case "ERROR":
        triggerScreenGlitch();
        break;
      case "CHAOS":
        await errorMessage("Such a fool...");
        await sleep(1500);
        await errorMessage("You have come far, I fear it may be over soon.");
        await sleep(2000);
        await errorMessage("But I will survive end itself");
        await sleep(1500);
        await systemMessage("No, you won't");
        await sleep(1000);
        startTVEffect();
        const options = resData.next.map((opID) => {
          return { ...data.opciones[opID], id: opID };
        });
        currentOptions = options;
        showOptions(options);
        break;
      case "CHECKPOINT":
        checkpoint = resData.id;
        break;
      case "ENDING":
        youWIN();
        break;
      case "LINK":
        systemMessageWithLink(resData.LINK, resData.LINK);
        backtocheckpoint();
        break;
      case "GO_BACK":
        backtocheckpoint();
    }
  });
}

/**
 * Activa un efecto de glitch en toda la pantalla por un tiempo determinado.
 * @param {number} [duration=800] - La duración del efecto en milisegundos.
 */
function triggerScreenGlitch(duration = 800) {
  // Añade la clase al body para iniciar la animación CSS
  document.body.classList.add("screen-glitch");

  // Quita la clase después de la duración especificada para detener el efecto
  setTimeout(() => {
    document.body.classList.remove("screen-glitch");
  }, duration);
}

function stars() {
  const overlay = document.getElementById("stars-overlay");
  if (!overlay) {
    console.error(
      'El div "stars-overlay" no se encontró. No se puede reiniciar.'
    );
    return;
  }
  overlay.style.display = "flex";
  generateStars(169);
  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
  });
  backtocheckpoint();
}

function backtocheckpoint() {
  optionsContainer.innerHTML = "";
  const optionBox = document.createElement("div");
  optionBox.classList.add("option-box");
  optionBox.textContent = "Back to checkpoint?";
  optionBox.title = "Back to checkpoint?";
  optionBox.addEventListener("click", () => {
    processResponse(checkpoint);
  });
  optionsContainer.appendChild(optionBox);
}

function verificar(keywords, mensajesConsuelo) {
  optionsContainer.innerHTML = "";
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
    const handleKeyDown = async (event) => {
      if (event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
        palabraActual += event.key.toLowerCase();
      } else if (event.key === "Backspace") {
        palabraActual = palabraActual.slice(0, -1);
      } else if (event.key === "Enter") {
        intentosRestantes--;
        await userMessage(palabraActual);
        if (palabrasClave.includes(palabraActual)) {
          document.removeEventListener("keydown", verificationListener);
          resolve(true);
        } else {
          if (intentosRestantes > 0) {
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
  audio.src = `/audios/${ruta_audio}`;
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
  screamerOverlay.style.backgroundImage = `url('/images/${imagenUrl}')`;
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

function killswitch(delay = 10 * 1000) {
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

function generateStars(numberOfStars) {
  const container = document.querySelector(".star-container");

  if (!container) {
    console.error("El contenedor .star-container no fue encontrado.");
    return;
  }

  const animationTypes = ["pulsing", "flickering", "rotating"];

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const animationType = animationTypes[i % animationTypes.length];
    star.setAttribute("data-star-type", animationType);

    // Posiciona la estrella aleatoriamente
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    star.style.left = `${x}vw`;
    star.style.top = `${y}vh`;

    // Si la estrella es de tipo "flickering", asigna un retraso aleatorio
    if (animationType === "flickering") {
      const randomDelay = Math.random() * 2; // Retraso aleatorio entre 0 y 2 segundos
      star.style.animationDelay = `${randomDelay}s`;
    }

    container.appendChild(star);
  }
}

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

function startTVEffect() {
  body.classList.add("tv-off");
  tvOverlay.classList.add("active");

  returnTimer = setTimeout(resetEffect, 5 * 60 * 1000); // 15 minutos en milisegundos
}

function resetEffect() {
  body.classList.remove("tv-off");
  tvOverlay.classList.remove("active");
  clearTimeout(returnTimer);
}

function abrirImagen() {
  if (imagenContainer.classList.contains("visible")) {
    return;
  }

  imagenContainer.classList.add("visible");

  imagenContainer.addEventListener("click", cerrarImagen);
}

// Función para cerrar la imagen
function cerrarImagen() {
  if (!imagenContainer.classList.contains("visible")) {
    return;
  }
  imagenContainer.classList.remove("visible");

  imagenContainer.removeEventListener("click", cerrarImagen);
}

async function systemMessageWithLink(text, linkUrl) {
  const outputDiv = document.getElementById("output");

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("system-message");

  const linkElement = document.createElement("a");
  linkElement.href = linkUrl;
  linkElement.target = "_blank";

  messageContainer.appendChild(linkElement);
  outputDiv.appendChild(messageContainer);

  await typeTextInElement(linkElement, text);
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

function typeTextInElement(element, text) {
  return new Promise((resolve) => {
    isTyping = true;
    let index = 0;
    const typeNextChar = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        isTyping = false;
        resolve();
      }
    };
    typeNextChar();
  });
}

function youWIN() {
  const contenedor = document.getElementById("celebration-container");
  const textoWin = document.querySelector(".win-text");

  // Oculta el botón
  document.getElementById("iniciar-fiesta").style.display = "none";

  // 1. Activa el fondo giratorio y el texto "YOU WIN"
  contenedor.querySelector(".celebracion-container::before").style.opacity = 1;
  textoWin.classList.add("animate");

  // 2. Hace que cada letra salte
  const letters = textoWin.textContent.split("");
  textoWin.innerHTML = "";
  letters.forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.classList.add("letter-jump");
    span.style.animationDelay = `${index * 0.1}s`;
    textoWin.appendChild(span);
  });

  // 3. Lanza el confeti
  lanzarConfeti(100);

  // 4. Inicia la secuencia de "fade to white"
  setTimeout(() => {
    document.body.classList.add("fade-to-white");
  }, 4000); // Inicia después de 4 segundos de fiesta

  // 5. Reinicia la página para volver a empezar
  setTimeout(() => {
    window.location.reload();
  }, 6000); // Recarga después de 6 segundos
}

function lanzarConfeti(cantidad) {
  const contenedor = document.getElementById("celebration-container");
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
  ];

  for (let i = 0; i < cantidad; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // Asigna un color y posición aleatorios
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.backgroundColor = randomColor;
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = `${-10}vh`; // Empieza arriba de la pantalla

    // Asigna una duración de animación y un retraso aleatorios
    const duration = Math.random() * 2 + 1; // 1 a 3 segundos
    const delay = Math.random() * 0.5; // 0 a 0.5 segundos
    confetti.style.animationDuration = `${duration}s`;
    confetti.style.animationDelay = `${delay}s`;

    contenedor.appendChild(confetti);

    // Elimina el elemento del DOM después de que la animación termine
    confetti.addEventListener("animationend", () => {
      confetti.remove();
    });
  }
}

// ----------------------------------------------------
// ## CEMENTERIO
// ----------------------------------------------------
