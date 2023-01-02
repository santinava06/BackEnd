const { engine } = require("express-handlebars")
const fs = require('fs')
const { urlencoded } = require("body-parser")
const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const messages = []
const makeString = () => {
    let stringToSend = ""
    for (const message of messages) {
        stringToSend = `${stringToSend}<br>socketId: ${message.socketId}, message: ${message.message}`
    }
    return stringToSend
}

const products = [
    {
        title: "Calculator",
        price: 280,
        thumbnail: "https://cdn4.iconfinder.com/data/icons/business-1221/24/Calculator-256.png",
    },
    {
        title: "Phone",
        price: 190,
        thumbnail: "https://cdn4.iconfinder.com/data/icons/apple-products-2026/512/iPhone_X_home-screen-256.png",
    },
    {
        title: "Laptop",
        price: 370,
        thumbnail: "https://cdn0.iconfinder.com/data/icons/startup-17/32/startup-03-256.png",
    },
    {
        title: "Camera",
        price: 310,
        thumbnail: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/camera-alt-256.png",
    }
]

const app = express()
const PORT = 3000
const server = http.createServer(app)
const io = socketIo(server)

io.on("connection", client => {
    console.log(`new client: ${client.id}`)

    client.emit("messagesUpdate", makeString())

    client.on("mensaje", (data)=>{
        messages.push({ socketId: client.id, message: data })
        io.sockets.emit("messagesUpdate", makeString())
        console.log(messages);
    })
})

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./views")
app.use(express.static("public"))
app.use(urlencoded({ extended: true }))


app.get("/productos", (_, res)=>{
    res.render("prods", {productos: products})
})
app.post("/productos", (req, res)=>{
    const productToAdd = req.body
    products.push(productToAdd)
    console.log(productToAdd)
    res.redirect("/")
    fs.writeFile('/stock.txt', JSON.stringify(products), ()=>{console.log('ok')})
})

server.listen(PORT, ()=> console.log(`listening on port ${PORT}`))
server.on("ERROR", error => console.log(`Hay un error en el servidor..: ${error}`));