// functions/NAME.js
const data = require('./alex_mente_v4.json');

exports.handler = function(event, context) {
    // Obtén el 'id' de los parámetros de la URL.
    const id = event.queryStringParameters.i;

    // 1. Verifica si el ID existe como clave en el objeto 'responses' de tu JSON.
    if (!data.responses[id]) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "ID de respuesta no válido." })
        };
    }
    
    // Obtén el objeto de respuesta completo
    const currentResponse = data.responses[id];
    let options = [];

    // 2. Itera sobre los IDs en la propiedad 'next' (no 'options').
    // Usa un bucle `for...of` para obtener el valor de cada ID.
    if (currentResponse.next && Array.isArray(currentResponse.next)) {
        for (const opcionId of currentResponse.next) {
            // 3. Usa el ID de la opción para buscar el objeto de opción en el JSON
            // y agrégalo al array de 'options'.
            if (data.opciones[opcionId]) {
                options.push(data.opciones[opcionId]);
            }
        }
    }
    
    // Construye el objeto que se enviará al frontend.
    const object = {
        response: currentResponse,
        options: options
    };

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        // 4. Envía el objeto directamente, sin anidarlo en otra propiedad.
        body: JSON.stringify(object)
    };
};



// const data = require('./alex_mente_v4.json');
// exports.handler = function(event, context) {

//     const id = event.queryStringParameters.i;

//     options = []
//     for( opcion in data.responses[i].options ) {
//         options.push(data.opciones[opcion])
//     }

//     object = {
//         response : data.responses[i],
//         options : options
//     }

//     return {
//         statusCode: 200, // Código de estado HTTP 200 (OK)
//         headers: {
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Origin": "*", // ¡Importante para permitir peticiones desde tu frontend!
//             "Access-Control-Allow-Methods": "GET",
//             "Access-Control-Allow-Headers": "Content-Type"
//         },
//         body: JSON.stringify({ object: object}) // Envía el objeto como un objeto JSON
//     }
// }
