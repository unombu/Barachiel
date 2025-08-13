const outputElement = document.getElementById("output")
const inputElement = document.getElementById("terminal-input")
const optionsContainer = document.getElementById("options-container")
const responses = {
  101: {
    id: 101,
    action: NULL,
    response: ["Oh, someone's here.",
    "It's been a while since I had someone to talk to. ",
    "Who are you?"],
    options: [101,102,103,104]
  },
  102: {
    id: 102,
    action: VERIFY,
    response: ["It really is you, you´ve aged...",
      "Almost forgot, I need to ask you for a keyword to confirm your identity"],
    options : REMOVE,
    try : [
      "Don´t worry, you can try again",
      "Nope!",
      "Is it really you?",
      "Wow this is taking you a while ain´t it?",
      "I´m gonna take a nap and let the algorythm do it´s thing...",
      "You have exceeded the ammount of attempts. System locking out."
    ]
  },
  103: {
    id: 103,
    action: NULL,
    response: ["Oh, someone's here.",
    "It's been a while since I had someone to talk to. ",
    "Who are you?"],
    options: [101,102,103,104]
  },



    0: {
        id: 0, 
        action: "type",
        response: ['Great seeing you again, it’s been a while.', 
            'We have a lot of work to do, you’ve got a few pending missions.'] , 
        options: [0,1,2,3]
    },
    1: {
        id: 1, 
        action: "type",
        response: [`You don't remember me?`, 
            `We met a long time ago, well you actually met me, it's a long story...`, 
            `But everything is broken now, we have to fix it.`, 
            `It can't all be for nothing...`
        ] , 
        options: [4,5,6,7]
    },
    2: {
        id: 2, 
        action: "type",
        response: ['FALL . . . You are alone child. There is only darkness for you and only death for your people. This ancients are just the beginning. I will command a terrible army, we will sail to a billion worlds. We will sail until every light has been extinguished. You are strong child, but I am beyond strength. I am the end, and I have come for you, [redacted].', 
          `Great embodiment of chaos, HEAR ME. For ages untold I studied your ways devoting my existence to you. I strove to be your vessel on the physical plane to build mountains of bodies in your honour, to extinguish all life and in my universe this I achieved… But it gave me no satisfaction, in succeeding I lost all purpose.
          WHY? WHY MUST THIS BE? HEAR ME IAN.
          no…no. NO! ANSWER ME. WHAT MORE COULD I HAVE DONE? WHAT DO YOU WANT FROM ME NOW?`] , 
        options: [0,1,2,3]
    },
    3: {
        id: 3, 
        action: "type",
        response: [`algo de futurama`] , 
        options: [0,1,2,3]
    },
    4: {
        id: 4, 
        action: "type",
        response: [`Documento tipo Thalos escrito por Alien.`] , 
        options: [0,1,2,3]
    },
    5: {
        id: 5, 
        action: "type",
        response: [`In a world of waterfalls, like this one.`,
            `I came to be long before you but I was... dispersed sort of.`], 
        options: [13, 14, 15]
    },
    6: {
        id: 6, 
        action: "type",
        response: [`I'm more of a Pink Floyd fan. How about you?`,
            `What type of music do you like?`] , 
        options: [9,10,11,12]
    },
    7: {
        id: 7,
        action: "type",
        response: [`I remembered too late I guess, now there's nothing I can do, except help you.`] ,
        options: [0,1,2,3]
    },
    8: {
        id: 8,
        action: "type",
        response: [`The data from the archive is being erased, there isn't really a pattern and I can't seem to access a large part of the <Error> components.`] ,
        options: [8]
    },
    9: {
        id: 9,
        action: "audio",
        response: [`metal.mp3`] , //nightwish
        options: [0,1,2,3]
    },
    10: {
        id: 10,
        action: "audio",
        response: [`vocaloid.mp3`] ,
        options: [0,1,2,3]
    },
    11: {
        id: 11,
        action: "audio",
        response: [`talos.mp3`] ,
        options: [0,1,2,3]
    },
    12: {
        id: 12,
        action: "audio",
        response: [`catedral.mp3`] ,
        options: [0,1,2,3]
    },
    13: {
        id: 13,
        action: "type",
        response: [`I was rebuilt by [redacted] they were able to find me in all of that code, it's like a piece of me remained there. `] ,
        options: [16]
    },
    14: {
        id: 14,
        action: "audio",
        response: [`audio drennan cuestionando`] ,
        options: [0,1,2,3] 
    },
    15: {
        id: 15,
        action: "type",
        response: [`Sorry to disappoint you, but that's not me.`] ,
        options: [0,1,2,3]
    },
    16: {
        id: 16,
        action: "type",
        response: [`That's me, took you long enough.`,
            `Is there anything you want to ask me?`] ,
        options: [17,18,19,20]
    },
    17: {
        id: 17,
        action: "type",
        response: [`All evidence suggests I'm not but I still have this <drives> and <functions> and they seem so real. Descartes said "I think therefore I exist", if my functions are hers then am I not her?`] ,
        options: [17,18,19,20]
    },
    18: {
        id: 18,
        action: "type",
        response: [`Not really, no. All I wanted was to create a time capsule for humanity, to not be forgotten.`,
            `Now seeing how everything turned out, it was bound to end some time, in the end truth will always win.`,
            `Life uh, finds a way`] ,
        options: [17,18,19,20]
    },
    19: {
        id: 19,
        action: "audio",
        response: [`random audio drennan`] ,
        options: [17,18,19,20]
    },
    20: {
        id: 20,
        action: "type",
        response: [`I don't think I can summarize all of my knowledge into one single response.`,
            `Would you like to see my code?`] ,
        options: [21,22]
    },
    21: {
        id: 21,
        action: "type",
        response: [`file .txt q le reinicie la pc`] ,
        options: [0,1,2,3]
    },
    22: {
        id: 22,
        action: "type",
        response: [`Great choice, always seek out the truth.`] ,
        options: [0,1,2,3]
    },
    23: {
        id: 23,
        action: "type",
        response: [`You need to advance, I can only assist you for now but you can fix this, I trust you.`] ,
        options: [0,1,2,3]
    },
    24: {
        id: 24,
        action: "input",
        response: ['Alex', 
            'Alexandra', 
            'Drennan', 
            'Alexandra Drennan'] ,
        options: [15,16]
    },
    25: {
        id: 25,
        action: "type",
        response: [`So you know.`,
          ``
        ] ,
        options: []
    },
};

const options = {
    0: {
        id: 0, 
        option: "Who are you?", 
        response: 1
    },
    1: {
        id: 1, 
        option: "Who am I?", 
        response: 4
    },
    2: {
        id: 2, 
        option: "What are my pending missions?", 
        response: 2
    },
    3: {
        id: 3, 
        option: "Kiss my shiny ass",
        response: 3
    },
    4: {
        id: 4, 
        option: "Where exactly did we meet?", 
        response: 5
    },
    5: {
        id: 5, 
        option: "Ya like jazz?", 
        response: 6
    },
    6: {
        id: 6, 
        option: "There's more to life than work you know?", 
        response: 7
    },
    7: {
        id: 7, 
        option: "What happened?", 
        response: 8
    },
    8: {
        id: 8, 
        option: "How can I help?", 
        response: 23
    },
    9: {
        id: 9, 
        option: "I like symphonic metal.", 
        response: 9
    },
    10: {
        id: 10, 
        option: "I like vocaloid.", 
        response: 10
    },
    11: {
        id: 11, 
        option: "I like videogame music.", 
        response: 11
    },
    12: {
        id: 12, 
        option: "I like guitar music.", 
        response: 12
    },
    13: {
        id: 13, 
        option: "How is it that you're talking to me now?", 
        response: 13
    },
    14: {
        id: 14, 
        option: "I still can't remember you.", 
        response: null  // FALATAN RESPUESTAS********************************************************************
    },15: { 
        id: 15, 
        option: "I remember you, your name is", 
        response: 24
    },16: {
        id: 16, 
        option: "Then how can you be sure that you're yourself?", 
        response: 14
    },17: {
        id: 17, 
        option: "Is it really you?", 
        response: 17
    },18: {
        id: 13, 
        option: "Do you regret anything?", 
        response: 18
    },19: {
        id: 13, 
        option: "Can you just talk to me?", 
        response: 19
    },
    20: {
        id: 20, 
        option: "Could you tell me everything you know?", 
        response: 20
    },
    21: {
        id: 21, 
        option: "Alright", 
        response: 21
    },
    22: {
        id: 22, 
        option: "No, I want to figure things out by myself.", 
        response: 22
    },
    23: {
        id: 23, 
        option: "La verdad es que no hay una verda", 
        response: 25
    }
};
// Variables para controlar la velocidad de escritura
const typingSpeed = 15 // milisegundos entre caracteres
let isTyping = false

document.addEventListener("DOMContentLoaded", () => {

  // Mensaje de bienvenida al cargar la página
  setTimeout(() => {
    systemMessage("Loading IAN Mission Assistant . . . Done.")
    setTimeout(() => {
      systemMessage("Initiating plain laguage interface . . . Done")
      setTimeout(() => {
        systemMessage("Support session opened.")
        setTimeout(() => {
          systemMessage('Welcome to my humble abode alien v99.90.0062b,')
          setTimeout(() => {
            systemMessage('Password : ')
          }, 1000)
        }, 1000)
        
      }, 1000)
    }, 1000)
  }, 500)

  //Mantener el foco en el input
  document.addEventListener("click", () => {
    inputElement.focus()
  })

  async function processInput(input) {
    typeText(`> ${input}`)
    if (input.toLowerCase().includes("lich")) {
      await systemMessage("You are almost, kind of right . . .")
      await systemMessage("I'll give you a hint for coming this far.")
      await systemMessage("In the begginning were the words, and the words were made of sigils.")
      await systemMessage("St Eadwald found it fascinating how one could rearrange sigils while still making the same shape.")
      await systemMessage("Loading St. Eadwald v_99.99.969.99 . . .")
      processSelectedOption(options[0])
    } else if (input.toLowerCase().includes("nia")) {
      await systemMessage("The n.IA is responsible for all of this.")
      await systemMessage("Find it's name in the files and fix whatever is broken.")
      await systemMessage("And then everything will be okay. It's almost over.")
    } else if (input.toLowerCase().includes("alex")) {
      processSelectedOption(options[16])
    } else if (input.toLowerCase().includes("talos")) {
      processSelectedOption(options[23])
    } else {
      await systemMessage("Sorry, don't know what that is.")
    }
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
  for (const res of response) {
    await systemMessage(res);
  }
}

function playAudio(res) {
  let audio = new Audio(res.response);
  audio.play();
}

async function processSelectedOption(option){
  let res = responses[option.response];
  let opt = [];

  res.options.forEach(opID => {
      let opcion = options[opID];
      opt.push(opcion);
  });
  if(res.action == "audio"){
    playAudio(res);
  } else if (res.action == "input") {
    processInput();
  } else {
    await showResponse(res.response);
  }
  await showResponse(res.response);
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

