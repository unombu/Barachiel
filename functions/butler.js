const responses = [{id: 0, reponse: "", options: [1,2,3,4]}];

const options = [{id: 0, option: "", response: 1}];

exports.handler = async function(event, context) {
    let id = event.queryStringParameters.i;
    let option = options.find(o => o.id == id);
    let res = responses[option.id];
    let opt = [];
    for( op in res.options) {
        let opcion = options.find(e => e.id == op);
        opt.add(opcion);
    }
    return {
        statusCode: 200, // Código de estado HTTP 200 (OK)
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ opciones: opt, response : res})
    };
}