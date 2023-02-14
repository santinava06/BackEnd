const express = require('express');
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const {engine} = require('express-handlebars');
const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const mariaDB = require('./options/mariaDB.js');
const sqLite = require('./options/sqLite.js')
app.engine('hbs', engine({
    defaultLayout: false
}))
app.set("view engine", "hbs");
app.set("views", "./views")
app.use(express.static('public'))

const PORT = 8080
const connectServer = httpServer.listen(PORT, () => console.log(`Servidor http con WebSocket escuchando el puerto ${connectServer.address().port}`))
connectServer.on("error", error => console.log(`Error en servidor ${error}`))

const dBHandler = require("./classes/dbhandler.js")
const chat = new dBHandler(sqLite.options, 'mensajes')
const prod = new dBHandler(mariaDB.options, 'productos')

/
io.on('connection', async(socket) => {
    console.log('Nuevo cliente conectado')
    socket.emit('mensajes', await chat.getChat())
    socket.emit('mensaje', await chat.getChat())
    socket.emit('productos', await  prod.getAll())
    socket.emit('producto', await prod.getAll())
    socket.emit('productos-random', await prod.randomProducts())
    socket.on('new-message', async(data) => {
        await chat.saveChat(data)
        io.sockets.emit('mensaje', await chat.getChat())
    })
    socket.on('new-producto', async (data) => {
        await prod.saveProduct(data)
        io.sockets.emit('producto', await prod.getAll())
    })
})

app.get('/api/productos-test', async(req, res) =>{
    res.render('test', {titulo: 'Pruebas de Productos aleatorios', lista: prod.randomProducts()})
})

app.get('/', async(req, res) =>{
    res.render('main', {titulo: 'Engine Handlebars con Websocket', lista: prod.getAll(), mensajes: chat.getAll()})
})