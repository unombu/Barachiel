const data = require('./alex_mente_v4.json');
exports.handler = function(event, context) {

    const id = event.queryStringParameters.i;

    options = []
    for( opcion in data.responses[i].options ) {
        options.push(data.opciones[opcion])
    }

    object = {
        response : data.responses[i],
        options : options
    }

    return {
        statusCode: 200, // Código de estado HTTP 200 (OK)
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // ¡Importante para permitir peticiones desde tu frontend!
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ object: object}) // Envía el objeto como un objeto JSON
    }
}
