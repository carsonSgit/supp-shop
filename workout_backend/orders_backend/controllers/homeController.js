const express = require('express');
const router = express.Router();
const routeRoot = '/';

router.get('/home', helloMessage);
function helloMessage(request,response){

  //  response.cookie('name', 'Alejandro', {maxAge: 60000, httpOnly: true});
  //  response.cookie('username', 'monkeynoises',{expires: new Date(Date.now() + 120000)});
    
   // const name = request.cookies.name;
   // const user = request.cookies['username'];

    //console.log(name + " this is the name cookie");
    //console.log(user + " that is the username cookie");

    response.send("Hello and welcome to the home of the orders page");

}


module.exports = {
    router,
    routeRoot,
    helloMessage
}
