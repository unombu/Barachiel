const data = require('./alex_mente_v4.json');

exports.handler = function(event, context) {
    const id = event.queryStringParameters.i;

    // Verificar si el ID existe en el objeto 'responses'
    if (!data.responses[id]) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "ID de respuesta no válido." })
        };
    }
    
    // Obtener el objeto de respuesta por su ID
    const currentResponse = data.responses[id];
    let options = [];

    // Iterar sobre los IDs que están en la propiedad 'next'
    // y usar esos IDs para buscar los objetos de opciones correspondientes
    if (currentResponse.next && Array.isArray(currentResponse.next)) {
        for (const opcionId of currentResponse.next) {
            // Suponiendo que 'opciones' es un objeto mapeado por IDs, como en tu ejemplo anterior
            if (data.opciones[opcionId]) {
                options.push(data.opciones[opcionId]);
            }
        }
    }
    
    // Construir el objeto final que se enviará al frontend
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
