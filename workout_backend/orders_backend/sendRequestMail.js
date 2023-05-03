const http = require('http');
const dataToSend = {
     firstName: 'Alejandro',
     lastName: 'Cadena'
    }
    const jsonDataString = JSON.stringify(dataToSend);
    const options = {
     host: 'localhost',
     port: 1334,
     path: '/monkeymail',
     method: 'POST',
     headers: {
     'Content-Type': 'application/json',
     'Content-Length': Buffer.byteLength(jsonDataString)
     }
    }
    

let responseBody = '';
const request = http.request(options, handleResponse);
function handleResponse(response) {
    response.on('error', (err) => console.error(err)); // handle error
    response.on('data', (chunk) => responseBody += chunk); // collect response chunks
    response.on('end',() => console.log(responseBody));  // log the full response
}
request.on('error', (err) => console.error(err)); // handle error
request.write(jsonDataString);
request.end(); // finishes sending the request
