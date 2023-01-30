const { clientDB, sqlite } = require("./config/config");
const { engine } = require("express-handlebars")
const { urlencoded } = require("body-parser")
const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const messages = []
let messagesDB = []
clientDB("messages")
        .then(rows => messagesDB = rows)
        .catch(e => console.log(e))

const makeString = () => {
    let stringToSend = ""
    for (const message of messagesDB) {
        stringToSend = `${stringToSend}<br>socketId: ${message.clientID}, message: ${message.messages}`
    }
    console.log(messagesDB)
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
const PORT = 3001
const server = http.createServer(app)
const io = socketIo(server)

io.on("connection", client => {
    client.emit("messagesUpdate", makeString())

    client.on("mensaje", (data)=>{
        messages.push({ socketId: client.id, message: data })
        
        const time = Date.now()
        clientDB("messages").insert({clientID: client.id, messages: data, date: new Date(time)})
            .catch(e=>console.log(e))
            .then(clientDB("messages")
                .then((rows) => messagesDB = rows)
                .catch(e => console.log(e)))
                .then(io.sockets.emit("messagesUpdate", makeString()))
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
    sqlite("products").insert({title: productToAdd.title, price: productToAdd.price, thumbnail:productToAdd.thumbnail})
        .catch(e=>console.log(e))
    console.log(productToAdd)
    res.redirect("/")
})

server.listen(PORT, ()=> console.log(`listening on port ${PORT}`))