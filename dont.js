document.addEventListener("DOMContentLoaded", () => {
  const outputElement = document.getElementById("output")
  const inputElement = document.getElementById("terminal-input")
  const optionsContainer = document.getElementById("options-container")

  // Variables para controlar la velocidad de escritura
  const typingSpeed = 15 // milisegundos entre caracteres
  let isTyping = false

  // Función para manejar la selección de una opción
  function handleOptionSelect(option) {
    typeText(`> ${option.text}`)

    // Limpiar opciones después de seleccionar
    setTimeout(() => {
      optionsContainer.innerHTML = ""
    }, 500)

    // Aquí puedes agregar la lógica para manejar la opción seleccionada
    if (option.action) {
      setTimeout(() => {
        option.action()
      }, 1000)
    }
  }

  // Función para procesar el input del usuario
  function processInput(input) {
    typeText(`> ${input}`)

    // Aquí puedes agregar la lógica para procesar los comandos
    if (input.toLowerCase() === "help") {
      setTimeout(() => {
        systemMessage("Commands: help, options, clear, dialogue, list, multiple")
      }, 500)
    } else if (input.toLowerCase() === "options") {
      setTimeout(() => {
        showSimpleOptions()
      }, 500)
    } else if (input.toLowerCase() === "multiple") {
      setTimeout(() => {
        showMultipleOptions()
      }, 500)
    } else if (input.toLowerCase() === "clear") {
      outputElement.innerHTML = ""
    } else if (input.toLowerCase() === "dialogue") {
      setTimeout(() => {
        startExampleDialog()
      }, 500)
    } else if (input.toLowerCase() === "list") {
      setTimeout(() => {
        numberedList(["Una persona debe ser racional o consciente de sí misma.", "Una persona debe ser consciente."])
      }, 500)
    } else {
      setTimeout(() => {
        errorMessage(`Comando no reconocido: "${input}"`)
      }, 500)
    }
  }

  // Ejemplo de opciones simples (2 opciones)
  function showSimpleOptions() {
    const options = [
      {
        text: "Sí.",
        action: () => systemMessage('Has elegido "Sí".'),
      },
      {
        text: "No.",
        action: () => systemMessage('Has elegido "No".'),
      },
    ]

    showOptions(options)
  }

  // Ejemplo de múltiples opciones (6 opciones)
  function showMultipleOptions() {
    const options = [
      {
        text: "AT_feedback.eml",
        action: () => systemMessage("Abriendo archivo AT_feedback.eml..."),
      },
      {
        text: "team_leads.eml",
        action: () => systemMessage("Abriendo archivo team_leads.eml..."),
      },
      {
        text: "straton_of_stageira.wiki",
        action: () => systemMessage("Abriendo archivo straton_of_stageira.wiki..."),
      },
      {
        text: "library_session.log",
        action: () => systemMessage("Abriendo archivo library_session.log..."),
      },
      {
        text: "distributed_resources.dat",
        action: () => systemMessage("Abriendo archivo distributed_resources.dat..."),
      },
      {
        text: "exit",
        action: () => errorMessage("Cerrando sesión..."),
      },
    ]

    showOptions(options)
  }

// CAMBIAR NOMBRE A SHOW RESPONSE o PROCESS RESPONSE


async function showResponse(response) {
    for (res in response) {
        await systemMessage("> A frog is conscious.")
    }
}


// Manejar el envío del formulario
inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !isTyping) {
        const input = inputElement.value.trim()
        if (input) {
        processInput(input)
        inputElement.value = ""
        }
    }
})

  // Mensaje de bienvenida al cargar la página
  setTimeout(() => {
    systemMessage("Loading IAN Mission Assistant. . .Done.")
    setTimeout(() => {
      systemMessage("Initiating plain laguage interface. . .Done")
      setTimeout(() => {
        systemMessage("Support session opened.")
        setTimeout(() => {
          systemMessage('Welcome back agent 21, please confirm your identity: ')
          systemMessage('Password: ')
          // setTimeout(() => {
          //   //showSimpleOptions() //********************SI QUIERO PONER OPCIONES AL INICIO************************/
          // }, 1000)
        }, 1000)
        
      }, 1000)
    }, 1000)
  }, 500)

  // Mantener el foco en el input
  document.addEventListener("click", () => {
    inputElement.focus()
  })
})

let i = 1;
let j = 1;

async function processInput() {
    try {
        const response = await fetch(`/.netlify/functions/in_the_begining_were_the_words?i=${i,j}`); //CAMBIAR EL LINK CUANDO HAGA LO DE NETLIFY
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        res = data.response;
        opciones = data.opciones;
        console.log('Respuesta:', res);
        console.log('Opciones:', opciones);

    } catch (error) {
        console.error('Problemas de backend lpm', error);
        messageDiv.textContent = 'Error al cargar el backend. Inténtalo de nuevo. Son la 1:15am imsorry';
    }
    showResponse(res);

    showOptions([
        { text: "Sí.", action: () => handleYesResponse() },
        { text: "No.", action: () => handleNoResponse() },
    ])
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

// Función para mostrar opciones con tamaño fijo y ellipsis
function showOptions(options) {
  optionsContainer.innerHTML = ""

  options.forEach((option) => {
    const optionBox = document.createElement("div")
    optionBox.classList.add("option-box")

    // Texto truncado para mostrar
    const truncatedText = option.text.length > 15 ? option.text.substring(0, 15) + "..." : option.text
    optionBox.textContent = truncatedText

    // Tooltip con texto completo si es necesario
    if (option.text.length > 15) {
      const fullTextSpan = document.createElement("span")
      fullTextSpan.classList.add("full-text")
      fullTextSpan.textContent = option.text
      optionBox.appendChild(fullTextSpan)
    }

    optionBox.addEventListener("click", () => {
      handleOptionSelect(option)
    })

    optionsContainer.appendChild(optionBox)
  })
}