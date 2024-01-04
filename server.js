const {createServer} = require('http')
const next = require('next')

const app = next({
    dev: process.env.NODE_ENV !== 'production' //if node environment is running in development, not in production!
})

const routes = require('./routes') //define the routes for application
const handler = routes.getRequestHandler(app) //create request handler

app.prepare().then(() => {
    createServer(handler).listen(3000,(err) => { //start an http server on port 3000
        if(err ) throw err;
        console.log('Ready on localhost:3000')
    })
})