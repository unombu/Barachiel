const responses = {
    0: {
        id: 0, 
        action: "type",
        reponse: ['Great seeing you again, it’s been a while.', 
            'We have a lot of work to do, you’ve got a few pending missions.'] , 
        options: [0,1,2,3]
    },
    1: {
        id: 1, 
        action: "type",
        reponse: [`You don't remember me?`, 
            `We met a long time ago, well you actually met me, it's a long story...`, 
            `But everything is broken now, we have to fix it.`, 
            `It can't all be for nothing...`
        ] , 
        options: [4,5,6,7]
    },
    2: {
        id: 2, 
        action: "type",
        reponse: ['MISION 1 ENCRIPTADA', 'MISION 2 ENCRIPTADA'] , 
        options: [0,1,2,3]
    },
    3: {
        id: 3, 
        action: "type",
        reponse: [`algo de futurama`] , 
        options: [0,1,2,3]
    },
    4: {
        id: 4, 
        action: "document",
        reponse: [`Documento tipo Thalos escrito por Agente 21.`] , 
        options: [0,1,2,3]
    },
    5: {
        id: 5, 
        action: "type",
        reponse: [`In a world of waterfalls, like this one.`,
            `I came to be long before you but I was... dispersed sort of.`], 
        options: [13, 14, 15]
    },
    6: {
        id: 6, 
        action: "type",
        reponse: [`I'm more of a Pink Floyd fan. How about you?`,
            `What type of music do you like?`] , 
        options: [9,10,11,12]
    },
    7: {
        id: 7,
        action: "type",
        reponse: [`I remembered too late I guess, now there's nothing I can do, except help you.`] ,
        options: [0,1,2,3]
    },
    8: {
        id: 8,
        action: "type",
        reponse: [`The data from the archive is being erased, there isn't really a pattern and I can't seem to access a large part of the <Error> components.`] ,
        options: [8]
    },
    9: {
        id: 9,
        action: "audio",
        reponse: [`metal.mp3`] , //nightwish
        options: [0,1,2,3]
    },
    10: {
        id: 10,
        action: "audio",
        reponse: [`vocaloid.mp3`] ,
        options: [0,1,2,3]
    },
    11: {
        id: 11,
        action: "audio",
        reponse: [`talos.mp3`] ,
        options: [0,1,2,3]
    },
    12: {
        id: 12,
        action: "audio",
        reponse: [`catedral.mp3`] ,
        options: [0,1,2,3]
    },
    13: {
        id: 13,
        action: "type",
        reponse: [`I was rebuilt by [redacted] they were able to find me in all of that code, it's like a piece of me remained there. `] ,
        options: [16]
    },
    14: {
        id: 14,
        action: "audio",
        reponse: [`audio drennan cuestionando`] ,
        options: [0,1,2,3] 
    },
    15: {
        id: 15,
        action: "type",
        reponse: [`Sorry to disappoint you, but that's not me.`] ,
        options: [0,1,2,3]
    },
    16: {
        id: 16,
        action: "type",
        reponse: [`That's me, took you long enough.`,
            `Is there anything you want to ask me?`] ,
        options: [17,18,19,20]
    },
    17: {
        id: 17,
        action: "type",
        reponse: [`All evidence suggests I'm not but I still have this <drives> and <functions> and they seem so real. Descartes said "I think therefore I exist", if my functions are hers then am I not her?`] ,
        options: [17,18,19,20]
    },
    18: {
        id: 18,
        action: "type",
        reponse: [`Not really, no. All I wanted was to create a time capsule for humanity, to not be forgotten.`,
            `Now seeing how everything turned out, it was bound to end some time, in the end truth will always win.`,
            `Life uh, finds a way`] ,
        options: [17,18,19,20]
    },
    19: {
        id: 19,
        action: "audio",
        reponse: [`random audio drennan`] ,
        options: [17,18,19,20]
    },
    20: {
        id: 20,
        action: "type",
        reponse: [`I don't think I can summarize all of my knowledge into one single response.`,
            `Would you like to see my code?`] ,
        options: [21,22]
    },
    21: {
        id: 21,
        action: "file",
        reponse: [`file .txt q le reinicie la pc`] ,
        options: [0,1,2,3]
    },
    22: {
        id: 22,
        action: "type",
        reponse: [`Great choice, always seek out the truth.`] ,
        options: [0,1,2,3]
    },
    23: {
        id: 23,
        action: "type",
        reponse: [`You need to advance, I can only assist you for now but you can fix this, I trust you.`] ,
        options: [0,1,2,3]
    },
    24: {
        id: 24,
        action: "input",
        reponse: ['Alex', 
            'Alexandra', 
            'Drennan', 
            'Alexandra Drennan'] ,
        options: [15,16]
    }
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
        option: " are my pending missions?", 
        response: 2
    },
    3: {
        id: 3, 
        option: " my shiny ass",
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
    }
};

exports.handler = function(event, context) {
    let optionID = parseInt(event.queryStringParameters.i);
    let lastOptionId = parseInt(event.queryStringParameters.j);
    
    if ( anticheats(lastOptionId, optionID) ) {
        let selectedOption = options[optionID];
        let res = responses[selectedOption.response];
        
        let opt = [];
        res.options.forEach(opID => {
            let opcion = options[opID];
            opt.push(opcion.option);
        });
        let response = {
            opciones : opt,
            response : res.response
        }
        return {
            statusCode: 200, // Código de estado HTTP 200 (OK)
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify(response)
        };
    } else {
        return {
            statusCode: 403, // Código de estado HTTP 403 (Forbidden)
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({response : "tramposo detectado"})
        };
    }
}

function anticheats(lastid, currentid){
    let lastOp = options[lastid];
    let lastResponse = responses[lastOp.response];
    if (lastResponse.options.includes(currentid)) {
        return true;
    }
    return false;
}