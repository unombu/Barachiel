document.addEventListener('DOMContentLoaded', function() {
    const outputElement = document.getElementById('output');
    const inputElement = document.getElementById('terminal-input');
    const optionsContainer = document.getElementById('options-container');
    
    //velocidad de escritura
    const typingSpeed = 30; 
    let isTyping = false;
    
    //delay
    function typeText(text, className = '') {
        return new Promise((resolve) => {
            isTyping = true;
            const element = document.createElement('div');
            if (className) {
                element.classList.add(className);
            }
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
    
    // Función para mostrar mensaje del sistema (color amarillo)
    async function systemMessage(text) {
        await typeText(text, 'system-message');
    }
    
    // Función para mostrar mensaje de error (color rojo)
    async function errorMessage(text) {
        await typeText(text, 'error-message');
    }
    
    // Función para mostrar mensaje de éxito (color verde claro)
    async function successMessage(text) {
        await typeText(text, 'success-message');
    }
    
    // Función para mostrar opciones en cuadrados
    function showOptions(options) {
        optionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const optionBox = document.createElement('div');
            optionBox.classList.add('option-box');
            
            const optionNumber = document.createElement('span');
            optionNumber.classList.add('option-number');
            optionNumber.textContent = index + 1;
            
            const optionText = document.createElement('span');
            optionText.textContent = option.text;
            
            optionBox.appendChild(optionNumber);
            optionBox.appendChild(optionText);
            
            optionBox.addEventListener('click', () => {
                handleOptionSelect(option);
            });
            
            optionsContainer.appendChild(optionBox);
        });
    }
    
    // Función para manejar la selección de una opción
    function handleOptionSelect(option) {
        typeText(`Seleccionado: ${option.text}`);
        
        // Aquí puedes agregar la lógica para manejar la opción seleccionada
        if (option.action) {
            option.action();
        }
    }
    
    // Función para procesar el input del usuario
    function processInput(input) {
        typeText(`> ${input}`);
        
        // Aquí puedes agregar la lógica para procesar los comandos
        // Este es solo un ejemplo básico
        if (input.toLowerCase() === 'ayuda') {
            systemMessage('Comandos disponibles: ayuda, opciones, limpiar, saludo');
        } else if (input.toLowerCase() === 'opciones') {
            showExampleOptions();
        } else if (input.toLowerCase() === 'limpiar') {
            outputElement.innerHTML = '';
        } else if (input.toLowerCase() === 'saludo') {
            successMessage('¡Hola, usuario! Bienvenido al Terminal Talos.');
        } else {
            errorMessage(`Comando no reconocido: "${input}"`);
        }
    }
    
    // Ejemplo de opciones
    function showExampleOptions() {
        const options = [
            { 
                text: 'Opción 1: Iniciar simulación', 
                action: () => typeText('Iniciando simulación...') 
            },
            { 
                text: 'Opción 2: Acceder a archivos', 
                action: () => systemMessage('Accediendo a archivos del sistema...') 
            },
            { 
                text: 'Opción 3: Ejecutar diagnóstico', 
                action: () => successMessage('Diagnóstico completado. Sistemas operativos.') 
            },
            { 
                text: 'Opción 4: Salir', 
                action: () => errorMessage('Cerrando sesión...') 
            }
        ];
        
        showOptions(options);
    }
    
    // Manejar el envío del formulario
    inputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !isTyping) {
            const input = inputElement.value.trim();
            if (input) {
                processInput(input);
                inputElement.value = '';
            }
        }
    });
    
    // Mensaje de bienvenida al cargar la página
    setTimeout(() => {
        systemMessage('Iniciando Terminal v3.6.5...');
        setTimeout(() => {
            successMessage('Sistema inicializado correctamente.');
            setTimeout(() => {
                typeText('Escribe "ayuda" para ver los comandos disponibles.');
                setTimeout(() => {
                    showExampleOptions();
                }, 1000);
            }, 1000);
        }, 1500);
    }, 500);
    
    // Mantener el foco en el input
    document.addEventListener('click', function() {
        inputElement.focus();
    });
});