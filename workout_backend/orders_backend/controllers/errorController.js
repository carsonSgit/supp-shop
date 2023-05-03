const express = require('express');
const router = express.Router();
const routeRoot = '/';

router.all('*', errorConnecting);
function errorConnecting(request,response){
    response.sendStatus(404);
}


module.exports = {
    router,
    routeRoot,
    errorConnecting
}
