// ----------------------------------------------------
// ## LOGICA PRINCIPAL
// ----------------------------------------------------


const outputElement = document.getElementById("output");
const inputElement = document.getElementById("terminal-input");
const optionsContainer = document.getElementById("options-container");

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
    errorMessage("Error de conexión con la unidad central. No se pueden cargar los datos.");
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
  if ((responseData.next && responseData.next.length > 0) && responseData.action == "NULL") {
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
      currentOptions = currentOptions.filter(option => option.id !== optionData.id);
      showOptions(currentOptions);
    }
  } else {
    console.log(`Fin de la rama de conversación en la opción ${optionData.id}.`);
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
        optionsContainer.innerHTML = "";
        killswitch();
        break;
      case "GO_TO_0":
        initializeChat();
        break;
      case "SCREAMER":
        if (data.SCREAMER == "LICH") {
          lanzarScreamer('path/to/lich.jpg', 'path/to/lich-audio.mp3');
        }
        if (data.SCREAMER == "BENDER") {
          lanzarScreamer('path/to/bender.jpg', 'path/to/bender-audio.mp3');
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
            const mensaje = mensajesConsuelo[mensajesConsuelo.length - intentosRestantes - 1];
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
    console.log("Verificación iniciada. Tienes " + (mensajesConsuelo.length + 1) + " intentos.");
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
    });
}

function lanzarScreamer(imagenUrl, audioUrl) {
  const screamerOverlay = document.createElement('div');
  screamerOverlay.style.position = 'fixed';
  screamerOverlay.style.top = '0';
  screamerOverlay.style.left = '0';
  screamerOverlay.style.width = '100vw';
  screamerOverlay.style.height = '100vh';
  screamerOverlay.style.backgroundColor = 'black';
  screamerOverlay.style.zIndex = '9999';
  screamerOverlay.style.backgroundImage = `url('${imagenUrl}')`;
  screamerOverlay.style.backgroundPosition = 'center';
  screamerOverlay.style.backgroundRepeat = 'no-repeat';
  screamerOverlay.style.backgroundSize = 'contain';
  document.body.appendChild(screamerOverlay);
  if (typeof reproducirAudio === 'function') {
    reproducirAudio(audioUrl);
  }
  setTimeout(() => {
    screamerOverlay.remove();
  }, 5000);
  screamerOverlay.addEventListener('click', () => {
    screamerOverlay.remove();
  });
}

function killswitch(delay = 2000) {
  const overlay = document.getElementById("reboot-overlay");
  if (!overlay) {
    console.error('El div "reboot-overlay" no se encontró. No se puede reiniciar.');
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



// ----------------------------------------------------
// ## CEMENTERIO
// ----------------------------------------------------


// const outputElement = document.getElementById("output");
// const inputElement = document.getElementById("terminal-input");
// const optionsContainer = document.getElementById("options-container");

// let data;
// const typingSpeed = 25;
// let isTyping = false;
// let currentOptions = [];

// document.addEventListener("DOMContentLoaded", async () => {
//   // --- Carga de datos y inicio ---
//   try {
//     const response = await fetch("/mind_v4.json");
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     data = await response.json();
//     console.log("Datos cargados:", data);
//     await initializeChat();
//   } catch (error) {
//     console.error("No se pudieron cargar los datos de la misión:", error);
//     errorMessage(
//       "Error de conexión con la unidad central. No se pueden cargar los datos."
//     );
//   }

//   async function initializeChat() {
//     await sleep(1000);
//     await systemMessage("Loading Mission Assistant . . . Done.");
//     await sleep(1500);
//     await systemMessage("Initiating plain laguage interface . . . Done");
//     await sleep(1500);
//     await systemMessage("Support session opened.");
//     await sleep(500);
//     await systemMessage("Welcome to my humble abode alien v99.90.0062b,");
//     processResponse(1);
//   }

//   // --- Lógica principal ---
//   async function processResponse(id) {
//     const responseData = data.responses[id];
//     if (!responseData) {
//       errorMessage(`Error: No se encontró la respuesta con ID ${id}.`);
//       return;
//     }

//     if (responseData.contenido) {
//       await systemMessage(responseData.contenido);
//     }

//     // Manejar acciones especiales
//     handleAction(responseData.action, responseData);

//     if ((responseData.next && responseData.next.length > 0 ) && !responseData.action) {
//       const options = responseData.next.map((opID) => {
//         // Añadimos el ID original para futuras referencias
//         return { ...data.opciones[opID], id: opID };
//       });
//       currentOptions = options;
//       showOptions(options);
//     }
//   }

//   function handleAction(action, data) {
//     if (!action) return;

//     // El 'action' puede ser un array o un string
//     const actions = Array.isArray(action) ? action : [action];

//     actions.forEach(async (act) => {
//       switch (act) {
//         case "AUDIO":
//           reproducirAudio(data.AUDIO);
//           break;
//         case "VERIFY":
//           console.log("Se requiere verificación.");
//           const esValido = await verificar(data.KEYWORD, data.CONSUELO);
          
//           if (esValido) {
//               if (data.next) {
//                   processResponse(data.next[0]);
//               }
//           } else {
//               // Se agotaron los intentos. Llama a la lógica de reinicio.
//               errorMessage("Number of attempts exceeded");
//               errorMessage("Rebooting...");
//               initializeChat();
//           }
//           break;
//         case "KILLSWITCH":
//           errorMessage("CONEXIÓN TERMINADA.");
//           optionsContainer.innerHTML = ""; // Desactivar opciones
//           killswitch();
//           break;
//         case "GO_TO_0":
//           initializeChat();
//           break;
//         case "SCREAMER":
//           if (data.SCREAMER = "LICH") {

//           }
//           if (data.SCREAMER = "BENDER") {
            
//           }
//           break;
//         case "STARS":

//           break;
//         case "ERROR":

//           break;
//         case "ENDING":

//           break;
//           case "CHAOS":

//           break;
//       }
//     });
//   }

//   // --- Manejo de Opciones ---
//   function showOptions(options) {
//     optionsContainer.innerHTML = "";
//     options.forEach((optionData) => {
//       const optionBox = document.createElement("div");
//       optionBox.classList.add("option-box");
//       optionBox.textContent = optionData.contenido;
//       optionBox.title = optionData.contenido; // Tooltip con el texto completo

//       optionBox.addEventListener("click", () => handleOptionSelect(optionData));
//       optionsContainer.appendChild(optionBox);
//     });
//   }

//   async function handleOptionSelect(optionData) {
//     await userMessage(optionData.contenido);
//     optionsContainer.innerHTML = ""; // Limpiar opciones

//     if (optionData.next && optionData.next.length > 0) {
//       // La opción seleccionada nos lleva a una nueva respuesta
//       const nextResponseId = optionData.next[0];
//       processResponse(nextResponseId);
//       if (data.responses[nextResponseId].action == "REMOVE_OPTION"){
//         currentOptions = currentOptions.filter(option => option.id !== optionData.id);
//         showOptions(currentOptions);
//       }
//     } else {
//       // Si una opción no tiene 'next', podría ser el final de esa rama
//       console.log(
//         `Fin de la rama de conversación en la opción ${optionData.id}.`
//       );
//     }
//   }

//   // --- Utilidades ---
//   function typeText(text, className = "") {
//     return new Promise((resolve) => {
//       isTyping = true;
//       const element = document.createElement("div");
//       if (className) element.classList.add(className);
//       outputElement.appendChild(element);

//       let index = 0;
//       const typeNextChar = () => {
//         if (index < text.length) {
//           element.textContent += text.charAt(index);
//           index++;
//           outputElement.scrollTop = outputElement.scrollHeight;
//           setTimeout(typeNextChar, typingSpeed);
//         } else {
//           isTyping = false;
//           resolve();
//         }
//       };
//       typeNextChar();
//     });
//   }

//   function reproducirAudio(ruta_audio) {
//     const audio = new Audio();
//     audio.src = `${ruta_audio}.mp3`;

//     audio
//       .play()
//       .then(() => {
//         console.log("Audio en reproducción.");
//       })
//       .catch((error) => {
//         console.error("Error al intentar reproducir el audio:", error);
//         alert(
//           "El navegador ha bloqueado la reproducción automática. Por favor, asegúrate de haber interactuado con la página."
//         );
//       });
//   }

// });


// async function systemMessage(text) {
//     await typeText(text, "system-message");
//   }
//   async function errorMessage(text) {
//     await typeText(text, "error-message");
//   }
//   async function userMessage(text) {
//     await typeText(`> ${text}`, "user-message");
//   }
//   function sleep(ms) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   }

//   // Event listener para entrada de texto (si decides usarla en el futuro)
//   inputElement.addEventListener("keydown", (event) => {
//     if (event.key === "Enter" && !isTyping) {
//       const input = inputElement.value.trim();
//       if (input) {
//         // Aquí podrías manejar la entrada de texto para acciones como 'VERIFY'
//         console.log("Entrada de usuario:", input);
//         inputElement.value = "";
//       }
//     }
//   });


// /**
//  * Muestra una imagen a pantalla completa y reproduce un sonido para crear un screamer.
//  * @param {string} imagenUrl - La URL de la imagen que se mostrará.
//  * @param {string} audioUrl - La URL del archivo de audio a reproducir.
//  */
// function lanzarScreamer(imagenUrl, audioUrl) {
//     // 1. Crear el contenedor del screamer
//     const screamerOverlay = document.createElement('div');

//     // 2. Aplicar estilos para que ocupe toda la pantalla
//     screamerOverlay.style.position = 'fixed'; // Se posiciona relativo a la ventana del navegador
//     screamerOverlay.style.top = '0';
//     screamerOverlay.style.left = '0';
//     screamerOverlay.style.width = '100vw'; // 100% del ancho de la ventana
//     screamerOverlay.style.height = '100vh'; // 100% de la altura de la ventana
//     screamerOverlay.style.backgroundColor = 'black';
//     screamerOverlay.style.zIndex = '9999'; // Un z-index muy alto para que esté por encima de todo
    
//     // 3. Establecer la imagen de fondo
//     screamerOverlay.style.backgroundImage = `url('${imagenUrl}')`;
//     screamerOverlay.style.backgroundPosition = 'center';
//     screamerOverlay.style.backgroundRepeat = 'no-repeat';
//     screamerOverlay.style.backgroundSize = 'contain'; // 'contain' para que la imagen se vea completa

//     // 4. Añadir el screamer al cuerpo del documento
//     document.body.appendChild(screamerOverlay);
    
//     // 5. Reproducir el audio usando tu función existente
//     if (typeof reproducirAudio === 'function') {
//         reproducirAudio(audioUrl);
//     } else {
//         console.error("La función 'reproducirAudio' no está definida.");
//     }

//     // Opcional: Hacer que el screamer desaparezca después de un tiempo o con un clic
//     setTimeout(() => {
//         screamerOverlay.remove();
//     }, 5000); // Se quita después de 5 segundos
    
//     // Opcional: Quitarlo con un clic
//     screamerOverlay.addEventListener('click', () => {
//         screamerOverlay.remove();
//     });
// }


// /**
//  * Inicia un proceso de verificación de keywords con múltiples intentos.
//  * @param {string|string[]} keywords - Palabras clave a verificar.
//  * @param {string[]} mensajesConsuelo - Array de mensajes a mostrar en cada intento fallido.
//  * @returns {Promise<boolean>} - Resuelve con `true` si la verificación es exitosa, `false` si se agotan los intentos.
//  */
// function verificar(keywords, mensajesConsuelo) {
//   return new Promise((resolve) => {
//     let palabraActual = "";
//     let palabrasClave;
//     let intentosRestantes = mensajesConsuelo.length + 1; // Un intento más que los mensajes de consuelo
//     let verificationListener; // Declaramos el listener para poder removerlo

//     // Normalizar keywords
//     if (typeof keywords === "string") {
//       palabrasClave = keywords
//         .split(",")
//         .map((k) => k.trim().toLowerCase());
//     } else if (Array.isArray(keywords)) {
//       palabrasClave = keywords.map((k) => k.toLowerCase());
//     } else {
//       console.error("El formato de las keywords no es válido.");
//       resolve(false);
//       return;
//     }

//     const handleKeyDown = (event) => {
//       // Manejar la entrada de texto
//       if (event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
//         palabraActual += event.key.toLowerCase();
//       } else if (event.key === "Backspace") {
//         palabraActual = palabraActual.slice(0, -1);
//       } else if (event.key === "Enter") {
//         intentosRestantes--;

//         // Verificar la coincidencia
//         if (palabrasClave.includes(palabraActual)) {
//           document.removeEventListener("keydown", verificationListener);
//           resolve(true); // Verificación exitosa
//         } else {
//           // Intento fallido
//           if (intentosRestantes > 0) {
//             const mensaje = mensajesConsuelo[mensajesConsuelo.length - intentosRestantes - 1];
//             systemMessage(mensaje); // Mostrar mensaje de consuelo
//             palabraActual = ""; // Limpiar la palabra para el siguiente intento
//           } else {
//             document.removeEventListener("keydown", verificationListener);
//             resolve(false); // Se agotaron los intentos
//           }
//         }
//       }
//     };
    
//     // Asignar y agregar el listener
//     verificationListener = handleKeyDown;
//     document.addEventListener("keydown", verificationListener);
//     console.log("Verificación iniciada. Tienes " + (mensajesConsuelo.length + 1) + " intentos.");
//   });
// }


// /**
//  * Pone la pantalla en negro, muestra un mensaje de reinicio y refresca la página.
//  * @param {number} delay - El tiempo en milisegundos que se mostrará la pantalla de reinicio.
//  */
// function killswitch(delay = 2000) {
//   const overlay = document.getElementById("reboot-overlay");

//   if (!overlay) {
//     console.error('El div "reboot-overlay" no se encontró. No se puede reiniciar.');
//     return;
//   }

//   // 1. Mostrar la pantalla de reinicio (poniendo la pantalla en negro)
//   overlay.style.display = "flex";

//   // 2. Esperar el tiempo especificado
//   setTimeout(() => {
//     // 3. Recargar la página
//     window.location.reload();
//   }, delay);
// }