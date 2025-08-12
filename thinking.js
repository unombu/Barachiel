const outputElement = document.getElementById("output")
const inputElement = document.getElementById("terminal-input")
const optionsContainer = document.getElementById("options-container")

var currentOptions = [];

// Variables para controlar la velocidad de escritura
const typingSpeed = 15 // milisegundos entre caracteres
let isTyping = false

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetch('/mind_v4.json');
  console.log(data);
  // Mensaje de bienvenida al cargar la página
  setTimeout(() => {
    systemMessage("Loading Mission Assistant . . . Done.")
    setTimeout(() => {
      systemMessage("Initiating plain laguage interface . . . Done")
      setTimeout(() => {
        systemMessage("Support session opened.")
        setTimeout(() => {
          systemMessage('Welcome to my humble abode alien v99.90.0062b,')
          //processInput(1)
        }, 1000)
        
      }, 1000)
    }, 1000)
  }, 500)

  async function processInput(id) {

    currentResponse  = data.responses[id];
    systemMessage(currentResponse.contenido);

  }

  //Manejar el envío del formulario
  inputElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !isTyping) {
          const input = inputElement.value.trim()
          if (input) {
          processInput(input)
          inputElement.value = ""
          }
      }
  })

})


async function showResponse(response) {
  console.log(response)
  await systemMessage(res);
}

function playAudio(res) {
  let audio = new Audio(res.response);
  audio.play();
}

async function processSelectedOption(option){
  let res = option.next;
  if(res.length == 0) {
    errorMessage("falto algo aca")
  }
  respuesta = data.responses[res[0]];
  let opt = [];

  respuesta.next.forEach(opID => {
      let opcion = options[opID];
      opt.push(opcion);
  });

  if(respuesta.action == "AUDIO"){
    playAudio(respuesta);
  } else if (respuesta.action == "NULL") {
    processInput();
  } else {
    await showResponse(respuesta.response);
  }

  await showResponse(respuesta.response);
  showOptions(opt);
  console.log(opt);
}

// Función para escribir texto con efecto de delay
function typeText(text, className = "") {
  return new Promise((resolve) => {
    isTyping = true
    const element = document.createElement("div")
    if (className) {
      element.classList.add(className)
    }
    outputElement.appendChild(element)

    let index = 0
    const typeNextChar = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index)
        index++
        outputElement.scrollTop = outputElement.scrollHeight
        setTimeout(typeNextChar, typingSpeed)
      } else {
        isTyping = false
        resolve()
      }
    }

    typeNextChar()
  })
}

// Función para mostrar mensaje del sistema
async function systemMessage(text) {
  await typeText(text, "system-message")
}

// Función para mostrar mensaje de error
async function errorMessage(text) {
  await typeText(text, "error-message")
}

// Función para mostrar mensaje de éxito
async function successMessage(text) {
  await typeText(text, "success-message")
}

async function userMessage(text) {
  await typeText(`> ${text}`, "user-message")
}

// Función para mostrar opciones con tamaño fijo y ellipsis
function showOptions(op) {
  optionsContainer.innerHTML = "";
  console.log(op);

  op.forEach((optionData) => { // Renamed 'option' to 'optionData' for clarity
    const optionBox = document.createElement("div");
    optionBox.classList.add("option-box");

    // Text to display comes from optionData.option
//    const truncatedText = optionData.length > 15 ? optionData.substring(0, 45) + "..." : optionData;
    optionBox.textContent = optionData.option;

    // Tooltip with full text if necessary
    if (optionData.option.length > 15) {
      const fullTextSpan = document.createElement("span");
      fullTextSpan.classList.add("full-text");
      fullTextSpan.textContent = optionData.option; // Use optionData.option for full text
      optionBox.appendChild(fullTextSpan);
    }

    optionBox.addEventListener("click", () => {
      handleOptionSelect(optionData); // Pass the entire optionData object
    });

    optionsContainer.appendChild(optionBox);
  });
}

// Función para manejar la selección de una opción
  function handleOptionSelect(option) {
    userMessage(option.option);

    // Limpiar opciones después de seleccionar
    optionsContainer.innerHTML = ""

    console.log(option)

    processSelectedOption(option)
  }